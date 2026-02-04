import React, { useState, useEffect } from 'react';
import {
  Menu, X, ChevronDown, ArrowRight,
  TrendingUp, Megaphone, Truck, Wallet, Tag, Users, LayoutDashboard,
  Calculator, PieChart, BarChart4, Hourglass, PackageCheck, AlertTriangle, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Navigation Data Configuration ---

const SOLUTIONS = [
  {
    title: "Sales Intelligence",
    description: "Boost conversions with AI-driven lead qualification.",
    icon: TrendingUp,
    href: "/",
    color: "text-green-500",
    bgColor: "bg-green-50"
  },
  {
    title: "Marketing Intelligence",
    description: "Automate content creation and optimize ad campaigns.",
    icon: Megaphone,
    href: "/",
    color: "text-orange-500",
    bgColor: "bg-orange-50"
  },
  {
    title: "Fulfillment Intelligence",
    description: "Optimize shipping routes and reduce delivery times.",
    icon: Truck,
    href: "/",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50"
  },
  {
    title: "Finance Intelligence",
    description: "Automate payment reconciliation and reporting.",
    icon: Wallet,
    href: "/",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    title: "Product Intelligence",
    description: "Prevent stockouts with intelligent demand forecasting.",
    icon: Tag,
    href: "/",
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  {
    title: "Customer Intelligence",
    description: "Gain deep insights into customer behavior.",
    icon: Users,
    href: "/",
    color: "text-pink-500",
    bgColor: "bg-pink-50"
  },
  {
    title: "Magic Dashboard",
    description: "Your entire business health in one single view.",
    icon: LayoutDashboard,
    href: "/",
    color: "text-clevrr-primary",
    bgColor: "bg-blue-50"
  }
];

const TOOLS = [
  {
    title: "Unit Economics Calculator",
    icon: Calculator,
    href: "/d2c-calculators"
  },
  {
    title: "Smart Bundle Planner",
    icon: PieChart,
    href: "/d2c-calculators/#bundles"
  },
  {
    title: "Marketing Budget Planner",
    icon: BarChart4,
    href: "/d2c-calculators/#marketing"
  },
  {
    title: "Runway Planner",
    icon: Hourglass,
    href: "/d2c-calculators/#runway"
  },
  {
    title: "Inventory Stock Planner",
    icon: PackageCheck,
    href: "/d2c-calculators/#inventory"
  },
  {
    title: "RTO Simulator",
    icon: AlertTriangle,
    href: "/d2c-calculators/#rto"
  },
  {
    title: "AI Search Visibility",
    icon: Search,
    href: "/ai-visibility"
  }
];

// --- Components ---

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || mobileMenuOpen || activeDropdown
        ? "bg-white border-b border-slate-200 shadow-sm"
        : "bg-white/80 backdrop-blur-md border-b border-transparent"
        }`}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">

        {/* Left: Logo */}
        <div className="flex items-center gap-8 z-20">
          <a href="/" className="flex items-center gap-2">
            <img
              src="https://getclevrr.com/logos/logo-dark.png"
              alt="Clevrr AI"
              className="h-7 md:h-10 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">

            {/* Solutions Dropdown Trigger */}
            <div
              className="relative group px-3 py-2"
              onMouseEnter={() => setActiveDropdown('solutions')}
            >
              <button
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${activeDropdown === 'solutions' ? 'text-clevrr-primary' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Solutions
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'solutions' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Tools Dropdown Trigger */}
            <div
              className="relative group px-3 py-2"
              onMouseEnter={() => setActiveDropdown('tools')}
            >
              <button
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${activeDropdown === 'tools' ? 'text-clevrr-primary' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Tools
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'tools' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Direct Links */}
            <a href="/blog" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Blogs
            </a>
            <a href="/integrations" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Integrations
            </a>

          </div>
        </div>

        {/* Right: CTA & Mobile Menu Toggle */}
        <div className='flex'>
          <div className="flex items-center gap-3 me-5 md:gap-4">
            <a
              href="/ai-visibility"
              className="flex items-center gap-2 bg-clevrr-secondary hover:bg-clevrr-primary text-white px-3 py-2 md:px-5 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all shadow-lg shadow-clevrr-primary/20 hover:shadow-clevrr-primary/40 hover:-translate-y-0.5 whitespace-nowrap"
            >
              AI Visibility
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </a>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <a
              href="https://cal.getclevrr.com/demo"
              className="flex items-center gap-2 bg-clevrr-primary hover:bg-clevrr-secondary text-white px-3 py-2 md:px-5 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all shadow-lg shadow-clevrr-primary/20 hover:shadow-clevrr-primary/40 hover:-translate-y-0.5 whitespace-nowrap"
            >
              Book a Demo
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </a>

            <button
              className="lg:hidden p-1 text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Desktop Dropdowns --- */}
      <AnimatePresence>
        {activeDropdown === 'solutions' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:block absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl z-40"
            onMouseEnter={() => setActiveDropdown('solutions')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-3 gap-x-8 gap-y-8">
                {SOLUTIONS.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${item.bgColor}`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-clevrr-primary transition-colors flex items-center gap-1">
                        {item.title}
                        {item.title === "Magic Dashboard" && <span className="px-1.5 py-0.5 bg-clevrr-primary/10 text-clevrr-primary text-[10px] rounded uppercase">New</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeDropdown === 'tools' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:block absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl z-40"
            onMouseEnter={() => setActiveDropdown('tools')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex gap-12">
                {/* Description Side */}
                <div className="w-1/4 pr-8 border-r border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Free Tools for Founders</h3>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    Before you automate, you must calculate. Use these free simulators to model your D2C growth.
                  </p>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">Did you know?</div>
                    <p className="text-xs text-slate-600 italic">"Correctly predicting RTO can save up to 15% of bottom-line margin."</p>
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="flex-1 grid grid-cols-3 gap-6">
                  {TOOLS.map((tool, index) => (
                    <a
                      key={index}
                      href={tool.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <tool.icon className="w-5 h-5 text-slate-600 group-hover:text-clevrr-primary" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{tool.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white overflow-y-auto pb-20 border-t border-slate-100"
          >
            <div className="p-4 space-y-1">

              {/* Mobile Solutions */}
              <div className="py-2 border-b border-slate-100">
                <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Solutions</div>
                <div className="grid grid-cols-1 gap-1 mt-1">
                  {SOLUTIONS.map((item, i) => (
                    <a key={i} href={item.href} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-slate-700 font-medium">{item.title}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Mobile Tools */}
              <div className="py-2 border-b border-slate-100">
                <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Free Tools</div>
                <div className="grid grid-cols-1 gap-1 mt-1">
                  {TOOLS.map((item, i) => (
                    <a key={i} href={item.href} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                      <item.icon className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-700 font-medium">{item.title}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Mobile Links */}
              <a href="/blog" className="block px-4 py-4 text-slate-700 font-medium hover:bg-slate-50 border-b border-slate-100">Blogs</a>
              <a href="/integrations" className="block px-4 py-4 text-slate-700 font-medium hover:bg-slate-50 border-b border-slate-100">Integrations</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;