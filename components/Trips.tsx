
import React, { useState } from 'react';
import { Plane, MapPin, Calendar, Briefcase, Sun, Loader2, CheckCircle, CloudRain, Info } from 'lucide-react';
import { ClothingItem, PackingListResult, ClothingCategory } from '../types';
import { generatePackingList } from '../services/geminiService';

interface TripsProps {
  items: ClothingItem[];
}

export const Trips: React.FC<TripsProps> = ({ items }) => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('3 days');
  const [tripType, setTripType] = useState('Leisure');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PackingListResult | null>(null);

  const handleGenerate = async () => {
    if (!destination) return;
    setIsGenerating(true);
    setResult(null);
    try {
      const data = await generatePackingList(destination, duration, tripType, items);
      setResult(data);
    } catch (error) {
      console.error("Failed to generate list");
    } finally {
      setIsGenerating(false);
    }
  };

  const packedItems = result ? items.filter(item => result.itemIds.includes(item.id)) : [];

  // Group items by category for better display
  const groupedItems: Record<string, ClothingItem[]> = {};
  if (packedItems.length > 0) {
    Object.values(ClothingCategory).forEach(cat => {
      groupedItems[cat] = packedItems.filter(i => i.category === cat);
    });
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto pb-24 md:pb-12 bg-slate-50 min-h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-3">
          <Plane className="w-6 h-6 text-indigo-600" />
          Travel Packer
        </h2>
        <p className="text-slate-500 mt-1">Let AI build your packing list based on inferred weather and your itinerary.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. London, UK"
                  className="w-full pl-9 p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Duration</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full pl-9 p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option>Weekend</option>
                    <option>3 days</option>
                    <option>5 days</option>
                    <option>1 week</option>
                    <option>2 weeks</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Type</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-full pl-9 p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option>Leisure</option>
                    <option>Business</option>
                    <option>Adventure</option>
                    <option>Formal</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !destination}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sun className="w-5 h-5" />}
              {isGenerating ? 'Analyzing Weather...' : 'Generate Packing List'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              
              {/* Trip Summary Card */}
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-full shadow-sm text-indigo-600">
                      <CloudRain className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-indigo-900 text-lg">Trip Forecast: {result.weatherForecast}</h3>
                      <p className="text-indigo-700 mt-2 text-sm leading-relaxed">{result.tripAdvice}</p>
                    </div>
                 </div>
              </div>

               <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-slate-900 text-xl">Your Packing List ({packedItems.length} items)</h3>
               </div>
               
               {packedItems.length === 0 ? (
                 <div className="text-center p-8 bg-white rounded-xl border border-slate-200">
                   <p className="text-slate-500">No items in your closet matched this trip criteria.</p>
                 </div>
               ) : (
                 <div className="space-y-6">
                    {Object.entries(groupedItems).map(([category, catItems]) => {
                      if (catItems.length === 0) return null;
                      return (
                        <div key={category}>
                          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 pl-1">{category}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {catItems.map(item => (
                              <div key={item.id} className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col">
                                <div className="aspect-square bg-slate-100">
                                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-3 flex-1">
                                  <p className="font-semibold text-slate-900 text-sm truncate">{item.name}</p>
                                  <p className="text-xs text-slate-500 mt-1">{item.brand}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                 </div>
               )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-2xl min-h-[400px]">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Plane className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Ready for takeoff?</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">Enter your destination to see weather-aware packing suggestions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
