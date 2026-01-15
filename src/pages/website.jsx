import React, { useEffect, useMemo, useState } from "react";
import {
  Cpu,
  Menu,
  X,
  Phone,
  Mail,
  Building2,
  Navigation,
  Globe,
  CheckCircle2,
  Layout,
  TrendingUp,
  Smartphone,
  Database,
  Users,
  Shield,
  Zap,
  Target,
  Eye,
  ChevronRight,
  Star,
  Quote,
  ArrowRight,
  HelpCircle,
  Moon,
  Sun,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

/**
 * IQ SYNC - PREMIUM FULL LANDING PAGE
 * Added:
 * - Dark mode switch (localStorage)
 * - Real portfolio image grid
 * - Scroll progress bar + smooth scroll
 *
 * THEME UPDATED:
 * - Indigo/Blue -> Green theme (as requested)
 */

const cn = (...classes) => classes.filter(Boolean).join(" ");

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1 },
};

function useSmoothScroll() {
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || href === "#") return;

      const el = document.querySelector(href);
      if (!el) return;

      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });

      // FIX ESLINT
      window.history.pushState(null, "", href);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[999] bg-emerald-600 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

const SectionHeader = ({ subtitle, title, highlight, centered = true }) => (
  <div className={cn(centered ? "text-center" : "text-left", "mb-14")}>
    <p className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">
      {subtitle}
    </p>
    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
      {title}{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">
        {highlight}
      </span>
    </h2>
  </div>
);

const Pill = ({ children }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-white/10 border border-emerald-100 dark:border-white/10 text-emerald-700 dark:text-emerald-200 font-bold text-xs uppercase tracking-widest">
    <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
    {children}
  </div>
);

const Button = ({ variant = "primary", className = "", children, ...props }) => {
  const base =
    "inline-flex items-center justify-center font-bold transition-all select-none";
  const styles = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200/60 hover:-translate-y-0.5",
    secondary:
      "bg-white dark:bg-white/10 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/15",
    dark:
      "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-600 dark:hover:text-white",
    ghost:
      "bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10",
  };

  return (
    <button
      className={cn(
        base,
        styles[variant],
        "px-8 py-4 rounded-2xl text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const ThemeToggle = ({ theme, setTheme }) => {
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all"
      aria-label="Toggle theme"
      title="Toggle dark mode"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-black tracking-widest text-white">
            LIGHT
          </span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-slate-900" />
          <span className="text-xs font-black tracking-widest text-slate-900">
            DARK
          </span>
        </>
      )}
    </button>
  );
};

const Navbar = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = useMemo(
    () => [
      { name: "About", href: "#about" },
      { name: "Services", href: "#services" },
      { name: "Process", href: "#process" },
      { name: "Portfolio", href: "#portfolio" },
      { name: "Pricing", href: "#pricing" },
      { name: "FAQ", href: "#faq" },
      { name: "Offices", href: "#offices" },
      { name: "Contact", href: "#contact" },
    ],
    []
  );

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-500",
        scrolled
          ? "bg-white/90 dark:bg-slate-950/80 backdrop-blur-lg shadow-xl py-3"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <a href="#top" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-emerald-600 to-green-500 p-2 rounded-xl rotate-3 group-hover:rotate-0 transition-transform">
              <Cpu className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
              IQ <span className="text-emerald-600">SYNC</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-black text-slate-600 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 tracking-[0.15em] transition-colors uppercase"
              >
                {link.name}
              </a>
            ))}

            <ThemeToggle theme={theme} setTheme={setTheme} />

            <a href="#contact">
              <Button variant="dark" className="px-7 py-3 rounded-full text-sm">
                LET’S TALK <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </a>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-900 dark:text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-white/10 shadow-2xl lg:hidden"
          >
            <div className="p-8 space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-2xl font-black text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a href="#contact" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Start a Project</Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, points = [], badge }) => (
  <motion.div
    variants={fadeUp}
    className="bg-white dark:bg-slate-950 p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all"
  >
    <div className="flex items-start justify-between gap-4">
      <Icon className="w-14 h-14 text-emerald-600" />
      {badge ? (
        <div className="text-xs font-black px-4 py-2 rounded-full bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-500/20">
          {badge}
        </div>
      ) : null}
    </div>

    <h4 className="text-2xl font-black mt-8 mb-4 text-slate-900 dark:text-white">
      {title}
    </h4>
    <p className="text-slate-600 dark:text-slate-300 mb-7 leading-relaxed">
      {desc}
    </p>

    {points?.length > 0 && (
      <ul className="grid grid-cols-2 gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
        {points.map((p) => (
          <li key={p} className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
            {p}
          </li>
        ))}
      </ul>
    )}
  </motion.div>
);

const PricingCard = ({
  title,
  price,
  subtitle,
  features,
  popular = false,
}) => (
  <div
    className={cn(
      "rounded-[2.5rem] p-10 border shadow-sm transition-all",
      popular
        ? "bg-slate-900 text-white border-slate-800 shadow-2xl"
        : "bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-100 dark:border-white/10 hover:shadow-xl"
    )}
  >
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-2xl font-black">{title}</h4>
        <p
          className={cn(
            "mt-2",
            popular ? "text-slate-300" : "text-slate-500 dark:text-slate-300"
          )}
        >
          {subtitle}
        </p>
      </div>
      {popular && (
        <div className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-widest">
          Most Popular
        </div>
      )}
    </div>

    <div className="mt-8">
      <div className="text-4xl font-black">{price}</div>
      <p
        className={cn(
          "mt-2",
          popular ? "text-slate-300" : "text-slate-500 dark:text-slate-300"
        )}
      >
        Includes premium design + launch support
      </p>
    </div>

    <div className="mt-8 space-y-3">
      {features.map((f) => (
        <div key={f} className="flex items-center gap-3 font-semibold">
          <CheckCircle2
            className={cn(
              "w-5 h-5",
              popular ? "text-emerald-400" : "text-green-600"
            )}
          />
          <span
            className={cn(
              popular ? "text-slate-100" : "text-slate-700 dark:text-slate-200"
            )}
          >
            {f}
          </span>
        </div>
      ))}
    </div>

    <a href="#contact" className="block mt-10">
      <Button variant={popular ? "primary" : "secondary"} className="w-full">
        Get Started <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </a>
  </div>
);

const TestimonialCard = ({ name, role, text }) => (
  <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-all">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-yellow-500">
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
      </div>
      <Quote className="text-slate-300 w-7 h-7" />
    </div>
    <p className="text-slate-600 dark:text-slate-300 mt-6 leading-relaxed">
      {text}
    </p>
    <div className="mt-8">
      <div className="font-black text-slate-900 dark:text-white">{name}</div>
      <div className="text-slate-500 dark:text-slate-300 font-semibold text-sm">
        {role}
      </div>
    </div>
  </div>
);

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-[2rem] p-7 shadow-sm">
      <button
        className="w-full flex items-center justify-between text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <span className="font-black text-slate-900 dark:text-white">{q}</span>
        </div>
        <span className="text-slate-500 dark:text-slate-300 font-black">
          {open ? "-" : "+"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PortfolioCard = ({ title, tag, image, desc }) => (
  <motion.div
    variants={fadeUp}
    className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 dark:border-white/10 bg-white dark:bg-slate-950 shadow-sm hover:shadow-xl transition-all"
  >
    <div className="relative">
      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover group-hover:scale-[1.03] transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />
      <div className="absolute top-5 left-5 px-4 py-2 rounded-full bg-white/90 text-slate-900 font-black text-xs uppercase tracking-widest">
        {tag}
      </div>
    </div>

    <div className="p-8">
      <h4 className="text-2xl font-black text-slate-900 dark:text-white">
        {title}
      </h4>
      <p className="mt-3 text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
        {desc}
      </p>

      <a
        href="#contact"
        className="mt-6 inline-flex items-center text-emerald-600 dark:text-emerald-400 font-black"
      >
        View Details <ExternalLink className="ml-2 w-4 h-4" />
      </a>
    </div>
  </motion.div>
);

export default function IQSyncLanding() {
  useSmoothScroll();

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("iqsync_theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("iqsync_theme", theme);
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const services = [
    {
      icon: Layout,
      title: "Website Design & Development",
      desc: "Modern, fast, mobile-friendly websites that represent your brand professionally and build customer trust.",
      points: ["Business Sites", "E-commerce", "Portfolios", "Landing Pages"],
      badge: "Free Demo Available",
    },
    {
      icon: TrendingUp,
      title: "Digital Marketing",
      desc: "Result-driven marketing that brings visibility, leads, and long-term brand authority.",
      points: ["Social Media", "SEO", "Google Ads", "Lead Generation"],
    },
    {
      icon: Smartphone,
      title: "Mobile App Development",
      desc: "Smooth, user-friendly mobile apps that make your business accessible anytime, anywhere.",
      points: ["Android Apps", "iOS Apps", "Booking Apps", "Business Apps"],
    },
    {
      icon: Database,
      title: "CRM & Automation",
      desc: "Track leads, follow-ups, customers, and sales with powerful CRM systems built for growth.",
      points: ["Lead Tracking", "Automation", "Sales Pipeline", "Analytics"],
    },
  ];

  const process = [
    {
      title: "Discovery & Strategy",
      desc: "We understand your business, audience, and goals before we build anything.",
      icon: Target,
    },
    {
      title: "Design & Development",
      desc: "Premium UI + clean code + fast performance. Built to impress and convert.",
      icon: Zap,
    },
    {
      title: "Launch & Optimization",
      desc: "Testing, SEO basics, speed improvements, and smooth deployment.",
      icon: Shield,
    },
    {
      title: "Support & Growth",
      desc: "We stay connected for updates, improvements, and scaling.",
      icon: Users,
    },
  ];

  const portfolio = [
    {
      title: "Premium Business Website",
      tag: "Website",
      desc: "Clean layout, premium UI, and strong CTA structure designed for conversions.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1400",
    },
    {
      title: "E-commerce Storefront",
      tag: "E-Commerce",
      desc: "Modern product UI, category flow, and fast checkout experience.",
      image:
        "https://images.unsplash.com/photo-1557825835-70d97c4aa567?auto=format&fit=crop&q=80&w=1400",
    },
    {
      title: "CRM Dashboard System",
      tag: "CRM",
      desc: "Pipeline tracking, follow-ups, analytics, and automation workflows.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1400",
    },
    {
      title: "Social Media Growth Campaign",
      tag: "Marketing",
      desc: "Content strategy + creatives designed to build authority and generate leads.",
      image:
        "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=1400",
    },
    {
      title: "Mobile Booking App",
      tag: "Mobile App",
      desc: "Smooth UI, fast flow, and modern experience for service bookings.",
      image:
        "data:image/jpeg;base64,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",
    },
    {
      title: "Corporate Landing Page",
      tag: "Landing Page",
      desc: "Premium sections with motion design and lead-focused layout.",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1400",
    },
  ];

  const pricing = [
    {
      title: "Starter",
      price: "₹9,999",
      subtitle: "Best for personal brands & small businesses",
      features: [
        "Premium single-page website",
        "Mobile responsive design",
        "Basic SEO setup",
        "WhatsApp & Call buttons",
        "Fast delivery",
      ],
    },
    {
      title: "Business",
      price: "₹19,999",
      subtitle: "Best for growing companies",
      popular: true,
      features: [
        "Multi-page website (up to 6 pages)",
        "Premium UI + smooth animations",
        "SEO-friendly structure",
        "Contact form integration",
        "1 month support",
      ],
    },
    {
      title: "Enterprise",
      price: "Custom",
      subtitle: "Best for scaling & automation",
      features: [
        "Custom design system",
        "Web app / CRM integration",
        "Performance optimization",
        "Security best practices",
        "Priority support",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Rahul S",
      role: "Business Owner",
      text: "IQ Sync delivered a premium website with great speed and design. The support was smooth and professional.",
    },
    {
      name: "Ayesha M",
      role: "Startup Founder",
      text: "We got leads within days after launch. The design looks modern and builds trust instantly.",
    },
    {
      name: "Karthik V",
      role: "Service Provider",
      text: "Very clear communication and fast delivery. The demo helped us finalize confidently.",
    },
  ];

  const faqs = [
    {
      q: "Do you provide a free demo website?",
      a: "Yes. We provide a free demo so you can see the design style and layout quality before moving forward.",
    },
    {
      q: "How long does it take to build a website?",
      a: "It depends on requirements. Most business websites are delivered within a few days to 2 weeks.",
    },
    {
      q: "Do you provide support after delivery?",
      a: "Yes. We provide support and maintenance options so your website stays updated and secure.",
    },
    {
      q: "Can you handle marketing along with the website?",
      a: "Absolutely. We provide complete digital growth support including SEO, social media marketing, and ads.",
    },
  ];

  return (
    <div
      id="top"
      className="bg-[#fcfcfd] dark:bg-slate-950 selection:bg-emerald-100 selection:text-emerald-900"
    >
      <ScrollProgress />
      <Navbar theme={theme} setTheme={setTheme} />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[480px] h-[480px] bg-emerald-200/40 dark:bg-emerald-500/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-[520px] h-[520px] bg-green-200/40 dark:bg-green-500/10 blur-3xl rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.7 }}
          >
            <Pill>Websites | Marketing | Apps | CRM</Pill>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.95] mt-8 mb-7">
              Smart Solutions. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 to-green-600">
                Synchronized
              </span>{" "}
              <br />
              Growth.
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-lg leading-relaxed">
              We help businesses build a premium digital identity with websites,
              marketing, mobile apps, and CRM solutions. Get a free demo website today.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <a href="#contact">
                <Button className="w-full sm:w-auto">Get Free Demo</Button>
              </a>

              <a href="tel:7868000645">
                <Button variant="secondary" className="w-full sm:w-auto">
                  7868000645 <Phone className="ml-2 w-5 h-5" />
                </Button>
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 text-slate-500 dark:text-slate-300 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                130+ Clients Served
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Premium UI & Fast Delivery
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={scaleIn}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 bg-white dark:bg-slate-950 p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/10">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2026"
                className="rounded-[2rem] w-full object-cover aspect-square"
                alt="Digital Solutions"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <SectionHeader
                subtitle="Our Story"
                title="The Heart Behind"
                highlight="IQ Sync"
                centered={false}
              />

              <div className="space-y-6 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                <p>
                  <span className="font-black text-slate-900 dark:text-white italic">
                    IQ Sync was born from a simple idea:
                  </span>{" "}
                  today, a business without a digital presence loses opportunities every day.
                </p>
                <p>
                  We saw great businesses with strong services and loyal customers, but
                  missing one key element — a premium online identity.
                </p>

                <div className="bg-emerald-50 dark:bg-white/5 p-6 rounded-2xl border-l-4 border-emerald-600">
                  <p className="font-black text-slate-900 dark:text-white mb-2">
                    The name IQ Sync represents what we do best:
                  </p>
                  <p>
                    <strong>IQ</strong> = Smart solutions | <strong>Sync</strong> = Connecting everything smoothly
                  </p>
                </div>

                <p>
                  We don’t just build websites — we synchronize your brand with the digital world.
                  With <span className="font-black text-slate-900 dark:text-white">130+</span> successful clients, we help
                  businesses look premium, operate smarter, and grow faster.
                </p>
              </div>
            </motion.div>

            <div className="grid gap-8">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10"
              >
                <Target className="text-emerald-600 w-12 h-12 mb-6" />
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                  Our Mission
                </h4>
                <p className="text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                  To help every business build a strong digital identity and achieve real growth through
                  premium design, smart technology, and result-driven marketing.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10"
              >
                <Eye className="text-green-600 w-12 h-12 mb-6" />
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                  Our Vision
                </h4>
                <p className="text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                  To become a trusted digital partner for businesses worldwide by delivering powerful,
                  modern, and future-ready digital solutions.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader subtitle="Expertise" title="Digital Solutions" highlight="Built for Success" />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="grid md:grid-cols-2 gap-8"
          >
            {services.map((s) => (
              <FeatureCard key={s.title} {...s} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader subtitle="How We Work" title="A Simple Process" highlight="Premium Results" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((p) => (
              <motion.div
                key={p.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] p-8 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-6">
                  <p.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                  {p.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO GRID */}
      <section id="portfolio" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader subtitle="Portfolio" title="Real Work That" highlight="Looks Premium" />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {portfolio.map((item) => (
              <PortfolioCard key={item.title} {...item} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader subtitle="Packages" title="Premium Plans" highlight="For Every Stage" />

          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((p) => (
              <PricingCard key={p.title} {...p} />
            ))}
          </div>

          <div className="mt-12 text-center text-slate-500 dark:text-slate-300 font-semibold">
            Need a custom plan?{" "}
            <a href="#contact" className="text-emerald-600 dark:text-emerald-400 font-black">
              Talk to us
            </a>
            .
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader subtitle="Client Feedback" title="Trusted by" highlight="Growing Businesses" />

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
              >
                <TestimonialCard {...t} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader subtitle="Questions" title="Frequently Asked" highlight="FAQ" />
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((f) => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* OFFICES */}
      <section id="offices" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader subtitle="Presence" title="Our Strategic" highlight="Network" />

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/10 shadow-sm">
              <Building2 className="text-emerald-600 mb-6 w-10 h-10" />
              <h4 className="text-2xl font-black mb-4 text-slate-900 dark:text-white">
                Head Office
              </h4>
              <p className="text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                Bhive 46/1, NH 44, Kudlu Gate, Hosapalaya, Bengaluru, KA 560068
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/10 shadow-sm">
              <Navigation className="text-green-600 mb-6 w-10 h-10" />
              <h4 className="text-2xl font-black mb-4 text-slate-900 dark:text-white">
                Chennai Hub
              </h4>
              <p className="text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                Strategic development center focused on product engineering, marketing systems, and automation.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900 text-white border border-slate-800 shadow-sm">
              <Globe className="text-emerald-400 mb-6 w-10 h-10" />
              <h4 className="text-2xl font-black mb-4">Remote Office</h4>
              <p className="text-slate-300 font-semibold leading-relaxed">
                Distributed team supporting clients across industries with fast delivery and consistent quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-emerald-600 rounded-[3rem] p-12 lg:p-20 text-white flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-black mb-8 italic">Ready to Sync?</h2>

              <p className="text-white/90 text-lg font-semibold leading-relaxed max-w-md">
                Share your requirements and we’ll build a premium digital presence that customers trust.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="bg-white/10 p-4 rounded-2xl">
                    <Mail />
                  </div>
                  <span className="text-xl font-semibold">engineering@iqsync.io</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="bg-white/10 p-4 rounded-2xl">
                    <Phone />
                  </div>
                  <span className="text-xl font-semibold">7868000645</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 bg-white rounded-3xl p-8 text-slate-900 w-full shadow-2xl">
              <h4 className="text-2xl font-black mb-6">Let’s build your presence</h4>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <textarea
                  placeholder="Tell us what you want (Website / Marketing / App / CRM)"
                  className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 h-28"
                />
                <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black hover:bg-slate-900 transition-all">
                  Submit Request
                </button>

                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  By submitting, you agree to be contacted by IQ Sync regarding your request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 pt-20 pb-10 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Cpu className="text-emerald-500 w-8 h-8" />
              <span className="text-3xl font-black">IQ SYNC</span>
            </div>
            <p className="text-slate-400 text-lg max-w-sm font-semibold leading-relaxed">
              We synchronize your brand with the digital world through premium design and smart technology.
            </p>
          </div>

          <div>
            <h6 className="font-black mb-6 text-emerald-400 uppercase tracking-widest text-sm">
              Company
            </h6>
            <ul className="space-y-3 text-slate-400 font-semibold">
              <li><a className="hover:text-white transition-colors" href="#about">Our Story</a></li>
              <li><a className="hover:text-white transition-colors" href="#services">Services</a></li>
              <li><a className="hover:text-white transition-colors" href="#pricing">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h6 className="font-black mb-6 text-emerald-400 uppercase tracking-widest text-sm">
              Contact
            </h6>
            <ul className="space-y-3 text-slate-400 font-semibold">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> 7868000645
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> engineering@iqsync.io
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-10 border-t border-slate-800 text-slate-500 text-sm font-semibold">
          <p>© 2026 IQ Sync Global. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
