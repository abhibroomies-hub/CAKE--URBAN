import React, { useState } from 'react';
import { Product, CategoryCollection } from '../../types';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  Check, 
  X, 
  Eye, 
  Sparkles, 
  ExternalLink,
  Package,
  Search,
  Move
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface ShopifyCategoriesManagerProps {
  categoriesList: string[];
  products: Product[];
  onAddCategory: (categoryName: string, meta?: Partial<CategoryCollection>) => void;
  onRemoveCategory: (categoryName: string) => void;
  onReorderCategory: (oldIndex: number, newIndex: number) => void;
  onBulkAssignCategory: (productIds: string[], categoryName: string) => void;
  onRemoveCategoryFromProducts: (productIds: string[], categoryName: string) => void;
}

export default function ShopifyCategoriesManager({
  categoriesList,
  products,
  onAddCategory,
  onRemoveCategory,
  onReorderCategory,
  onBulkAssignCategory,
  onRemoveCategoryFromProducts
}: ShopifyCategoriesManagerProps) {
  // Add / Edit Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Selected Category View / Product assignment
  const [selectedCategoryForInspect, setSelectedCategoryForInspect] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Default images for category presets
  const categoryDefaultImages: Record<string, string> = {
    'Cakes': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    'Custom Cakes': 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=800&q=80',
    'Designer Cakes': 'https://images.unsplash.com/photo-1586985289688-ca9cf4993ec0?w=800&q=80',
    'Birthday Cakes': 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&q=80',
    'Anniversary Cakes': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80',
    'Cupcakes & Jar Cakes': 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&q=80',
    'Hampers & Treats': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',
    'Premium Collection': 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=800&q=80'
  };

  // Submit new category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a category / collection title.");
      return;
    }

    if (categoriesList.includes(newTitle.trim())) {
      toast.error("A collection with this name already exists.");
      return;
    }

    const defaultImg = newImage.trim() || categoryDefaultImages[newTitle.trim()] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80';
    const slug = newSlug.trim() || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    onAddCategory(newTitle.trim(), {
      title: newTitle.trim(),
      description: newDesc.trim(),
      image: defaultImg,
      slug: slug,
      isFeatured: isFeatured
    });

    // Reset & close
    setNewTitle('');
    setNewDesc('');
    setNewImage('');
    setNewSlug('');
    setIsFeatured(false);
    setShowAddModal(false);
    toast.success(`Collection "${newTitle.trim()}" created successfully!`);
  };

  // Move up/down
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < categoriesList.length) {
      onReorderCategory(index, targetIndex);
    }
  };

  // Products in selected category
  const productsInSelectedCategory = selectedCategoryForInspect
    ? products.filter(p => p.categories?.includes(selectedCategoryForInspect))
    : [];

  const productsNotInSelectedCategory = selectedCategoryForInspect
    ? products.filter(p => !p.categories?.includes(selectedCategoryForInspect))
    : [];

  return (
    <div className="space-y-6 text-left">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[#DFB15B]" /> Categories & Collections
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Create, group, reorder, and curate product collections for storefront browsing.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="h-10 rounded-xl bg-[#DFB15B] hover:bg-white text-[#140603] text-xs font-black uppercase tracking-wider px-5 shadow-lg cursor-pointer transition-all duration-300 font-bold"
        >
          <Plus className="w-4 h-4 mr-1.5 stroke-[3]" /> Create Collection
        </Button>
      </div>

      {/* Main Collections Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesList.map((catName, idx) => {
          const productCount = products.filter(p => p.categories?.includes(catName)).length;
          const bgImg = categoryDefaultImages[catName] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80';

          return (
            <Card 
              key={catName} 
              className="rounded-[28px] border border-[#DFB15B]/15 bg-[#26130F]/45 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-[#DFB15B]/40 transition-all duration-300"
            >
              {/* Collection Image Banner */}
              <div className="aspect-[21/9] relative overflow-hidden bg-black/50">
                <img 
                  src={bgImg} 
                  alt={catName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140603] via-black/40 to-transparent" />
                
                {/* Position Badge */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold text-[#DFB15B]">
                  #{idx + 1} Position
                </div>

                {/* Product Count Badge */}
                <div className="absolute top-3 right-3 bg-[#DFB15B] text-[#140603] px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow">
                  {productCount} Product{productCount === 1 ? '' : 's'}
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-serif font-black text-white text-lg group-hover:text-[#DFB15B] transition">
                    {catName}
                  </h3>
                  <p className="text-xs text-white/50 line-clamp-2">
                    Curated collection featuring {productCount} handcrafted creations in the CakeUrban registry.
                  </p>
                </div>

                {/* Controls & Reorder buttons */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  {/* Position selector dropdown */}
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-white/40 font-bold uppercase">Pos:</span>
                    <select
                      value={idx}
                      onChange={(e) => onReorderCategory(idx, parseInt(e.target.value))}
                      className="h-8 bg-black/60 border border-white/10 rounded-lg text-xs font-mono font-bold text-[#DFB15B] px-2 cursor-pointer focus:border-[#DFB15B]"
                    >
                      {categoriesList.map((_, pIdx) => (
                        <option key={pIdx} value={pIdx}>
                          {pIdx + 1}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-20 flex items-center justify-center text-white cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === categoriesList.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-20 flex items-center justify-center text-white cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Manage Products & Delete */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCategoryForInspect(catName)}
                      className="h-8 rounded-lg text-xs border-white/15 text-white hover:bg-white/10 cursor-pointer font-bold"
                    >
                      <Package className="w-3.5 h-3.5 mr-1 text-[#DFB15B]" /> Manage
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveCategory(catName)}
                      className="h-8 w-8 p-0 rounded-lg text-rose-400/50 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal: Create New Collection (Shopify Style) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e0e0a] border border-[#DFB15B]/30 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#DFB15B]" /> Create Collection
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#DFB15B]">
                  Collection Title <span className="text-rose-400">*</span>
                </label>
                <Input 
                  placeholder="e.g. Birthday Special Cakes"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) {
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="h-11 bg-black/50 border-white/15 text-sm text-white rounded-xl focus:border-[#DFB15B]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">Description</label>
                <Textarea 
                  placeholder="Write a brief overview of what makes this collection special..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="h-20 bg-black/50 border-white/15 text-xs text-white rounded-xl focus:border-[#DFB15B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">Collection Banner Image URL</label>
                <Input 
                  placeholder="https://images.unsplash.com/..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="h-11 bg-black/50 border-white/15 text-xs text-white rounded-xl focus:border-[#DFB15B]"
                />
                <p className="text-[10px] text-white/40">Leave empty to use high-res bakery preset asset.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">URL Handle / Slug</label>
                <Input 
                  placeholder="e.g. birthday-special-cakes"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="h-10 bg-black/50 border-white/15 text-xs text-white font-mono rounded-xl focus:border-[#DFB15B]"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-11 rounded-xl border-white/10 text-white cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#DFB15B] text-[#140603] font-black uppercase text-xs tracking-wider cursor-pointer"
                >
                  Save Collection
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Manage Products in Specific Collection */}
      {selectedCategoryForInspect && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e0e0a] border border-[#DFB15B]/30 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] flex flex-col space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-serif font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#DFB15B]" /> Products in &quot;{selectedCategoryForInspect}&quot;
                </h3>
                <p className="text-xs text-white/50">
                  {productsInSelectedCategory.length} products currently tagged with this collection.
                </p>
              </div>
              <button 
                onClick={() => setSelectedCategoryForInspect(null)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Products in Collection */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-white/5">
              {productsInSelectedCategory.length === 0 ? (
                <div className="py-8 text-center text-white/40 text-xs">
                  No products currently in this collection.
                </div>
              ) : (
                productsInSelectedCategory.map(prod => (
                  <div key={prod.id} className="pt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'} 
                        alt={prod.name} 
                        className="w-10 h-10 rounded-lg object-cover bg-black/40 shrink-0" 
                      />
                      <div>
                        <p className="text-xs font-bold text-white line-clamp-1">{prod.name}</p>
                        <p className="text-[10px] text-[#DFB15B] font-mono">₹{prod.price}</p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveCategoryFromProducts([prod.id], selectedCategoryForInspect)}
                      className="h-8 text-[10px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg font-bold"
                    >
                      Remove from Collection
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Quick Add other products to this category */}
            {productsNotInSelectedCategory.length > 0 && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <p className="text-xs font-bold text-[#DFB15B]">Add Available Products to this Collection:</p>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {productsNotInSelectedCategory.slice(0, 10).map(otherProd => (
                    <div key={otherProd.id} className="flex items-center justify-between p-2 rounded-lg bg-black/30 text-xs">
                      <span className="text-white/80 line-clamp-1">{otherProd.name}</span>
                      <Button
                        size="sm"
                        onClick={() => onBulkAssignCategory([otherProd.id], selectedCategoryForInspect)}
                        className="h-6 text-[9px] bg-[#DFB15B] text-[#140603] hover:bg-white font-bold rounded"
                      >
                        + Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <Button
                onClick={() => setSelectedCategoryForInspect(null)}
                className="bg-[#DFB15B] text-[#140603] font-bold text-xs h-10 px-6 rounded-xl"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
