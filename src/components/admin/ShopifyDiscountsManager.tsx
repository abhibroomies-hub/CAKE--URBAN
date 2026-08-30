import React, { useState } from 'react';
import { DiscountCode } from '../../types';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Percent, 
  DollarSign, 
  Calendar, 
  Check, 
  X, 
  Copy, 
  Sparkles,
  Scissors
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

export default function ShopifyDiscountsManager() {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([
    {
      id: 'disc-1',
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minOrderAmount: 999,
      usageCount: 142,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'disc-2',
      code: 'LUXURY200',
      type: 'fixed',
      value: 200,
      minOrderAmount: 1999,
      usageCount: 88,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'disc-3',
      code: 'MIDNIGHTSPECIAL',
      type: 'percentage',
      value: 15,
      minOrderAmount: 1499,
      usageCount: 56,
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<string>('10');
  const [minOrder, setMinOrder] = useState<string>('999');

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter a discount code name.");
      return;
    }

    const valNum = parseFloat(value);
    if (isNaN(valNum) || valNum <= 0) {
      toast.error("Please enter a valid discount value.");
      return;
    }

    const newDisc: DiscountCode = {
      id: `disc-${Date.now()}`,
      code: code.trim().toUpperCase(),
      type: type,
      value: valNum,
      minOrderAmount: minOrder ? parseFloat(minOrder) : 0,
      usageCount: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setDiscounts([newDisc, ...discounts]);
    setCode('');
    setValue('10');
    setMinOrder('999');
    setShowAddModal(false);
    toast.success(`Discount code "${newDisc.code}" created successfully!`);
  };

  const handleToggleStatus = (id: string) => {
    setDiscounts(discounts.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
    toast.info("Discount status updated.");
  };

  const handleDeleteDiscount = (id: string) => {
    setDiscounts(discounts.filter(d => d.id !== id));
    toast.success("Discount code removed.");
  };

  const handleCopyCode = (promoCode: string) => {
    navigator.clipboard.writeText(promoCode);
    toast.success(`Copied "${promoCode}" to clipboard!`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-white flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-[#DFB15B]" /> Discounts & Coupon Codes
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Create and manage promotional discount codes, percentage vouchers, and order incentives.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="h-10 rounded-xl bg-[#DFB15B] hover:bg-white text-[#140603] text-xs font-black uppercase tracking-wider px-5 shadow-lg cursor-pointer transition-all duration-300 font-bold"
        >
          <Plus className="w-4 h-4 mr-1.5 stroke-[3]" /> Create Discount Code
        </Button>
      </div>

      {/* Table of Discounts */}
      <Card className="rounded-[28px] border border-[#DFB15B]/15 bg-[#26130F]/45 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#140603]/60 text-[10px] uppercase font-black tracking-widest text-white/50">
                <th className="p-4">Promo Code</th>
                <th className="p-4">Status</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Min. Requirement</th>
                <th className="p-4">Times Used</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white">
              {discounts.map(d => (
                <tr key={d.id} className="hover:bg-white/[0.02] transition">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-[#DFB15B] bg-[#140603] border border-[#DFB15B]/30 px-3 py-1 rounded-lg tracking-wider">
                        {d.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(d.code)}
                        className="text-white/40 hover:text-white cursor-pointer"
                        title="Copy code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  <td className="p-4">
                    <button onClick={() => handleToggleStatus(d.id)} className="cursor-pointer">
                      <Badge className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        d.isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/10 text-white/40'
                      }`}>
                        {d.isActive ? 'Active' : 'Expired'}
                      </Badge>
                    </button>
                  </td>

                  <td className="p-4 font-semibold text-white">
                    {d.type === 'percentage' ? `${d.value}% Off Entire Order` : `₹${d.value} Flat Off`}
                  </td>

                  <td className="p-4 text-white/60">
                    {d.minOrderAmount ? `Orders over ₹${d.minOrderAmount}` : 'No minimum'}
                  </td>

                  <td className="p-4 font-mono font-bold text-white">
                    {d.usageCount} orders
                  </td>

                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteDiscount(d.id)}
                      className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e0e0a] border border-[#DFB15B]/30 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif font-black text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-[#DFB15B]" /> Create Discount Code
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDiscount} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-[#DFB15B]">Discount Code</label>
                <Input 
                  placeholder="e.g. SUMMERFEST15"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="h-11 bg-black/50 border-white/15 text-sm font-mono uppercase text-white rounded-xl focus:border-[#DFB15B]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/70">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full h-11 bg-black/50 border border-white/15 rounded-xl px-3 text-xs text-white focus:border-[#DFB15B]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/70">Discount Value</label>
                  <Input 
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="h-11 bg-black/50 border-white/15 text-sm font-mono text-white rounded-xl focus:border-[#DFB15B]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">Minimum Purchase Requirement (₹)</label>
                <Input 
                  type="number"
                  placeholder="999"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="h-11 bg-black/50 border-white/15 text-sm font-mono text-white rounded-xl focus:border-[#DFB15B]"
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
                  className="flex-1 h-11 rounded-xl bg-[#DFB15B] text-[#140603] font-black uppercase text-xs cursor-pointer"
                >
                  Save Code
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
