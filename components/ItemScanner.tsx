
import React, { useState, useRef } from 'react';
import { Camera, Loader2, CheckCircle, Tag, DollarSign, X, RefreshCw } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';
import { ClothingItem } from '../types';

interface ItemScannerProps {
  onAddItem: (item: ClothingItem, file?: File) => void;
  onCancel: () => void;
  onError?: (message: string) => void;
}

export const ItemScanner: React.FC<ItemScannerProps> = ({ onAddItem, onCancel, onError }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<Partial<ClothingItem> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        processImage(base64.split(',')[1]); // Send only base64 data for AI analysis
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64Data: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(base64Data);
      setAnalyzedData(result);
    } catch (error) {
      console.error("Analysis failed", error);
      onError?.("Failed to analyze image. Please try again.");
      setImagePreview(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (analyzedData && imagePreview) {
      setIsSaving(true);
      const newItem: any = {
        // ID is handled by Appwrite
        imageUrl: imagePreview, // Fallback preview until saved
        name: analyzedData.name || 'Unknown Item',
        category: analyzedData.category as any,
        color: analyzedData.color || 'Unknown',
        brand: analyzedData.brand || 'Unknown',
        season: analyzedData.season as any,
        resaleValue: analyzedData.resaleValue || 0,
        tags: analyzedData.tags || [],
        wearCount: 0,
        lastWorn: new Date().toISOString().split('T')[0]
      };
      
      await onAddItem(newItem, selectedFile || undefined);
      // setIsSaving(false) - handled by unmount usually, but if onAddItem is async we await it
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto pb-24 md:pb-12 bg-slate-50 min-h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 font-serif">Add New Item</h2>
           <p className="text-slate-500">Upload a photo to automatically analyze details.</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full">
          <X className="w-6 h-6 text-slate-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Upload Area */}
        <div className="space-y-4">
          <div 
            className={`border-2 border-dashed rounded-2xl h-96 flex flex-col items-center justify-center transition-colors relative overflow-hidden ${
              imagePreview ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            }`}
            onClick={() => !imagePreview && fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-4" />
            ) : (
              <div className="text-center p-6 cursor-pointer">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Tap to Upload</h3>
                <p className="text-sm text-slate-500">Supports JPG, PNG</p>
              </div>
            )}
            
            {imagePreview && (
              <button 
                onClick={(e) => { e.stopPropagation(); setImagePreview(null); setAnalyzedData(null); setSelectedFile(null); }}
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white text-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Right: Analysis Results */}
        <div className="flex flex-col h-96 justify-center">
          {isAnalyzing ? (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
              <h3 className="text-lg font-semibold text-slate-900">Analyzing Fabric & Brand...</h3>
              <p className="text-slate-500 text-sm">Our AI is checking resale value databases.</p>
            </div>
          ) : analyzedData ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-800 font-medium">Analysis Complete</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Item Name</label>
                  <input 
                    type="text" 
                    defaultValue={analyzedData.name} 
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setAnalyzedData({...analyzedData, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">Category</label>
                    <div className="mt-1 p-2 bg-slate-50 rounded-lg text-slate-900 text-sm border border-slate-200">
                      {analyzedData.category}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">Brand</label>
                     <div className="mt-1 p-2 bg-slate-50 rounded-lg text-slate-900 text-sm border border-slate-200">
                      {analyzedData.brand}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-xs text-slate-300 font-medium uppercase">Est. Resale Price</span>
                    <div className="text-2xl font-bold">${analyzedData.resaleValue}</div>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isSaving ? 'Uploading to Closet...' : 'Add to Closet'}
              </button>
            </div>
          ) : (
            <div className="text-center text-slate-400 p-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <p>Upload an image to see details here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
