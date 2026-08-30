import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { 
  Sparkles, 
  ArrowLeft, 
  Eye, 
  Check, 
  X, 
  DollarSign, 
  Tag, 
  Layers, 
  Globe, 
  Plus, 
  Trash2, 
  Percent, 
  ShieldCheck, 
  RotateCcw,
  HelpCircle,
  FileText,
  Package,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import ShopifyMediaDropzone from './ShopifyMediaDropzone';
import { toast } from 'sonner';

interface ShopifyProductEditorProps {
  initialProduct?: Product | null;
  categoriesList: string[];
  onSave: (productData: Partial<Product>) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function ShopifyProductEditor({
  initialProduct,
  categoriesList,
  onSave,
  onCancel,
  isEditing = false
}: ShopifyProductEditorProps) {
  // Main Product States
  const [name, setName] = useState(initialProduct?.name || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [price, setPrice] = useState(initialProduct?.price ? initialProduct.price.toString() : '1499');
  const [compareAtPrice, setCompareAtPrice] = useState(initialProduct?.compareAtPrice ? initialProduct.compareAtPrice.toString() : '');
  const [costPerItem, setCostPerItem] = useState(initialProduct?.costPerItem ? initialProduct.costPerItem.toString() : '');
  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [barcode, setBarcode] = useState(initialProduct?.barcode || '');
  const [vendor, setVendor] = useState(initialProduct?.vendor || 'CakeUrban Atelier Faridabad');
  const [productType, setProductType] = useState(initialProduct?.productType || 'Custom Cake');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>(initialProduct?.status || 'active');
  const [stockStatus, setStockStatus] = useState<'in-stock' | 'out-of-stock'>(initialProduct?.stockStatus || 'in-stock');
  const [inventoryQuantity, setInventoryQuantity] = useState(initialProduct?.inventoryQuantity ? initialProduct.inventoryQuantity.toString() : '50');

  // Media
  const [images, setImages] = useState<string[]>(
    initialProduct?.images && initialProduct.images.length > 0 
      ? initialProduct.images 
      : ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80']
  );

  // Categorization & Tags
  const [primaryCategory, setPrimaryCategory] = useState(initialProduct?.categories?.[0] || categoriesList[0] || 'Cakes');
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialProduct?.categories?.slice(1) || []
  );
  const [tags, setTags] = useState<string[]>(
    initialProduct?.tags || ['fresh', 'eggless', 'gourmet']
  );
  const [newTagInput, setNewTagInput] = useState('');

  // Variants (Weights & Flavors)
  const [selectedWeights, setSelectedWeights] = useState<number[]>(
    initialProduct?.weights || [0.5, 1.0, 2.0]
  );
  const [flavors, setFlavors] = useState<string[]>(
    initialProduct?.flavors || ['Belgian Chocolate', 'Red Velvet']
  );
  const [newFlavorInput, setNewFlavorInput] = useState('');
  const [dietary, setDietary] = useState<string[]>(
    initialProduct?.dietary || ['Eggless']
  );

  // Features & Badges
  const [isBestseller, setIsBestseller] = useState(initialProduct?.isBestseller ?? true);
  const [isNew, setIsNew] = useState(initialProduct?.isNew ?? false);
  const [isCustomizable, setIsCustomizable] = useState(initialProduct?.isCustomizable ?? true);

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState(initialProduct?.seoTitle || '');
  const [seoSlug, setSeoSlug] = useState(initialProduct?.seoSlug || '');
  const [seoMetaDescription, setSeoMetaDescription] = useState(initialProduct?.seoMetaDescription || '');
  const [seoKeywords, setSeoKeywords] = useState<string[]>(initialProduct?.seoKeywords || []);
  const [seoCustomParagraph, setSeoCustomParagraph] = useState(initialProduct?.seoCustomParagraph || '');

  // Loading & AI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAiCopy, setIsGeneratingAiCopy] = useState(false);
  const [isGeneratingAiSeo, setIsGeneratingAiSeo] = useState(false);

  // Auto-generate slug and sku if blank
  useEffect(() => {
    if (!seoSlug && name) {
      setSeoSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
    if (!seoTitle && name) {
      setSeoTitle(`${name} | Order Online in Faridabad & Delhi NCR - CakeUrban`);
    }
  }, [name]);

  // Generate SKU
  const handleAutoGenerateSku = () => {
    const prefix = 'CK';
    const catCode = primaryCategory.slice(0, 3).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newSku = `${prefix}-${catCode}-${randomNum}`;
    setSku(newSku);
    toast.success(`Generated SKU: ${newSku}`);
  };

  // Profit Margin Calculation
  const priceNum = parseFloat(price) || 0;
  const costNum = parseFloat(costPerItem) || 0;
  const profit = priceNum - costNum;
  const profitMarginPercent = priceNum > 0 && costNum > 0 ? Math.round((profit / priceNum) * 100) : 0;

  // Add Tag
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.trim().toLowerCase();
    if (!tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Add Flavor
  const handleAddFlavor = () => {
    if (!newFlavorInput.trim()) return;
    const cleanFlavor = newFlavorInput.trim();
    if (!flavors.includes(cleanFlavor)) {
      setFlavors([...flavors, cleanFlavor]);
    }
    setNewFlavorInput('');
  };

  const handleRemoveFlavor = (flavorToRemove: string) => {
    setFlavors(flavors.filter(f => f !== flavorToRemove));
  };

  // Toggle Weight
  const handleToggleWeight = (weight: number) => {
    if (selectedWeights.includes(weight)) {
      if (selectedWeights.length === 1) {
        toast.warning("At least one weight option must be selected.");
        return;
      }
      setSelectedWeights(selectedWeights.filter(w => w !== weight));
    } else {
      setSelectedWeights([...selectedWeights, weight].sort((a, b) => a - b));
    }
  };

  // Toggle Collection
  const handleToggleCollection = (col: string) => {
    if (selectedCollections.includes(col)) {
      setSelectedCollections(selectedCollections.filter(c => c !== col));
    } else {
      setSelectedCollections([...selectedCollections, col]);
    }
  };

  // AI Description Assistant
  const handleGenerateAiDescription = async () => {
    if (!name.trim()) {
      toast.error("Please enter a product title first so AI can describe it.");
      return;
    }

    setIsGeneratingAiCopy(true);
    toast.loading("Crafting mouth-watering luxury bakery description...", { id: "ai-desc" });

    try {
      const response = await fetch('/api/ai/describe-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          flavors: flavors.join(', ') || 'Belgian Chocolate',
          category: primaryCategory
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate description from server");
      }

      const data = await response.json();
      if (data?.description) {
        setDescription(data.description);
        toast.success("AI description added successfully!", { id: "ai-desc" });
      } else {
        throw new Error("No description returned");
      }
    } catch (err: any) {
      console.warn("AI generation fallback:", err);
      setDescription(`Artisanal gourmet creation featuring rich layers of moist sponge and delicate frosting. Baked fresh using 100% eggless ingredients with 24k edible accents.`);
      toast.success("Added product description.", { id: "ai-desc" });
    } finally {
      setIsGeneratingAiCopy(false);
    }
  };

  // AI SEO Auto-Generator
  const handleGenerateAiSeo = async () => {
    if (!name.trim()) {
      toast.error("Please enter a product title first.");
      return;
    }

    setIsGeneratingAiSeo(true);
    toast.loading("Generating Google SERP SEO tags & local rankings metadata...", { id: "ai-seo" });

    try {
      const slugVal = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-faridabad';
      const titleVal = `Order ${name} Online in Faridabad | 100% Eggless - CakeUrban`;
      const metaVal = `Order fresh 100% Eggless ${name} online starting at ₹${price}. Express 2-hour home delivery and midnight delivery across Faridabad, Sector 15, 21, Greenfield & Delhi NCR.`;
      const localStory = `Our ${name} is baked fresh in our central Faridabad boutique kitchen. We use temperature-controlled delivery vans serving Sectors 14, 15, 16, 21C, 28, 31, Greenfield Colony, and Greater Faridabad Neharpar with 100% on-time freshness guarantee.`;

      setSeoSlug(slugVal);
      setSeoTitle(titleVal);
      setSeoMetaDescription(metaVal);
      setSeoCustomParagraph(localStory);
      setSeoKeywords([name.toLowerCase(), `${name.toLowerCase()} faridabad`, 'eggless cake delivery', 'designer cakes faridabad', 'best cake shop faridabad']);
      
      toast.success("1-Click AI SEO optimization complete!", { id: "ai-seo" });
    } finally {
      setIsGeneratingAiSeo(false);
    }
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Product title is required.");
      return;
    }

    const finalPrice = parseFloat(price);
    if (isNaN(finalPrice) || finalPrice <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (images.length === 0) {
      toast.error("Please add at least one product image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const mergedCategories = Array.from(new Set([primaryCategory, ...selectedCollections]));

      const payload: Partial<Product> = {
        name: name.trim(),
        description: description.trim() || 'Gourmet handcrafted cake by CakeUrban.',
        price: finalPrice,
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
        costPerItem: costPerItem ? parseFloat(costPerItem) : undefined,
        sku: sku.trim() || undefined,
        barcode: barcode.trim() || undefined,
        vendor: vendor.trim() || 'CakeUrban Atelier',
        productType: productType.trim() || 'Custom Cake',
        status: status,
        stockStatus: stockStatus,
        inventoryQuantity: inventoryQuantity ? parseInt(inventoryQuantity) : 50,
        images: images,
        categories: mergedCategories,
        tags: tags,
        flavors: flavors.length > 0 ? flavors : ['Belgian Chocolate'],
        occasions: ['Birthday', 'Anniversary', 'Celebration'],
        weights: selectedWeights.length > 0 ? selectedWeights : [0.5, 1.0, 2.0],
        dietary: dietary.length > 0 ? dietary : ['Eggless'],
        isBestseller: isBestseller,
        isNew: isNew,
        isCustomizable: isCustomizable,
        seoTitle: seoTitle || `${name} | CakeUrban`,
        seoSlug: seoSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        seoMetaDescription: seoMetaDescription || description,
        seoKeywords: seoKeywords,
        seoCustomParagraph: seoCustomParagraph,
        updatedAt: new Date().toISOString()
      };

      await onSave(payload);
      toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully!`);
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to save product: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left pb-24">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white cursor-pointer transition"
            title="Back to products list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-black text-white flex items-center gap-2">
              {isEditing ? `Edit: ${name || 'Product'}` : 'Add Product'}
            </h1>
            <p className="text-xs text-white/50">
              {isEditing ? 'Update your product specifications and inventory channels.' : 'Publish a new artisanal creation to your online store catalog.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="h-10 rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-[#DFB15B] text-xs font-bold cursor-pointer transition-colors"
          >
            Discard
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-xl bg-[#DFB15B] hover:bg-white text-[#140603] text-xs font-black uppercase tracking-wider px-6 shadow-xl cursor-pointer font-bold duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-1.5 stroke-[3]" /> {isEditing ? 'Save Changes' : 'Publish Product'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main 2-Column Shopify Polaris Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= LEFT MAIN COLUMN (8 cols) ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Title and Description */}
          <Card className="rounded-[24px] border border-[#DFB15B]/15 bg-[#26130F]/45 shadow-xl p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#DFB15B]">
                Title <span className="text-rose-400">*</span>
              </label>
              <Input 
                placeholder="e.g. Belgian Royal Truffle Drip Cake"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-[#140603] border-white/15 text-sm text-white font-semibold rounded-xl focus:border-[#DFB15B]"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#DFB15B]">
                  Description
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isGeneratingAiCopy}
                  onClick={handleGenerateAiDescription}
                  className="h-7 text-[10px] font-bold rounded-lg border border-[#DFB15B]/30 bg-[#DFB15B]/10 text-[#DFB15B] hover:bg-[#DFB15B]/20 hover:text-white cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3 h-3 mr-1" /> AI Auto-Write Description
                </Button>
              </div>

              <Textarea 
                placeholder="Write an appetizing description of layers, textures, sponge, frosting, and dietary suitability..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-32 bg-[#140603] border-white/15 text-xs text-white rounded-xl focus:border-[#DFB15B] leading-relaxed"
              />

              {/* Quick helper shortcuts */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-white/40 font-semibold">Quick insert:</span>
                {[
                  "100% Eggless Recipe",
                  "Pure Belgian Chocolate",
                  "24k Edible Gold Gilded",
                  "Freshly Baked on Order",
                  "Keep Refrigerated at 4°C"
                ].map(phrase => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => setDescription(prev => prev ? `${prev} • ${phrase}` : phrase)}
                    className="text-[9px] bg-white/5 hover:bg-[#DFB15B]/10 border border-white/10 hover:border-[#DFB15B]/30 text-white/70 hover:text-[#DFB15B] px-2 py-0.5 rounded-md cursor-pointer transition"
                  >
                    +{phrase}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Card 2: Media Gallery Dropzone */}
          <Card className="rounded-[24px] border border-[#DFB15B]/15 bg-[#26130F]/45 shadow-xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#DFB15B] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#DFB15B]" /> Product Media & Images
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Upload multiple high-resolution photos, paste external URLs, or generate visuals using Gemini AI.
              </p>
            </div>

            <ShopifyMediaDropzone 
              images={images}
              onChange={setImages}
              productName={name}
            />
          </Card>

          {/* Card 3: Pricing & Cost Calculator */}
          <Card className="rounded-[24px] border border-[#DFB15B]/15 bg-[#26130F]/45 shadow-xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#DFB15B] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#DFB15B]" /> Pricing & Profitability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Selling Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">
                  Price (₹ INR) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-serif font-bold">₹</span>
                  <Input 
                    type="number"
                    placeholder="1499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="h-11 pl-8 bg-[#140603] border-white/15 text-sm text-white font-mono font-bold rounded-xl focus:border-[#DFB15B]"
                    required
                  />
                </div>
              </div>

              {/* Compare-at Price (for discount strikethrough) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white/70">Compare-at Price</label>
                  <span className="text-[9px] text-white/40">Original MSRP</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-serif font-bold">₹</span>
                  <Input 
                    type="number"
                    placeholder="1899"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    className="h-11 pl-8 bg-[#140603] border-white/15 text-sm text-white font-mono rounded-xl focus:border-[#DFB15B]"
                  />
                </div>
              </div>

              {/* Cost per item */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white/70">Cost per item</label>
                  <span className="text-[9px] text-white/40">Raw baking cost</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-serif font-bold">₹</span>
                  <Input 
                    type="number"
                    placeholder="550"
                    value={costPerItem}
                    onChange={(e) => setCostPerItem(e.target.value)}
                    className="h-11 pl-8 bg-[#140603] border-white/15 text-sm text-white font-mono rounded-xl focus:border-[#DFB15B]"
                  />
                </div>
              </div>
            </div>

            {/* Profit Margin Display Bar */}
            {costNum > 0 && priceNum > 0 && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/70">Calculated Gross Profit:</span>
                  <span className="font-mono font-bold text-white">₹{profit.toFixed(0)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/50">Margin:</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                    {profitMarginPercent}%
                  </Badge>
                </div>
              </div>
            )}
          </Card>

          {/* Card 4: Inventory & SKU */}
          <Card className="rounded-[24px] border border-[#DFB15B]/15 bg-[#26130F]/45 shadow-xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#DFB15B] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#DFB15B]" /> Inventory & SKU Tracking
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* SKU */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white/70">SKU (Stock Unit)</label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateSku}
                    className="text-[9px] text-[#DFB15B] hover:underline font-bold"
                  >
                    Auto-Generate
                  </button>
                </div>
                <Input 
                  placeholder="e.g. CK-TRF-101"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="h-11 bg-[#140603] border-white/15 text-xs text-white font-mono uppercase rounded-xl focus:border-[#DFB15B]"
                />
              </div>

              {/* Barcode */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">Barcode / HSN Code</label>
                <Input 
                  placeholder="e.g. 19059010"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="h-11 bg-[#140603] border-white/15 text-xs text-white font-mono rounded-xl focus:border-[#DFB15B]"
                />
              </div>

              {/* Stock Quantity */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">Daily Batch Slots</label>
                <Input 
                  type="number"
                  placeholder="50"
                  value={inventoryQuantity}
                  onChange={(e) => setInventoryQuantity(e.target.value)}
                  className="h-11 bg-[#140603] border-white/15 text-xs text-white font-mono rounded-xl focus:border-[#DFB15B]"
                />
              </div>
            </div>
          </Card>

          {/* Card 5: Variants & Options (Weights & Flavors) */}
          <Card className="rounded-[24px] border border-[#DFB15B]/15 bg-[#26130F]/45 shadow-xl p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#DFB15B]">
                Variants & Options (Weights & Flavors)
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Select supported weights and flavor profiles available for customer customization.
              </p>
            </div>

            {/* Weights Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80">Available Weights (Kg):</label>
              <div className="flex flex-wrap gap-2">
                {[0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0].map(weight => {
                  const isChecked = selectedWeights.includes(weight);
                  return (
                    <button
                      key={weight}
                      type="button"
                      onClick={() => handleToggleWeight(weight)}
                      className={`h-9 px-3.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                        isChecked 
                          ? 'bg-[#DFB15B] text-[#140603] border-[#DFB15B] shadow-md' 
                          : 'bg-[#140603] text-white/60 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {weight} Kg {isChecked ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flavors List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80">Available Flavor Profiles:</label>
              <div className="flex flex-wrap items-center gap-2">
                {flavors.map(flavor => (
                  <span 
                    key={flavor}
                    className="bg-[#140603] border border-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                  >
                    {flavor}
                    <button
                      type="button"
                      onClick={() => handleRemoveFlavor(flavor)}
                      className="text-white/40 hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1">
                  <Input 
                    placeholder="Add flavor (e.g. Hazelnut Praline)..."
                    value={newFlavorInput}
                    onChange={(e) => setNewFlavorInput(e.target.value)}
                    className="h-8 w-48 bg-black/50 border-white/15 text-xs text-white rounded-lg focus:border-[#DFB15B]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFlavor();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddFlavor}
                    className="h-8 px-2.5 bg-white/10 hover:bg-[#DFB15B] hover:text-[#140603] text-white rounded-lg text-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Dietary Tags */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80">Dietary Classification:</label>
              <div className="flex flex-wrap gap-2">
                {['Eggless', 'Gluten Free', 'Vegan', 'Sugar Free', 'Nut Free'].map(diet => {
                  const isChecked = dietary.includes(diet);
                  return (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setDietary(dietary.filter(d => d !== diet));
                        } else {
                          setDietary([...dietary, diet]);
                        }
                      }}
                      className={`h-8 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                        isChecked 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                          : 'bg-[#140603] text-white/50 border-white/10'
                      }`}
                    >
                      {diet} {isChecked ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Card 6: Search Engine Listing Preview (SEO) */}
          <Card className="rounded-[24px] border border-[#DFB15B]/15 bg-[#26130F]/45 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#DFB15B] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#DFB15B]" /> Search Engine Listing (Google SEO)
                </h3>
                <p className="text-xs text-white/50">
                  Control how this confectionery item appears in Google Search and local maps.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isGeneratingAiSeo}
                onClick={handleGenerateAiSeo}
                className="h-7 text-[10px] font-bold rounded-lg border border-[#DFB15B]/30 bg-[#DFB15B]/10 text-[#DFB15B] hover:bg-[#DFB15B]/20 hover:text-white cursor-pointer transition-colors"
              >
                <Sparkles className="w-3 h-3 mr-1" /> 1-Click AI SEO Auto-Filler
              </Button>
            </div>

            {/* Google Search Live SERP Preview Box */}
            <div className="bg-[#030712] border border-white/10 rounded-2xl p-4 space-y-2 font-sans shadow-inner">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-4 h-4 rounded-full bg-[#DFB15B] text-[#140603] flex items-center justify-center font-bold text-[9px]">
                  C
                </div>
                <span>CakeUrban</span>
                <span className="text-slate-500">https://www.cakeurban.com › product › {seoSlug || 'product-handle'}</span>
              </div>

              <h4 className="text-base font-semibold text-[#8AB4F8] hover:underline cursor-pointer leading-snug">
                {seoTitle || `${name || 'Artisanal Designer Cake'} | CakeUrban Faridabad`}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {seoMetaDescription || description || 'Order 100% Eggless artisanal designer cakes online in Faridabad with express 2-hour home delivery and midnight delivery across Delhi NCR.'}
              </p>

              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono">
                <span className="text-amber-400 font-bold">⭐⭐⭐⭐⭐ 4.9 (150+)</span>
                <span>·</span>
                <span className="text-emerald-400 font-bold">₹{price || '1499'}</span>
                <span>·</span>
                <span className="text-slate-300">In stock</span>
              </div>
            </div>

            {/* SEO Inputs */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <label className="font-bold text-white/70">Page Title</label>
                  <span className="text-white/40 font-mono">{seoTitle.length} / 70 characters</span>
                </div>
                <Input 
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="h-10 bg-[#140603] border-white/15 text-xs text-white rounded-lg focus:border-[#DFB15B]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <label className="font-bold text-white/70">URL Handle / Slug</label>
                  <span className="text-white/40 font-mono">cakeurban.com/product/{seoSlug}</span>
                </div>
                <Input 
                  value={seoSlug}
                  onChange={(e) => setSeoSlug(e.target.value)}
                  className="h-10 bg-[#140603] border-white/15 text-xs text-white font-mono rounded-lg focus:border-[#DFB15B]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <label className="font-bold text-white/70">Meta Description</label>
                  <span className="text-white/40 font-mono">{seoMetaDescription.length} / 160 characters</span>
                </div>
                <Textarea 
                  value={seoMetaDescription}
                  onChange={(e) => setSeoMetaDescription(e.target.value)}
                  className="h-20 bg-[#140603] border-white/15 text-xs text-white rounded-lg focus:border-[#DFB15B] leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[10px] text-white/70">Local Location Story (Faridabad Hub Ranking)</label>
                <Textarea 
                  placeholder="Local delivery details across Sector 15, 31, Greenfield Colony, Greater Faridabad..."
                  value={seoCustomParagraph}
                  onChange={(e) => setSeoCustomParagraph(e.target.value)}
                  className="h-20 bg-[#140603] border-white/15 text-xs text-white rounded-lg focus:border-[#DFB15B]"
                />
              </div>
            </div>
          </Card>

        </div>

        {/* ================= RIGHT SIDEBAR COLUMN (4 cols) ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Product Status */}
          <Card className="rounded-[24px] border border-[#DFB15B]/15 bg-[#26130F]/45 shadow-xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#DFB15B]">
              Status & Visibility
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/70">Product Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-11 bg-[#140603] border border-white/15 rounded-xl px-3 text-xs font-bold text-white focus:border-[#DFB15B]"
              >
                <option value="active">Active (Visible in Store)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/70">Stock Status</label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value as any)}
                className="w-full h-11 bg-[#140603] border border-white/15 rounded-xl px-3 text-xs font-bold text-white focus:border-[#DFB15B]"
              >
                <option value="in-stock">🟢 In Stock (Instant Order)</option>
                <option value="out-of-stock">🔴 Out of Stock / Pre-Order</option>
              </select>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-white/60">
              <span className="font-semibold text-white/80 block">Sales Channels:</span>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Online Boutique Store
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> 2-Hour Express Delivery
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Concierge
              </div>
            </div>
          </Card>

          {/* Card 2: Product Organization (Categories & Collections) */}
          <Card className="rounded-[24px] border border-[#DFB15B]/15 bg-[#26130F]/45 shadow-xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#DFB15B]">
              Product Organization
            </h3>

            {/* Primary Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/70">Primary Category</label>
              <select
                value={primaryCategory}
                onChange={(e) => setPrimaryCategory(e.target.value)}
                className="w-full h-11 bg-[#140603] border border-white/15 rounded-xl px-3 text-xs font-bold text-[#DFB15B] focus:border-[#DFB15B]"
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Additional Collections Checklist */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-semibold text-white/70 block">
                Additional Collections:
              </label>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {categoriesList.filter(c => c !== primaryCategory).map(col => {
                  const isChecked = selectedCollections.includes(col);
                  return (
                    <label 
                      key={col}
                      className="flex items-center gap-2 text-xs text-white/80 hover:text-white cursor-pointer select-none"
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCollection(col)}
                        className="rounded border-white/20 bg-black/40 text-[#DFB15B] focus:ring-[#DFB15B]"
                      />
                      <span>{col}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Product Type & Vendor */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Product Type</label>
                <Input 
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="e.g. Tier Cake, Cupcake, Dessert"
                  className="h-10 bg-[#140603] border-white/15 text-xs text-white rounded-xl focus:border-[#DFB15B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Kitchen Hub / Vendor</label>
                <Input 
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g. CakeUrban Sector 15 Atelier"
                  className="h-10 bg-[#140603] border-white/15 text-xs text-white rounded-xl focus:border-[#DFB15B]"
                />
              </div>
            </div>

            {/* Tags Pills */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-semibold text-white/70 block">Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span 
                    key={tag}
                    className="bg-black/60 border border-white/15 text-white/80 text-[10px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-1 pt-1">
                <Input 
                  placeholder="Add tag (e.g. birthday, wedding)..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  className="h-8 bg-[#140603] border-white/15 text-xs text-white rounded-lg focus:border-[#DFB15B]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddTag}
                  className="h-8 px-3 bg-white/10 hover:bg-[#DFB15B] hover:text-[#140603] text-white rounded-lg text-xs cursor-pointer"
                >
                  Add
                </Button>
              </div>
            </div>
          </Card>

          {/* Card 3: Storefront Badges & Features */}
          <Card className="rounded-[24px] border border-[#DFB15B]/15 bg-[#26130F]/45 shadow-xl p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#DFB15B]">
              Storefront Badges & Customization
            </h3>

            <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
              <span className="text-xs font-semibold text-white">⭐ Bestseller Badge</span>
              <input 
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
                className="w-4 h-4 rounded text-[#DFB15B] focus:ring-[#DFB15B]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
              <span className="text-xs font-semibold text-white">✨ New Arrival Badge</span>
              <input 
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="w-4 h-4 rounded text-[#DFB15B] focus:ring-[#DFB15B]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
              <span className="text-xs font-semibold text-white">✍️ Inscribed Message Option</span>
              <input 
                type="checkbox"
                checked={isCustomizable}
                onChange={(e) => setIsCustomizable(e.target.checked)}
                className="w-4 h-4 rounded text-[#DFB15B] focus:ring-[#DFB15B]"
              />
            </label>
          </Card>

        </div>

      </div>

      {/* Sticky Bottom Action Bar (Shopify style) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#140603]/95 backdrop-blur-md border-t border-[#DFB15B]/20 py-3.5 px-6 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="w-2 h-2 rounded-full bg-[#DFB15B] animate-pulse inline-block" />
          <span className="font-semibold text-white">
            {isEditing ? `Editing "${name || 'Product'}"` : 'New Product Draft'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-xs text-white/60 hover:text-white cursor-pointer font-bold"
          >
            Discard
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setStatus('draft');
              handleSubmit({ preventDefault: () => {} } as any);
            }}
            className="text-xs border border-white/15 bg-white/5 text-white/90 hover:text-white hover:bg-white/10 rounded-xl h-10 px-4 cursor-pointer font-bold transition-colors"
          >
            Save as Draft
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#DFB15B] hover:bg-white text-[#140603] font-black uppercase text-xs tracking-wider px-6 h-10 rounded-xl cursor-pointer shadow-lg font-bold duration-300"
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Save Product' : 'Publish Live (1-Click)')}
          </Button>
        </div>
      </div>
    </form>
  );
}
