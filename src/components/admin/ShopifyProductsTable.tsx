import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Check, 
  X, 
  Sparkles, 
  ArrowUpDown, 
  Download, 
  Upload, 
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Package,
  Layers,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { toast } from 'sonner';

interface ShopifyProductsTableProps {
  products: Product[];
  categoriesList: string[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkUpdateStatus: (ids: string[], status: 'in-stock' | 'out-of-stock') => void;
  onBulkAssignCategory: (ids: string[], category: string) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => void;
  onToggleStock: (id: string, currentStatus: 'in-stock' | 'out-of-stock') => void;
  onDuplicateProduct: (product: Product) => void;
}

export default function ShopifyProductsTable({
  products,
  categoriesList,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onBulkDelete,
  onBulkUpdateStatus,
  onBulkAssignCategory,
  onQuickUpdatePrice,
  onToggleStock,
  onDuplicateProduct,
}: ShopifyProductsTableProps) {
  // State
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'draft' | 'out-of-stock' | 'bestsellers'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'newest'>('newest');
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Inline price editing
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Bulk modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [bulkTargetCategory, setBulkTargetCategory] = useState(categoriesList[0] || 'Cakes');
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [priceAdjustType, setPriceAdjustType] = useState<'percentage' | 'fixed'>('percentage');
  const [priceAdjustValue, setPriceAdjustValue] = useState<number>(10);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Tab filter
      if (activeTab === 'active' && p.stockStatus !== 'in-stock') return false;
      if (activeTab === 'out-of-stock' && p.stockStatus !== 'out-of-stock') return false;
      if (activeTab === 'draft' && p.status !== 'draft') return false;
      if (activeTab === 'bestsellers' && !p.isBestseller) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        const matchesFlavors = p.flavors?.some(f => f.toLowerCase().includes(q));
        const matchesCats = p.categories?.some(c => c.toLowerCase().includes(q));
        const matchesSku = p.sku?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesFlavors && !matchesCats && !matchesSku) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (!p.categories?.includes(selectedCategory)) return false;
      }

      // Dietary filter
      if (selectedDietary !== 'all') {
        if (!p.dietary?.includes(selectedDietary)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // default order
    });
  }, [products, activeTab, searchQuery, selectedCategory, selectedDietary, sortBy]);

  // Paginated products
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Master Select Handler
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Quick price save
  const handleSaveQuickPrice = (id: string) => {
    const num = parseFloat(tempPrice);
    if (!isNaN(num) && num >= 0) {
      onQuickUpdatePrice(id, num);
      setEditingPriceId(null);
      toast.success("Price updated successfully.");
    } else {
      toast.error("Please enter a valid price.");
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (products.length === 0) {
      toast.error("No products to export.");
      return;
    }
    const headers = ["ID", "Title", "Price", "Compare At Price", "SKU", "Status", "Categories", "Flavors", "Dietary", "Weights", "Image URL"];
    const rows = products.map(p => [
      `"${p.id}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      p.price,
      p.compareAtPrice || '',
      `"${p.sku || ''}"`,
      `"${p.stockStatus}"`,
      `"${(p.categories || []).join(';')}"`,
      `"${(p.flavors || []).join(';')}"`,
      `"${(p.dietary || []).join(';')}"`,
      `"${(p.weights || []).join(';')}"`,
      `"${p.images?.[0] || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cakeurban_products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported product catalog to CSV file.");
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-[#DFB15B]" /> Products
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Manage your boutique confectionery inventory, variants, prices, and channels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-10 rounded-xl border-white/10 text-white hover:bg-white/5 text-xs font-bold cursor-pointer"
          >
            <Download className="w-4 h-4 mr-1.5 text-[#DFB15B]" /> Export CSV
          </Button>

          <Button
            type="button"
            onClick={onAddProduct}
            className="h-10 rounded-xl bg-[#DFB15B] hover:bg-white text-[#140603] text-xs font-black uppercase tracking-wider px-5 shadow-lg cursor-pointer transition-all duration-300 font-bold"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[3]" /> Add Product
          </Button>
        </div>
      </div>

      {/* Main Shopify Card Container */}
      <Card className="rounded-[28px] border border-[#DFB15B]/15 bg-[#26130F]/45 overflow-hidden shadow-2xl backdrop-blur-md">
        
        {/* Status Filter Tabs (Shopify Style) */}
        <div className="border-b border-white/10 px-4 pt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All', count: products.length },
            { id: 'active', label: 'Active (In Stock)', count: products.filter(p => p.stockStatus === 'in-stock').length },
            { id: 'out-of-stock', label: 'Out of Stock', count: products.filter(p => p.stockStatus === 'out-of-stock').length },
            { id: 'bestsellers', label: 'Bestsellers', count: products.filter(p => p.isBestseller).length },
            { id: 'draft', label: 'Drafts', count: products.filter(p => p.status === 'draft').length },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setCurrentPage(1);
                }}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'border-[#DFB15B] text-[#DFB15B]' 
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isActive ? 'bg-[#DFB15B]/20 text-[#DFB15B]' : 'bg-white/5 text-white/40'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Filters & Sort Controls Bar */}
        <div className="p-4 border-b border-white/10 bg-[#140603]/40 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              placeholder="Search by title, SKU, flavor, tag..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 pl-9 bg-black/40 border-white/10 text-xs text-white rounded-xl focus:border-[#DFB15B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters & Sorters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Category select */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 bg-black/40 border border-white/10 text-white/80 text-xs rounded-xl px-3 py-1 focus:border-[#DFB15B] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Dietary select */}
            <select
              value={selectedDietary}
              onChange={(e) => {
                setSelectedDietary(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 bg-black/40 border border-white/10 text-white/80 text-xs rounded-xl px-3 py-1 focus:border-[#DFB15B] cursor-pointer"
            >
              <option value="all">All Dietary</option>
              <option value="Eggless">100% Eggless</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten Free">Gluten Free</option>
            </select>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 bg-black/40 border border-white/10 text-[#DFB15B] text-xs font-bold rounded-xl px-3 py-1 focus:border-[#DFB15B] cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Title: A-Z</option>
            </select>
          </div>
        </div>

        {/* Floating Bulk Actions Bar (Shopify Style) */}
        {selectedIds.length > 0 && (
          <div className="bg-[#DFB15B] text-[#140603] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-md bg-[#140603] text-[#DFB15B] flex items-center justify-center font-bold text-xs">
                {selectedIds.length}
              </div>
              <span className="text-xs font-black uppercase tracking-wider">
                {selectedIds.length} Product{selectedIds.length > 1 ? 's' : ''} Selected
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={() => onBulkUpdateStatus(selectedIds, 'in-stock')}
                className="h-8 rounded-lg bg-[#140603] hover:bg-black text-white text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                Set In-Stock
              </Button>
              <Button
                size="sm"
                onClick={() => onBulkUpdateStatus(selectedIds, 'out-of-stock')}
                className="h-8 rounded-lg bg-[#140603] hover:bg-black text-white text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                Set Out-of-Stock
              </Button>
              <Button
                size="sm"
                onClick={() => setShowCategoryModal(true)}
                className="h-8 rounded-lg bg-[#140603] hover:bg-black text-white text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                Assign Category
              </Button>
              <Button
                size="sm"
                onClick={() => onBulkDelete(selectedIds)}
                className="h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedIds.length})
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedIds([])}
                className="h-8 rounded-lg text-[#140603] hover:bg-black/10 text-[10px] font-black uppercase cursor-pointer"
              >
                Deselect All
              </Button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#140603]/60 text-[10px] uppercase font-black tracking-widest text-white/50">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-black/40 text-[#DFB15B] focus:ring-[#DFB15B] cursor-pointer"
                  />
                </th>
                <th className="p-4">Product</th>
                <th className="p-4">Status</th>
                <th className="p-4">Inventory / Weights</th>
                <th className="p-4">Category & Tags</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center text-white/40 space-y-3">
                    <Package className="w-10 h-10 mx-auto text-[#DFB15B]/30" />
                    <p className="text-sm font-semibold">No products found matching your filters.</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedDietary('all');
                        setActiveTab('all');
                      }}
                      className="bg-[#DFB15B] text-[#140603] font-bold text-xs rounded-xl"
                    >
                      Clear Filters
                    </Button>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const isEditingPrice = editingPriceId === p.id;

                  return (
                    <tr 
                      key={p.id}
                      className={`hover:bg-white/[0.02] transition-colors group ${
                        isSelected ? 'bg-[#DFB15B]/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(p.id)}
                          className="w-4 h-4 rounded border-white/20 bg-black/40 text-[#DFB15B] focus:ring-[#DFB15B] cursor-pointer"
                        />
                      </td>

                      {/* Product Thumbnail + Name + SEO slug */}
                      <td className="p-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#140603] border border-white/10 shrink-0 relative">
                            <img 
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'} 
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80";
                              }}
                            />
                            {p.images && p.images.length > 1 && (
                              <span className="absolute bottom-1 right-1 bg-black/75 text-[8px] font-mono text-white/80 px-1 rounded">
                                +{p.images.length - 1}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => onEditProduct(p)}
                              className="font-bold text-white hover:text-[#DFB15B] text-sm text-left transition block line-clamp-1 cursor-pointer"
                            >
                              {p.name}
                            </button>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {p.sku && (
                                <span className="text-[9px] font-mono text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
                                  SKU: {p.sku}
                                </span>
                              )}
                              {p.dietary?.includes('Eggless') && (
                                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] font-bold px-1.5 py-0.2">
                                  Eggless
                                </Badge>
                              )}
                              {p.isBestseller && (
                                <Badge className="bg-[#DFB15B]/20 text-[#DFB15B] border border-[#DFB15B]/30 text-[8px] font-bold px-1.5 py-0.2">
                                  ⭐ Bestseller
                                </Badge>
                              )}
                              {p.seoSlug && (
                                <span className="text-[8px] text-[#DFB15B]/60 font-mono hidden sm:inline">
                                  /{p.seoSlug}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stock Status Pill */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => onToggleStock(p.id, p.stockStatus)}
                          className="cursor-pointer"
                          title="Click to toggle stock status"
                        >
                          <Badge className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border cursor-pointer transition ${
                            p.stockStatus === 'in-stock'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${
                              p.stockStatus === 'in-stock' ? 'bg-emerald-400' : 'bg-rose-400'
                            }`} />
                            {p.stockStatus === 'in-stock' ? 'Active' : 'Out of Stock'}
                          </Badge>
                        </button>
                      </td>

                      {/* Inventory / Weights */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-white/80 font-medium">
                            {p.weights?.map(w => `${w}kg`).join(', ') || '0.5kg, 1kg, 2kg'}
                          </p>
                          <p className="text-[10px] text-white/40">
                            {p.flavors?.slice(0, 2).join(', ') || 'Belgian Chocolate'}
                          </p>
                        </div>
                      </td>

                      {/* Category & Tags */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-[#DFB15B]">
                            {p.categories?.[0] || 'Cakes'}
                          </span>
                          {p.categories && p.categories.length > 1 && (
                            <p className="text-[10px] text-white/40">
                              +{p.categories.slice(1).join(', ')}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Price & Inline Editing */}
                      <td className="p-4">
                        {isEditingPrice ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[#DFB15B] font-bold">₹</span>
                            <Input 
                              type="number"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(e.target.value)}
                              className="w-20 h-8 bg-black border-[#DFB15B] text-xs font-mono font-bold text-white px-2"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveQuickPrice(p.id);
                                if (e.key === 'Escape') setEditingPriceId(null);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveQuickPrice(p.id)}
                              className="w-7 h-7 rounded bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPriceId(null)}
                              className="w-7 h-7 rounded bg-white/10 text-white/50 flex items-center justify-center hover:text-white cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-0.5 group/price">
                            <div className="flex items-center gap-1.5">
                              <span className="font-serif font-bold text-white text-base">
                                ₹{p.price.toLocaleString()}
                              </span>
                              {p.compareAtPrice && p.compareAtPrice > p.price && (
                                <span className="text-[10px] line-through text-white/40">
                                  ₹{p.compareAtPrice}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPriceId(p.id);
                                setTempPrice(p.price.toString());
                              }}
                              className="text-[9px] text-[#DFB15B]/70 hover:text-[#DFB15B] font-semibold cursor-pointer underline opacity-0 group-hover:opacity-100 transition"
                            >
                              Edit Price
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Row Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEditProduct(p)}
                            className="h-8 px-2.5 rounded-lg text-white hover:bg-white/10 cursor-pointer text-xs font-bold"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5 mr-1 text-[#DFB15B]" /> Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDuplicateProduct(p)}
                            className="h-8 w-8 p-0 rounded-lg text-white/40 hover:text-white hover:bg-white/10 cursor-pointer"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteProduct(p.id)}
                            className="h-8 w-8 p-0 rounded-lg text-rose-400/50 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="p-4 border-t border-white/10 bg-[#140603]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div>
            Showing {paginatedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="h-8 px-2.5 rounded-lg border-white/10 text-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-xs font-mono font-bold text-white">
                {currentPage} / {totalPages}
              </span>

              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="h-8 px-2.5 rounded-lg border-white/10 text-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Bulk Category Assign Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e0e0a] border border-[#DFB15B]/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#DFB15B]" /> Assign Category to {selectedIds.length} Products
            </h3>
            <p className="text-xs text-white/60">
              Select the category you wish to add to all {selectedIds.length} selected products.
            </p>

            <select
              value={bulkTargetCategory}
              onChange={(e) => setBulkTargetCategory(e.target.value)}
              className="w-full h-11 bg-black/50 border border-white/15 rounded-xl px-3 text-sm text-white focus:border-[#DFB15B]"
            >
              {categoriesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 h-11 rounded-xl border-white/10 text-white cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onBulkAssignCategory(selectedIds, bulkTargetCategory);
                  setShowCategoryModal(false);
                  setSelectedIds([]);
                }}
                className="flex-1 h-11 rounded-xl bg-[#DFB15B] text-[#140603] font-bold cursor-pointer"
              >
                Apply Category
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
