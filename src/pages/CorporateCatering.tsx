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
    <div className="bg-[#FFF9FC] min-h-screen text-slate-800 font-sans select-none relative pb-16">
      <SEO 
        title="Corporate Cakes & Event Catering Delhi NCR" 
        description="Premium bespoke corporate branding cakes, logo cupcakes, employee milestone dessert boxes, and high-end event catering across Faridabad, Delhi, and Noida."
        keywords="corporate cake delivery Delhi NCR, custom logo cupcakes Faridabad, office celebration cakes Gurgaon, corporate catering bakeries"
      />

      {/* Hero Banner Section */}
      <section className="relative pt-8 pb-12 px-4 md:px-8 max-w-[1280px] mx-auto">
        <div className="rounded-[40px] overflow-hidden relative bg-gradient-to-r from-slate-900 to-[#1e112a] text-white p-8 md:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl">
          {/* Subtle graphic background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-40 pointer-events-none" />
          
          <div className="w-full lg:w-[55%] space-y-6 text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-sm">
              <Briefcase className="w-4 h-4" />
              <span>B2B Bespoke Solutions</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-[#FFA17A] to-pink-500">Corporate Elite</span> <br />
              Celebrations
            </h1>

            <p className="text-sm md:text-base text-slate-300 font-medium max-w-[480px] leading-relaxed">
              Bespoke branding cakes, customized cupcake towers, and premium employee milestone dessert boxes hand-delivered to your offices across NCR.
            </p>

            <div className="flex items-center gap-5 text-xs text-slate-400 font-bold">
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
            <div className="relative w-full max-w-[340px] aspect-square rounded-[36px] overflow-hidden shadow-2xl border-4 border-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=500&h=500&fit=crop" 
                alt="Corporate Event Dessert Curation" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wide">Elite Dessert Curation</h4>
                  <p className="text-[10px] font-bold text-slate-300 mt-0.5">Hand-delivered to office boardrooms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Services Grid */}
      <section className="relative py-10 px-4 md:px-8 max-w-[1280px] mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Our Executive Portfolio</h2>
          <p className="text-sm text-slate-500 font-semibold max-w-[500px] mx-auto">Designed to make office milestones delicious and visually magnificent.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Branded Logo Cakes",
              desc: "Edible high-definition company logo cakes paired with corporate colors on award-winning truffles.",
              icon: Building,
              color: "bg-blue-50 text-blue-600 border-blue-100"
            },
            {
              title: "Cupcake Towers",
              desc: "Spectacular multi-tier cupcake stands showcasing gourmet frosted treats with customized messaging plaques.",
              icon: Sparkles,
              color: "bg-purple-50 text-purple-600 border-purple-100"
            },
            {
              title: "Milestone Hampes",
              desc: "VIP dessert hampers curated inside linen premium boxes to celebrate employees work anniversaries.",
              icon: Award,
              color: "bg-amber-50 text-amber-600 border-amber-100"
            },
            {
              title: "Event Catering",
              desc: "Complete luxury dessert bar setups for annual days, product launches, and festive gatherings.",
              icon: Users,
              color: "bg-emerald-50 text-emerald-600 border-emerald-100"
            }
          ].map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className={`bg-white border rounded-[30px] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col text-left justify-between`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl ${srv.color.split(' ')[0]} ${srv.color.split(' ')[1]} flex items-center justify-center shadow-inner`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">{srv.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">{srv.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quote Request Form */}
      <section className="relative py-10 px-4 md:px-8 max-w-[800px] mx-auto">
        <div className="bg-white border border-pink-50/75 rounded-[36px] p-6 md:p-10 shadow-[0_15px_45px_rgba(255,79,163,0.03)] text-left">
          <div className="text-center mb-8 space-y-1">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Request a Custom Quote</h3>
            <p className="text-xs text-slate-500 font-semibold">Enter details below and receive immediate gourmet proposals.</p>
          </div>

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-800 uppercase tracking-wide">Request Submitted!</h4>
              <p className="text-xs text-slate-500 max-w-[400px] mx-auto font-semibold leading-relaxed">
                Thank you for choosing CakeUrban. Our Corporate Event Lead has received your parameters and is drafting your customized PDF catalog right now.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => { playBtnTap(); setSubmitted(false); }}
                  className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:text-pink-500 hover:border-pink-300 text-xs font-black uppercase tracking-wider"
                >
                  Send Another Inquiry
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Contact Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Priyanjali Sen" 
                    className="w-full h-12 px-4 rounded-2xl bg-slate-50/75 border border-slate-100 text-slate-800 placeholder-slate-400 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Company Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="e.g. Google India" 
                    className="w-full h-12 px-4 rounded-2xl bg-slate-50/75 border border-slate-100 text-slate-800 placeholder-slate-400 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Corporate Email *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="e.g. name@company.com" 
                    className="w-full h-12 px-4 rounded-2xl bg-slate-50/75 border border-slate-100 text-slate-800 placeholder-slate-400 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Contact Phone *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g. +91 98765 43210" 
                    className="w-full h-12 px-4 rounded-2xl bg-slate-50/75 border border-slate-100 text-slate-800 placeholder-slate-400 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Event Date</label>
                  <input 
                    type="date" 
                    value={formData.eventDate}
                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                    className="w-full h-12 px-4 rounded-2xl bg-slate-50/75 border border-slate-100 text-slate-800 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Estimated Guest Count</label>
                  <select 
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: e.target.value})}
                    className="w-full h-12 px-4 rounded-2xl bg-slate-50/75 border border-slate-100 text-slate-800 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
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
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Custom Event Theme & Requirements</label>
                <textarea 
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  rows={4}
                  placeholder="e.g. We require 100 customized vanilla & Belgian chocolate cupcakes with our tech company logo printed on edible starch paper, plus one main 5kg milestone block cake..." 
                  className="w-full p-4 rounded-2xl bg-slate-50/75 border border-slate-100 text-slate-800 placeholder-slate-400 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full h-13 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
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
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide">Trusted by Leading Teams</h3>
          <p className="text-xs text-slate-400 font-semibold">Delivering excellence to Gurgaon, Delhi, and Noida office hubs.</p>
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
            <div key={idx} className="bg-white border border-slate-50 p-6 rounded-[24px] text-left flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-xs text-slate-500 font-semibold italic leading-relaxed">"{tst.quote}"</p>
              <div className="pt-4 mt-4 border-t border-slate-50 flex justify-between items-center">
                <div>
                  <h5 className="text-xs font-black text-slate-800">{tst.company}</h5>
                  <p className="text-[10px] text-slate-400 font-bold">{tst.author}</p>
                </div>
                <div className="flex text-amber-400">
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
