import React, { useState } from 'react';
import { Product, CategoryCollection } from '../../types';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
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
  Filter,
  Tag,
  Grid,
  ChevronRight,
  Flame,
  Star,
  Gift
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { PRESET_LUXURY_COLLECTIONS } from '../../data/categoriesData';

interface ShopifyCategoriesManagerProps {
  categoriesList: string[];
  categoriesData?: CategoryCollection[];
  products: Product[];
  onAddCategory: (categoryName: string, meta?: Partial<CategoryCollection>) => Promise<void> | void;
  onUpdateCategory?: (id: string, meta: Partial<CategoryCollection>) => Promise<void> | void;
  onRemoveCategory: (categoryName: string) => Promise<void> | void;
  onReorderCategory: (oldIndex: number, newIndex: number) => Promise<void> | void;
  onBulkAssignCategory: (productIds: string[], categoryName: string) => Promise<void> | void;
  onRemoveCategoryFromProducts: (productIds: string[], categoryName: string) => Promise<void> | void;
  onSeedPresets?: () => Promise<void> | void;
}

const PRESET_ICONS = [
  "🎂", "🍫", "❤️", "🍒", "🍯", "🍓", "🌱", "👑",
  "👰", "💖", "🎈", "📸", "🎨", "🏛️", "💼", "⭐",
  "🍱", "👨‍🍳", "🌸", "🎁", "✨", "🧁", "🔥", "🎀"
];

const PRESET_BADGES = [
  "", "POPULAR", "HOT", "BESTSELLER", "FRESH", "100% VEG", 
  "LUXURY", "TIERED", "ROMANTIC", "THEME", "HD PRINT", 
  "CUSTOM", "ATELIER", "BUSINESS", "4.9★", "CHEF", "NEW", "RARE", "SALE"
];

const PRESET_IMAGE_SUGGESTIONS = [
  { name: 'Belgian Truffle', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80' },
  { name: 'Red Velvet', url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=800&q=80' },
  { name: 'Birthday Cake', url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&q=80' },
  { name: 'Wedding Multi-Tier', url: 'https://images.unsplash.com/photo-1519222970733-f546218fa6d7?w=800&q=80' },
  { name: 'Anniversary Berry', url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80' },
  { name: 'Fruit Gateaux', url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80' },
  { name: 'Pastel Designer', url: 'https://images.unsplash.com/photo-1586985289688-ca9cf4993ec0?w=800&q=80' },
  { name: 'Bento Box Cake', url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&q=80' },
  { name: 'Luxury Hamper', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80' }
];

export default function ShopifyCategoriesManager({
  categoriesList,
  categoriesData = [],
  products,
  onAddCategory,
  onUpdateCategory,
  onRemoveCategory,
  onReorderCategory,
  onBulkAssignCategory,
  onRemoveCategoryFromProducts,
  onSeedPresets
}: ShopifyCategoriesManagerProps) {
  // Add / Edit Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  
  // Form fields
  const [catTitle, setCatTitle] = useState('');
  const [catGroup, setCatGroup] = useState<'birthday' | 'designer' | 'trending' | 'general'>('birthday');
  const [catIcon, setCatIcon] = useState('🎂');
  const [catBadge, setCatBadge] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Group filter tab
  const [activeGroupTab, setActiveGroupTab] = useState<'all' | 'birthday' | 'designer' | 'trending' | 'general'>('all');

  // Selected Category View / Product assignment modal
  const [selectedCategoryForInspect, setSelectedCategoryForInspect] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [productAssignSearch, setProductAssignSearch] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  // Unified Category Items
  const unifiedCategories: CategoryCollection[] = React.useMemo(() => {
    if (categoriesData && categoriesData.length > 0) {
      return categoriesData;
    }
    // Fallback: wrap string array into CategoryCollection objects
    return categoriesList.map((name, idx) => {
      const lower = name.toLowerCase();
      let grp: 'birthday' | 'designer' | 'trending' | 'general' = 'general';
      let icn = "🎂";
      if (lower.includes('birthday') || lower.includes('chocolate') || lower.includes('velvet') || lower.includes('fruit') || lower.includes('eggless')) {
        grp = 'birthday';
        icn = lower.includes('chocolate') ? "🍫" : lower.includes('velvet') ? "❤️" : "🎂";
      } else if (lower.includes('wedding') || lower.includes('anniversary') || lower.includes('kids') || lower.includes('photo') || lower.includes('designer') || lower.includes('custom')) {
        grp = 'designer';
        icn = lower.includes('wedding') ? "👰" : lower.includes('anniversary') ? "💖" : "📸";
      } else if (lower.includes('trending') || lower.includes('bento') || lower.includes('hamper') || lower.includes('treat') || lower.includes('top')) {
        grp = 'trending';
        icn = lower.includes('bento') ? "🍱" : "⭐";
      }

      return {
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        group: grp,
        icon: icn,
        badge: '',
        description: `Handcrafted ${name} boutique collection.`,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
        sortOrder: idx + 1
      };
    });
  }, [categoriesData, categoriesList]);

  // Filtered by Group Tab & Search
  const filteredCategories = React.useMemo(() => {
    return unifiedCategories.filter(cat => {
      if (activeGroupTab !== 'all' && (cat.group || 'general') !== activeGroupTab) {
        return false;
      }
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        const matchesTitle = cat.title.toLowerCase().includes(q);
        const matchesDesc = cat.description?.toLowerCase().includes(q);
        const matchesSlug = cat.slug?.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesSlug;
      }
      return true;
    });
  }, [unifiedCategories, activeGroupTab, searchFilter]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingCatId(null);
    setCatTitle('');
    setCatGroup('birthday');
    setCatIcon('🎂');
    setCatBadge('');
    setCatDesc('');
    setCatImage('https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80');
    setCatSlug('');
    setIsFeatured(false);
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (cat: CategoryCollection) => {
    setEditingCatId(cat.id || cat.slug || cat.title);
    setCatTitle(cat.title);
    setCatGroup(cat.group || 'birthday');
    setCatIcon(cat.icon || '🎂');
    setCatBadge(cat.badge || '');
    setCatDesc(cat.description || '');
    setCatImage(cat.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80');
    setCatSlug(cat.slug || cat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    setIsFeatured(!!cat.isFeatured);
    setShowModal(true);
  };

  // Save / Update Category
  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle.trim()) {
      toast.error("Please enter a collection title.");
      return;
    }

    const cleanTitle = catTitle.trim();
    const cleanSlug = catSlug.trim() || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cleanImage = catImage.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80';

    const catPayload: Partial<CategoryCollection> = {
      title: cleanTitle,
      slug: cleanSlug,
      group: catGroup,
      icon: catIcon,
      badge: catBadge,
      description: catDesc.trim(),
      image: cleanImage,
      isFeatured: isFeatured
    };

    try {
      if (editingCatId) {
        if (onUpdateCategory) {
          await onUpdateCategory(editingCatId, catPayload);
        } else {
          // Fallback
          await onAddCategory(cleanTitle, catPayload);
        }
        toast.success(`Collection "${cleanTitle}" updated successfully!`);
      } else {
        await onAddCategory(cleanTitle, catPayload);
        toast.success(`Collection "${cleanTitle}" created & synced to Header!`);
      }
      setShowModal(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save collection. Please check connection.");
    }
  };

  // Move up/down
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < unifiedCategories.length) {
      onReorderCategory(index, targetIndex);
    }
  };

  // Seed Presets
  const handleTriggerSeedPresets = async () => {
    if (onSeedPresets) {
      setIsSeeding(true);
      try {
        await onSeedPresets();
        toast.success("✨ 16+ Standard Luxury Collections seeded into Firestore & synced to Header!");
      } catch (err) {
        toast.error("Could not seed collections");
      } finally {
        setIsSeeding(false);
      }
    } else {
      // Fallback: seed items one by one
      setIsSeeding(true);
      try {
        for (const preset of PRESET_LUXURY_COLLECTIONS) {
          await onAddCategory(preset.title, preset);
        }
        toast.success("✨ Standard Luxury Collections populated!");
      } catch (e) {
        console.error(e);
      } finally {
        setIsSeeding(false);
      }
    }
  };

  // Products in selected category
  const productsInSelectedCategory = selectedCategoryForInspect
    ? products.filter(p => p.categories?.some(c => c.toLowerCase() === selectedCategoryForInspect.toLowerCase()))
    : [];

  const productsNotInSelectedCategory = selectedCategoryForInspect
    ? products.filter(p => !p.categories?.some(c => c.toLowerCase() === selectedCategoryForInspect.toLowerCase()))
    : [];

  const filteredUnassignedProducts = productAssignSearch.trim()
    ? productsNotInSelectedCategory.filter(p => p.name.toLowerCase().includes(productAssignSearch.toLowerCase()))
    : productsNotInSelectedCategory;

  return (
    <div className="space-y-6">
      {/* 👑 Top Controls Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#26130F] to-[#1a0805] border border-[#DFB15B]/20 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#DFB15B]/15 text-[#DFB15B]">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-serif font-black text-white">
              Collections & Header MegaMenu Navigation
            </h2>
          </div>
          <p className="text-xs text-white/60 max-w-xl">
            Manage your boutique taxonomy Shopify-style. Any collection you add, edit, or reorder here instantly syncs to the customer <strong>Header &quot;Cakes&quot; MegaMenu</strong> and organizes your catalog.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Seed Presets Button */}
          <Button
            type="button"
            variant="outline"
            disabled={isSeeding}
            onClick={handleTriggerSeedPresets}
            className="h-11 rounded-2xl border-[#DFB15B]/30 bg-[#DFB15B]/10 text-[#DFB15B] hover:bg-[#DFB15B]/25 font-bold text-xs cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            {isSeeding ? "Seeding Catalog..." : "Seed 16+ Luxury Presets"}
          </Button>

          {/* Create New Collection Button */}
          <Button
            onClick={handleOpenCreateModal}
            className="h-11 rounded-2xl bg-[#DFB15B] text-[#140603] hover:bg-white font-black text-xs uppercase tracking-wider px-5 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Collection
          </Button>
        </div>
      </div>

      {/* 🧭 Filter Tabs by Header MegaMenu Column Group */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1e0e0a]/80 p-2.5 rounded-2xl border border-white/10">
        <div className="flex items-center flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveGroupTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeGroupTab === 'all'
                ? 'bg-[#DFB15B] text-[#140603] shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            All ({unifiedCategories.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveGroupTab('birthday')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeGroupTab === 'birthday'
                ? 'bg-[#DFB15B] text-[#140603] shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🎂</span> Birthday & Classics ({unifiedCategories.filter(c => c.group === 'birthday').length})
          </button>

          <button
            type="button"
            onClick={() => setActiveGroupTab('designer')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeGroupTab === 'designer'
                ? 'bg-[#DFB15B] text-[#140603] shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>👰</span> Designer & Occasions ({unifiedCategories.filter(c => c.group === 'designer').length})
          </button>

          <button
            type="button"
            onClick={() => setActiveGroupTab('trending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeGroupTab === 'trending'
                ? 'bg-[#DFB15B] text-[#140603] shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🔥</span> Trending & Specials ({unifiedCategories.filter(c => c.group === 'trending').length})
          </button>

          <button
            type="button"
            onClick={() => setActiveGroupTab('general')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeGroupTab === 'general'
                ? 'bg-[#DFB15B] text-[#140603] shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🏷️</span> General ({unifiedCategories.filter(c => !c.group || c.group === 'general').length})
          </button>
        </div>

        {/* Search inside collections */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <Input 
            placeholder="Search collections..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="h-9 pl-8 bg-black/40 border-white/10 text-xs text-white rounded-xl focus:border-[#DFB15B]"
          />
          {searchFilter && (
            <button 
              onClick={() => setSearchFilter('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 📦 Empty State */}
      {filteredCategories.length === 0 && (
        <div className="bg-[#26130F]/40 border border-white/10 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#DFB15B]/10 text-[#DFB15B] mx-auto flex items-center justify-center text-2xl">
            🎂
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-black text-white">No collections found in this view</h3>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              You haven&apos;t added any collections yet or your search filter didn&apos;t match. Click below to load our 16+ curated luxury collections or create your own!
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              onClick={handleTriggerSeedPresets}
              disabled={isSeeding}
              className="bg-[#DFB15B] text-[#140603] font-bold text-xs h-10 px-5 rounded-xl cursor-pointer"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Seed 16+ Luxury Presets
            </Button>
            <Button
              variant="outline"
              onClick={handleOpenCreateModal}
              className="border-white/20 text-white font-bold text-xs h-10 px-5 rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Custom Collection
            </Button>
          </div>
        </div>
      )}

      {/* 🗂️ Grid of Category / Collection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat, idx) => {
          const catName = cat.title;
          const bgImg = cat.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80';
          const productCount = products.filter(p => 
            p.categories?.some(c => c.toLowerCase() === catName.toLowerCase())
          ).length;

          const groupLabel = cat.group === 'birthday' 
            ? '🎂 Birthday & Classics' 
            : cat.group === 'designer' 
            ? '👰 Designer Class' 
            : cat.group === 'trending' 
            ? '🔥 Trending & Specials' 
            : '🏷️ General';

          return (
            <Card 
              key={cat.id || cat.title || idx} 
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
                
                {/* Header Group Badge */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#DFB15B] flex items-center gap-1">
                  <span>{cat.icon || "🎂"}</span>
                  <span>{groupLabel}</span>
                </div>

                {/* Badge if set */}
                {cat.badge && (
                  <div className="absolute top-3 right-3 bg-rose-600 text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow">
                    {cat.badge}
                  </div>
                )}

                {/* Product Count Floating */}
                <div className="absolute bottom-3 left-3 bg-[#DFB15B] text-[#140603] px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow">
                  {productCount} Product{productCount === 1 ? '' : 's'}
                </div>

                {/* Position Index */}
                <div className="absolute bottom-3 right-3 bg-black/80 text-white/70 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold">
                  #{idx + 1}
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif font-black text-white text-base group-hover:text-[#DFB15B] transition line-clamp-1">
                      {cat.icon} {catName}
                    </h3>
                    <a
                      href={`/shop?category=${encodeURIComponent(catName)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-[#DFB15B] hover:underline flex items-center gap-0.5 shrink-0"
                      title="View on Live Storefront"
                    >
                      <ExternalLink className="w-3 h-3" /> Shop
                    </a>
                  </div>
                  
                  <p className="text-xs text-white/50 line-clamp-2">
                    {cat.description || `Curated collection featuring ${productCount} handcrafted creations.`}
                  </p>

                  <div className="text-[10px] font-mono text-white/40 truncate">
                    handle: <span className="text-white/60">/shop?category={cat.slug || catName}</span>
                  </div>
                </div>

                {/* Controls & Reorder buttons */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  {/* Position selector */}
                  <div className="flex items-center gap-1">
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
                      disabled={idx === filteredCategories.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-20 flex items-center justify-center text-white cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCategoryForInspect(catName)}
                      className="h-8 rounded-lg text-xs border-white/15 text-white hover:bg-white/10 cursor-pointer font-bold px-2.5"
                    >
                      <Package className="w-3.5 h-3.5 mr-1 text-[#DFB15B]" /> Items ({productCount})
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEditModal(cat)}
                      className="h-8 w-8 p-0 rounded-lg text-[#DFB15B] border-[#DFB15B]/30 hover:bg-[#DFB15B]/20 cursor-pointer"
                      title="Edit Collection"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
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

      {/* 🛠️ Modal: Create / Edit Collection (Shopify Style) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e0e0a] border border-[#DFB15B]/30 rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#DFB15B]" /> 
                {editingCatId ? 'Edit Collection' : 'Create New Collection'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="space-y-4 text-left">
              {/* Collection Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#DFB15B]">
                  Collection Title <span className="text-rose-400">*</span>
                </label>
                <Input 
                  placeholder="e.g. Birthday Special Cakes"
                  value={catTitle}
                  onChange={(e) => {
                    setCatTitle(e.target.value);
                    if (!editingCatId && !catSlug) {
                      setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="h-11 bg-black/50 border-white/15 text-sm text-white rounded-xl focus:border-[#DFB15B]"
                  required
                />
              </div>

              {/* MegaMenu Header Group */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#DFB15B]">
                  Header MegaMenu Group
                </label>
                <select
                  value={catGroup}
                  onChange={(e) => setCatGroup(e.target.value as any)}
                  className="w-full h-11 bg-black/50 border border-white/15 rounded-xl px-3 text-xs font-bold text-white focus:border-[#DFB15B]"
                >
                  <option value="birthday">🎂 Column 1: Birthday & Classics</option>
                  <option value="designer">👰 Column 2: Designer & Occasions</option>
                  <option value="trending">🔥 Column 4: Trending & Specialty Specials</option>
                  <option value="general">🏷️ General Shop Collection</option>
                </select>
                <p className="text-[10px] text-white/40">
                  Controls which column this collection renders in on the Header &quot;Cakes&quot; MegaMenu.
                </p>
              </div>

              {/* Icon / Emoji Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">Icon / Emoji</label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-black/40 border border-white/10 rounded-xl max-h-24 overflow-y-auto">
                  {PRESET_ICONS.map(icn => (
                    <button
                      key={icn}
                      type="button"
                      onClick={() => setCatIcon(icn)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer ${
                        catIcon === icn ? 'bg-[#DFB15B] text-black scale-110 shadow' : 'hover:bg-white/10 text-white'
                      }`}
                    >
                      {icn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badge Tag */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">Badge Tag (Optional)</label>
                <select
                  value={catBadge}
                  onChange={(e) => setCatBadge(e.target.value)}
                  className="w-full h-10 bg-black/50 border border-white/15 rounded-xl px-3 text-xs font-bold text-white focus:border-[#DFB15B]"
                >
                  {PRESET_BADGES.map(b => (
                    <option key={b} value={b}>{b ? `${b}` : 'None'}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">Description</label>
                <Textarea 
                  placeholder="Write a brief overview of what makes this collection special..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="h-16 bg-black/50 border-white/15 text-xs text-white rounded-xl focus:border-[#DFB15B]"
                />
              </div>

              {/* Banner Image & Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">Banner Image URL</label>
                <Input 
                  placeholder="https://images.unsplash.com/..."
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="h-10 bg-black/50 border-white/15 text-xs text-white rounded-xl focus:border-[#DFB15B]"
                />
                
                {/* Quick Preset Selector */}
                <div className="pt-1">
                  <span className="text-[10px] text-white/40 block mb-1">Or pick high-res bakery preset image:</span>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_IMAGE_SUGGESTIONS.map(img => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => setCatImage(img.url)}
                        className={`text-[9px] px-2 py-1 rounded-md border cursor-pointer ${
                          catImage === img.url 
                            ? 'bg-[#DFB15B] text-black border-[#DFB15B] font-bold' 
                            : 'bg-black/40 text-white/70 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* URL Handle / Slug */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">URL Handle / Slug</label>
                <Input 
                  placeholder="e.g. birthday-special-cakes"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="h-10 bg-black/50 border-white/15 text-xs text-white font-mono rounded-xl focus:border-[#DFB15B]"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox" 
                  id="featuredToggle"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-black text-[#DFB15B] focus:ring-[#DFB15B]"
                />
                <label htmlFor="featuredToggle" className="text-xs text-white/80 cursor-pointer font-semibold">
                  Highlight this collection in MegaMenu Promo Cards
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-11 rounded-xl border-white/10 text-white cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#DFB15B] text-[#140603] font-black uppercase text-xs tracking-wider cursor-pointer shadow-lg"
                >
                  {editingCatId ? 'Save Changes' : 'Create & Sync'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📦 Modal: Manage Products in Specific Collection */}
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
                className="text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Products in Collection */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-white/5">
              {productsInSelectedCategory.length === 0 ? (
                <div className="py-8 text-center text-white/40 text-xs">
                  No products currently in this collection. Add products below!
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
                      className="h-8 text-[10px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg font-bold cursor-pointer"
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
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#DFB15B]">Add Available Products to this Collection:</p>
                  <Input 
                    placeholder="Search product..."
                    value={productAssignSearch}
                    onChange={(e) => setProductAssignSearch(e.target.value)}
                    className="h-7 w-40 text-[10px] bg-black/40 border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {filteredUnassignedProducts.slice(0, 15).map(otherProd => (
                    <div key={otherProd.id} className="flex items-center justify-between p-2 rounded-lg bg-black/30 text-xs">
                      <div className="flex items-center gap-2">
                        <img 
                          src={otherProd.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'} 
                          alt={otherProd.name} 
                          className="w-6 h-6 rounded object-cover" 
                        />
                        <span className="text-white/80 line-clamp-1">{otherProd.name}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onBulkAssignCategory([otherProd.id], selectedCategoryForInspect)}
                        className="h-6 text-[9px] bg-[#DFB15B] text-[#140603] hover:bg-white font-bold rounded cursor-pointer"
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
                className="bg-[#DFB15B] text-[#140603] font-bold text-xs h-10 px-6 rounded-xl cursor-pointer"
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
