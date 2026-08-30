import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle, 
  Send, 
  Building, 
  Users, 
  Award, 
  Heart,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { playSuccessChime, playBtnTap } from '../lib/sound';
import SEO from '../components/SEO';

export default function CorporateCatering() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    eventDate: '',
    guests: '50-100',
    requirements: '',
    flavorPreference: 'Belgian Chocolate Truffle'
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.email || !formData.phone) {
      toast.error('Gourmet request: Please fill in all required company details.');
      return;
    }
    
    playSuccessChime();
    setSubmitted(true);
    toast.success('Corporate Request Lodged! 💼', {
      description: 'Our Senior Event Concierge will contact you with a curated PDF quote in 30 minutes.'
    });
  };

  return (
    <div className="bg-transparent min-h-screen text-[#FFFDFB] font-sans select-none relative pb-16">
      <SEO 
        title="Corporate Cakes & Event Catering Delhi NCR" 
        description="Premium bespoke corporate branding cakes, logo cupcakes, employee milestone dessert boxes, and high-end event catering across Faridabad, Delhi, and Noida."
        keywords="corporate cake delivery Delhi NCR, custom logo cupcakes Faridabad, office celebration cakes Gurgaon, corporate catering bakeries"
      />

      {/* Hero Banner Section */}
      <section className="relative pt-8 pb-12 px-4 md:px-8 max-w-[1280px] mx-auto">
        <div className="rounded-[40px] overflow-hidden relative bg-[#1E0B07]/90 border border-[#DFB15B]/40 text-white p-8 md:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl backdrop-blur-xl">
          {/* Subtle graphic background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,177,91,0.1)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="w-full lg:w-[55%] space-y-6 text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-[#DFB15B]/20 border border-[#DFB15B]/40 text-[#DFB15B] px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-sm">
              <Briefcase className="w-4 h-4 text-[#DFB15B]" />
              <span>B2B Bespoke Solutions</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB15B] via-pink-400 to-[#F3C87A]">Corporate Elite</span> <br />
              Celebrations
            </h1>

            <p className="text-sm md:text-base text-slate-200 font-medium max-w-[480px] leading-relaxed">
              Bespoke branding cakes, customized cupcake towers, and premium employee milestone dessert boxes hand-delivered to your offices across NCR.
            </p>

            <div className="flex items-center gap-5 text-xs text-slate-300 font-bold">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>GST Invoicing Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Bulk Custom Logo Prints</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[40%] relative flex justify-center z-10">
            <div className="relative w-full max-w-[340px] aspect-square rounded-[36px] overflow-hidden shadow-2xl border-4 border-[#DFB15B]/40 bg-[#0F0503]">
              <img 
                src="https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=500&h=500&fit=crop" 
                alt="Corporate Event Dessert Curation" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0503]/90 via-transparent to-transparent flex items-end p-5">
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wide text-white">Elite Dessert Curation</h4>
                  <p className="text-[10px] font-bold text-[#DFB15B] mt-0.5">Hand-delivered to office boardrooms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Services Grid */}
      <section className="relative py-10 px-4 md:px-8 max-w-[1280px] mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight">Our Executive Portfolio</h2>
          <p className="text-sm text-slate-300 font-medium max-w-[500px] mx-auto">Designed to make office milestones delicious and visually magnificent.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Branded Logo Cakes",
              desc: "Edible high-definition company logo cakes paired with corporate colors on award-winning truffles.",
              icon: Building,
              color: "bg-blue-500/20 text-blue-300 border-blue-500/30"
            },
            {
              title: "Cupcake Towers",
              desc: "Spectacular multi-tier cupcake stands showcasing gourmet frosted treats with customized messaging plaques.",
              icon: Sparkles,
              color: "bg-purple-500/20 text-purple-300 border-purple-500/30"
            },
            {
              title: "Milestone Hampers",
              desc: "VIP dessert hampers curated inside linen premium boxes to celebrate employees work anniversaries.",
              icon: Award,
              color: "bg-amber-500/20 text-amber-300 border-amber-500/30"
            },
            {
              title: "Event Catering",
              desc: "Complete luxury dessert bar setups for annual days, product launches, and festive gatherings.",
              icon: Users,
              color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
            }
          ].map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-[#1E0B07]/80 border border-[#DFB15B]/30 backdrop-blur-md rounded-[30px] p-6 shadow-xl flex flex-col text-left justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl ${srv.color} border flex items-center justify-center shadow-inner`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-base font-black text-white uppercase tracking-wide">{srv.title}</h3>
                  <p className="text-xs text-slate-300 font-normal leading-relaxed">{srv.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quote Request Form */}
      <section className="relative py-10 px-4 md:px-8 max-w-[800px] mx-auto">
        <div className="bg-[#1E0B07]/80 backdrop-blur-xl border border-[#DFB15B]/30 rounded-[36px] p-6 md:p-10 shadow-2xl text-left">
          <div className="text-center mb-8 space-y-1">
            <h3 className="text-2xl font-black text-white tracking-tight">Request a Custom Quote</h3>
            <p className="text-xs text-slate-300 font-medium">Enter details below and receive immediate gourmet proposals.</p>
          </div>

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-white uppercase tracking-wide">Request Submitted!</h4>
              <p className="text-xs text-slate-300 max-w-[400px] mx-auto font-medium leading-relaxed">
                Thank you for choosing CakeUrban. Our Corporate Event Lead has received your parameters and is drafting your customized PDF catalog right now.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => { playBtnTap(); setSubmitted(false); }}
                  className="px-6 py-2.5 rounded-full border border-white/30 text-white hover:text-[#DFB15B] hover:border-[#DFB15B] text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#DFB15B]">Contact Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Priyanjali Sen" 
                    className="w-full h-12 px-4 rounded-2xl bg-[#0F0503]/80 border border-white/20 text-white placeholder-slate-400 font-semibold text-xs focus:outline-none focus:border-[#DFB15B] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#DFB15B]">Company Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="e.g. Google India" 
                    className="w-full h-12 px-4 rounded-2xl bg-[#0F0503]/80 border border-white/20 text-white placeholder-slate-400 font-semibold text-xs focus:outline-none focus:border-[#DFB15B] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#DFB15B]">Corporate Email *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="e.g. name@company.com" 
                    className="w-full h-12 px-4 rounded-2xl bg-[#0F0503]/80 border border-white/20 text-white placeholder-slate-400 font-semibold text-xs focus:outline-none focus:border-[#DFB15B] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#DFB15B]">Contact Phone *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g. +91 98765 43210" 
                    className="w-full h-12 px-4 rounded-2xl bg-[#0F0503]/80 border border-white/20 text-white placeholder-slate-400 font-semibold text-xs focus:outline-none focus:border-[#DFB15B] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#DFB15B]">Event Date</label>
                  <input 
                    type="date" 
                    value={formData.eventDate}
                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                    className="w-full h-12 px-4 rounded-2xl bg-[#0F0503]/80 border border-white/20 text-white font-semibold text-xs focus:outline-none focus:border-[#DFB15B] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#DFB15B]">Estimated Guest Count</label>
                  <select 
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: e.target.value})}
                    className="w-full h-12 px-4 rounded-2xl bg-[#0F0503] border border-white/20 text-white font-semibold text-xs focus:outline-none focus:border-[#DFB15B] transition-all"
                  >
                    <option value="10-30">10 to 30 Guests</option>
                    <option value="30-50">30 to 50 Guests</option>
                    <option value="50-100">50 to 100 Guests</option>
                    <option value="100-250">100 to 250 Guests</option>
                    <option value="250+">250+ Guests (Large Scale)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-[#DFB15B]">Custom Event Theme & Requirements</label>
                <textarea 
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  rows={4}
                  placeholder="e.g. We require 100 customized vanilla & Belgian chocolate cupcakes with our tech company logo printed on edible starch paper, plus one main 5kg milestone block cake..." 
                  className="w-full p-4 rounded-2xl bg-[#0F0503]/80 border border-white/20 text-white placeholder-slate-400 font-semibold text-xs focus:outline-none focus:border-[#DFB15B] transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full h-13 rounded-full bg-gradient-to-r from-[#DFB15B] to-[#F3C87A] text-[#0F0503] font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#0F0503]" />
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Corporate testimonials */}
      <section className="relative py-12 px-4 md:px-8 max-w-[1280px] mx-auto">
        <div className="text-center mb-10 space-y-1">
          <h3 className="text-xl font-black text-white uppercase tracking-wide">Trusted by Leading Teams</h3>
          <p className="text-xs text-slate-300 font-medium">Delivering excellence to Gurgaon, Delhi, and Noida office hubs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              company: "Stripe India",
              quote: "The brand logo cupcakes were an absolute hit! Pristine definition and decadent gourmet flavor. Perfect execution.",
              author: "Ananya R., HR Director"
            },
            {
              company: "Samsung R&D",
              quote: "Our 10th-anniversary celebration cake was outstanding. Beautiful structural tiers, delicious fresh layers, and handled with extreme sanitization.",
              author: "Rohan M., Event Lead"
            },
            {
              company: "Google Gurgaon",
              quote: "Highly professional service, automated GST invoicing, and reliable temperature-controlled delivery vans. Our ultimate office partner.",
              author: "Nikhil S., Procurement Executive"
            }
          ].map((tst, idx) => (
            <div key={idx} className="bg-[#1E0B07]/80 backdrop-blur-md border border-[#DFB15B]/30 p-6 rounded-[24px] text-left flex flex-col justify-between shadow-xl">
              <p className="text-xs text-slate-200 font-medium italic leading-relaxed">"{tst.quote}"</p>
              <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center">
                <div>
                  <h5 className="text-xs font-black text-white">{tst.company}</h5>
                  <p className="text-[10px] text-[#DFB15B] font-bold">{tst.author}</p>
                </div>
                <div className="flex text-amber-300">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
