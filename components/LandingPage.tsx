
import React from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Smartphone, 
  Sparkles, 
  DollarSign, 
  Shirt, 
  Layers, 
  Star
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LogoIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M15 7L21 12.5C21.6 13 21.6 14 21 14.5H16L12 18.5L8 14.5H3C2.4 14 2.4 13 3 12.5L9 7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M9 6C9 4.3 10.3 3 12 3C13.7 3 15 4.3 15 6V8" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M19 2L19.6 3.8L21.4 4.4L19.6 5L19 6.8L18.4 5L16.6 4.4L18.4 3.8L19 2Z" 
      fill="currentColor" 
      stroke="none"
    />
  </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="text-indigo-600">
                <LogoIcon className="w-8 h-8" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-serif">ClosetClear</span>
            </button>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <button 
                onClick={onLogin}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 px-4 py-2"
              >
                Log In
              </button>
              <button 
                onClick={onGetStarted}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all hover:shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="w-3 h-3" />
              <span>AI Integration</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Stop Drowning in Clothes. <span className="text-indigo-600 italic">Start Styling.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              ClosetClear AI digitizes your closet, suggests daily outfits, and helps you sell what you don't wear. Reclaim your space and your style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onGetStarted}
                className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200 transition-all"
              >
                Get Your Free Closet Audit
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 px-4 py-3">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                  ))}
                </div>
                <span className="text-sm text-slate-500 font-medium">Joined by 10,000+ minimalists</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-pink-100 rounded-[2rem] transform rotate-3 scale-105 -z-10"></div>
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
               {/* Simplified UI Mockup for Hero */}
               <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                 </div>
                 <div className="text-xs font-semibold text-slate-400">AI Analysis Active</div>
               </div>
               <div className="p-8 space-y-6">
                 <div className="flex gap-4 items-start p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                      <Shirt className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-slate-900 text-lg">Outfit of the Day</h3>
                      <p className="text-sm text-slate-500 mt-1">Based on your "Client Meeting" schedule, wear the Navy Blazer with the White Uniqlo Tee.</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                     <div className="text-sm text-slate-500">Utilization</div>
                     <div className="text-2xl font-bold text-slate-900">42%</div>
                     <div className="text-xs text-emerald-500 mt-1 font-semibold">↑ 12% this month</div>
                   </div>
                   <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                     <div className="text-sm text-slate-500">Resale Value</div>
                     <div className="text-2xl font-bold text-slate-900">$1,240</div>
                     <div className="text-xs text-slate-400 mt-1">Total liquid assets</div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
        
        {/* Trust Strip */}
        <div className="mt-20 pt-10 border-t border-slate-100 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">Featured In</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-serif text-2xl font-bold text-slate-900">VOGUE</span>
            <span className="font-serif text-2xl font-bold text-slate-900">GQ</span>
            <span className="font-serif text-2xl font-bold text-slate-900 italic">FastCompany</span>
            <span className="font-serif text-2xl font-bold text-slate-900">TechCrunch</span>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">The "Nothing to Wear" Paradox</h2>
            <p className="mt-4 text-lg text-slate-600">You have a closet full of clothes, yet you wear the same 20% of items 80% of the time. It's not just clutter—it's decision fatigue and lost money.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: "Closet Chaos",
                desc: "Overwhelmed by clutter? Visual noise creates mental noise, making mornings stressful before they even start."
              },
              {
                icon: Smartphone,
                title: "Decision Fatigue",
                desc: "The average person spends 15 minutes a day deciding what to wear. That's 90 hours a year wasted."
              },
              {
                icon: DollarSign,
                title: "Wasted Value",
                desc: "You're sitting on hundreds of dollars of unworn clothes. Uncover the liquid assets hiding in your wardrobe."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution / How it Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Your Personal AI Stylist</h2>
            <p className="mt-4 text-lg text-slate-600">Turn chaos into curated style in three simple steps.</p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-indigo-100 -z-10"></div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="relative bg-white pt-8 text-center">
                <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-8 border-slate-50 text-white font-bold text-2xl font-serif">1</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Snap & Scan</h3>
                <p className="text-slate-600">Take photos of your clothes. Our AI automatically identifies brand, category, color, and estimated resale value.</p>
              </div>
              <div className="relative bg-white pt-8 text-center">
                <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-8 border-slate-50 text-white font-bold text-2xl font-serif">2</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Get Styled</h3>
                <p className="text-slate-600">Receive daily outfit recommendations based on the weather, your calendar, and your style preferences.</p>
              </div>
              <div className="relative bg-white pt-8 text-center">
                <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-8 border-slate-50 text-white font-bold text-2xl font-serif">3</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sell or Donate</h3>
                <p className="text-slate-600">Identify unworn items. We'll tell you which marketplace pays the most or where to donate responsibly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Built for the Modern Minimalist</h2>
              <div className="space-y-8">
                {[
                  { title: "AI Image Recognition", desc: "No manual data entry. Just snap and go." },
                  { title: "Resale Price Estimator", desc: "Real-time data from Poshmark & ThredUp." },
                  { title: "Utilization Tracking", desc: "See exactly what you wear and what you don't." },
                  { title: "Travel Packer", desc: "Generate packing lists instantly based on trip duration." }
                ].map((feat, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{feat.title}</h4>
                      <p className="text-slate-400">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-800 rounded-3xl p-2 shadow-2xl border border-slate-700">
               {/* Abstract Dashboard representation */}
               <div className="bg-slate-900 rounded-2xl p-6 aspect-square flex flex-col justify-center items-center opacity-80">
                 <Sparkles className="w-16 h-16 text-indigo-500 mb-4" />
                 <p className="text-slate-400 font-mono text-sm">Generating outfits...</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-center text-slate-900 mb-16">Loved by Organized People Everywhere</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "I made $400 in my first week just selling clothes the app told me I hadn't worn in a year. It pays for itself.",
                author: "Sarah J.",
                role: "Marketing Director"
              },
              {
                text: "The outfit suggestions are scary good. It mixes pieces I never thought would go together. My morning routine is cut in half.",
                author: "Michael T.",
                role: "Software Engineer"
              },
              {
                text: "Finally, an app that focuses on sustainability and shopping your own closet first. A game changer for my consumption habits.",
                author: "Elena R.",
                role: "Eco-Fashion Blogger"
              }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-emerald-500 fill-current" />)}
                </div>
                <p className="text-slate-600 mb-6 italic font-serif text-lg">"{t.text}"</p>
                <div>
                  <div className="font-bold text-slate-900">{t.author}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How does the scanning work?", a: "Simply take a photo of your item (or a pile of items). Our AI automatically detects the category, color, brand, and material." },
              { q: "Is my data private?", a: "Yes. Your wardrobe photos and data are yours. We do not sell your personal information to advertisers." },
              { q: "Can I sell directly through the app?", a: "We integrate with platforms like Poshmark and eBay to help you create listings faster, but the final sale happens on those marketplaces." },
              { q: "What if I have a huge closet?", a: "ClosetClear is perfect for you. We recommend batch scanning 10-20 items a day. Most users digitize fully in one weekend." }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Closet?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of users who are saving time, making money, and dressing better every single day.</p>
          <button 
            onClick={onGetStarted}
            className="bg-white text-indigo-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-indigo-50 transition-all shadow-xl"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-indigo-600">
                <LogoIcon className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-white">ClosetClear</span>
            </div>
            <p className="text-sm">The intelligent wardrobe management system for the modern era.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          © 2025 ClosetClear AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
