
import React, { useState } from 'react';
import { Filter, Search, Pencil, X, Save, Tag, CalendarCheck, Download, Trash2, AlertCircle } from 'lucide-react';
import { ClothingItem, ClothingCategory, Season } from '../types';
import { ConfirmDialog } from './ConfirmDialog';

interface ClosetGalleryProps {
  items: ClothingItem[];
  onUpdateItem: (item: ClothingItem) => void;
  onDeleteItem: (itemId: string) => void;
}

export const ClosetGallery: React.FC<ClosetGalleryProps> = ({ items, onUpdateItem, onDeleteItem }) => {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.brand.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = ['All', ...Object.values(ClothingCategory)];

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdateItem(editingItem);
      setEditingItem(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (editingItem) {
      onDeleteItem(editingItem.id);
      setEditingItem(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleLogWear = (e: React.MouseEvent, item: ClothingItem) => {
    e.stopPropagation();
    const updatedItem = {
      ...item,
      wearCount: item.wearCount + 1,
      lastWorn: new Date().toISOString().split('T')[0]
    };
    onUpdateItem(updatedItem);
  };

  const handleExportCSV = () => {
    if (items.length === 0) return;
    
    const headers = ['Name', 'Brand', 'Category', 'Color', 'Season', 'Wear Count', 'Resale Value', 'Last Worn', 'Tags'];
    const csvContent = [
      headers.join(','),
      ...filteredItems.map(item => [
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.brand.replace(/"/g, '""')}"`,
        item.category,
        item.color,
        item.season,
        item.wearCount,
        item.resaleValue,
        item.lastWorn,
        `"${item.tags.join(' ')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `closet_inventory_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto pb-24 md:pb-12 bg-slate-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-slate-900 font-serif">My Closet</h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by brand or name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button 
            onClick={handleExportCSV}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            title="Export to CSV"
          >
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === cat 
                ? 'bg-slate-900 text-white' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="aspect-[3/4] overflow-hidden bg-slate-100 relative">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={(e) => handleLogWear(e, item)}
                  className="bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition-colors"
                  title="Wore this today (+1)"
                >
                  <CalendarCheck className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingItem(item);
                    setShowDeleteConfirm(false);
                  }}
                  className="bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white text-slate-700 hover:text-indigo-600 transition-colors"
                  title="Edit Item"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 inline-block shadow-sm border border-slate-100/50">
                  ${item.resaleValue} resale
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-slate-900 truncate">{item.name}</h3>
              <p className="text-xs text-slate-500">{item.brand}</p>
              
              <div className="flex items-center justify-between mt-2 mb-3">
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  {item.wearCount} wears
                </span>
                <span className="text-xs text-slate-400" title="Last worn date">
                  Last: {new Date(item.lastWorn).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div className="flex gap-1 flex-wrap">
                {item.tags.slice(0, 2).map(tag => (
                   <span key={tag} className="text-[10px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                     #{tag}
                   </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-400">No items found matching your filters.</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Item?"
        message={`Are you sure you want to delete ${editingItem?.name}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Edit Modal */}
      {editingItem && !showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 relative">
            <>
              <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center rounded-t-2xl z-10">
                <h3 className="font-serif text-xl font-bold text-slate-900">Edit Details</h3>
                <button 
                  onClick={() => setEditingItem(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                </div>
                
                <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-32 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                      <img src={editingItem.imageUrl} alt={editingItem.name} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Item Name</label>
                    <input 
                      type="text" 
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Brand</label>
                      <input 
                        type="text" 
                        value={editingItem.brand}
                        onChange={(e) => setEditingItem({...editingItem, brand: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Resale Value ($)</label>
                      <input 
                        type="number" 
                        value={editingItem.resaleValue}
                        onChange={(e) => setEditingItem({...editingItem, resaleValue: Number(e.target.value)})}
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                      <select 
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({...editingItem, category: e.target.value as any})}
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        {Object.values(ClothingCategory).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Season</label>
                      <select 
                        value={editingItem.season}
                        onChange={(e) => setEditingItem({...editingItem, season: e.target.value as any})}
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        {Object.values(Season).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Stats Management Section */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Wear Count</label>
                      <input 
                        type="number" 
                        min="0"
                        value={editingItem.wearCount}
                        onChange={(e) => setEditingItem({...editingItem, wearCount: parseInt(e.target.value) || 0})}
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Worn</label>
                      <input 
                        type="date" 
                        value={editingItem.lastWorn}
                        onChange={(e) => setEditingItem({...editingItem, lastWorn: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tags (comma separated)</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={editingItem.tags.join(', ')}
                        onChange={(e) => setEditingItem({...editingItem, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                        className="w-full pl-9 p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="casual, summer, vintage"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={handleDeleteClick}
                      className="p-3 border border-red-100 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="flex-1 py-3 px-4 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </form>
            </>
          </div>
        </div>
      )}
    </div>
  );
};
