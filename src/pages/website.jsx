import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Menu,
  X,
  Cpu,
  Shield,
  Zap,
  BarChart,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  CheckCircle2,
  Code2,
  Database,
  Layers,
  Smartphone,
  ExternalLink,
  Lock,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * IQ SYNC - ENTERPRISE SOFTWARE SOLUTIONS
 * Single Page JSX Application
 * Features: Framer Motion, Tailwind CSS, Lucide Icons
 */

// --- Reusable UI Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Solutions", href: "#solutions" },
    { name: "Methodology", href: "#methodology" },
    { name: "Case Studies", href: "#cases" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-xl py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-2 rounded-xl rotate-3 group-hover:rotate-0 transition-transform">
              <Cpu className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              IQ <span className="text-indigo-600">SYNC</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-bold text-slate-600 hover:text-indigo-600 tracking-wide transition-colors uppercase"
              >
                {link.name}
              </a>
            ))}

            <a
              href="/home"
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 tracking-wide transition-colors uppercase"
            >
              CRM
            </a>

            <button className="bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all hover:shadow-lg hover:shadow-indigo-200">
              LETS TALK
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-slate-900"
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl lg:hidden"
          >
            <div className="p-8 space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-2xl font-bold text-slate-900 hover:text-indigo-600"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold">
                Start a Project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeader = ({ title, highlight, subtitle, centered = true }) => (
  <div className={`${centered ? "text-center" : "text-left"} mb-20`}>
    <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">
      {subtitle}
    </h2>
    <h3 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
      {title}{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
        {highlight}
      </span>
    </h3>
  </div>
);

// --- Main Page ---

export default function IQSyncLanding() {
  return (
    <div className="bg-[#fcfcfd] selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg mb-8">
              <span className="text-indigo-700 font-bold text-xs uppercase tracking-widest flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2 animate-pulse" />
                Engineering the Intelligence of Tomorrow
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] mb-8">
              Code with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-blue-600">
                Synchronized
              </span>{" "}
              <br />
              Logic.
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              IQ Sync provides high-tier software engineering teams to help
              startups and enterprises ship robust, scalable, and AI-driven
              applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-200">
                Explore Solutions
              </button>
              <button className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center">
                Our Tech Stack <ChevronRight className="ml-2" />
              </button>
            </div>

            <div className="mt-16 flex items-center space-x-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="w-12 h-12 rounded-full border-4 border-white"
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="team"
                  />
                ))}
              </div>
              <div className="h-10 w-[1px] bg-slate-200" />
              <div>
                <p className="text-slate-900 font-black text-xl leading-none">
                  50+ Specialists
                </p>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  Ready to deploy
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-4 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070"
                className="rounded-[2rem] w-full object-cover aspect-square"
                alt="Code Preview"
              />
            </div>
            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-10 -right-10 bg-indigo-600 p-6 rounded-3xl shadow-2xl text-white z-20"
            >
              <Zap size={32} />
              <div className="mt-4">
                <p className="text-xs opacity-70 font-bold uppercase">
                  Deployment
                </p>
                <p className="text-2xl font-black">2.4ms</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Lines of Code", val: "12M+" },
              { label: "Cloud Projects", val: "450+" },
              { label: "Security Score", val: "99.9%" },
              { label: "Active Support", val: "24/7" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <h4 className="text-5xl font-black text-slate-900 mb-2">
                  {stat.val}
                </h4>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            subtitle="Expertise"
            title="Building the Core of"
            highlight="Modern Enterprise"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                color: "text-blue-600",
                bg: "bg-blue-50",
                title: "Architecture Design",
                text: "High-availability system designs using microservices and event-driven patterns.",
              },
              {
                icon: Code2,
                color: "text-indigo-600",
                bg: "bg-indigo-50",
                title: "Custom Development",
                text: "Tailored web and desktop applications built for massive scale and performance.",
              },
              {
                icon: Smartphone,
                color: "text-purple-600",
                bg: "bg-purple-50",
                title: "Mobile Engineering",
                text: "Swift, Kotlin, and React Native apps that deliver native-grade user experiences.",
              },
              {
                icon: Database,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                title: "Big Data & Analytics",
                text: "Processing billions of data points with Apache Spark, Kafka, and custom ETL pipelines.",
              },
              {
                icon: Shield,
                color: "text-rose-600",
                bg: "bg-rose-50",
                title: "DevSecOps",
                text: "Integrating security into the heart of your CI/CD pipeline for total protection.",
              },
              {
                icon: Globe,
                color: "text-amber-600",
                bg: "bg-amber-50",
                title: "Cloud Transformation",
                text: "Seamless migration and management of AWS, Azure, and Google Cloud environments.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div
                  className={`${item.bg} ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8`}
                >
                  <item.icon size={32} />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">
                  {item.title}
                </h4>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {item.text}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-indigo-600 font-bold hover:underline"
                >
                  Learn more <ArrowUpRight className="ml-1 w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY SECTION */}
      <section
        id="methodology"
        className="py-32 bg-slate-900 text-white rounded-[3rem] mx-6"
      >
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <SectionHeader
                centered={false}
                subtitle="Our Process"
                title="Synchronized"
                highlight="Development Lifecycle"
              />
              <p className="text-slate-400 text-lg mb-12 -mt-12">
                We don't just write code. We integrate with your business goals
                to deliver software that provides a competitive edge.
              </p>

              <div className="space-y-12">
                {[
                  {
                    step: "01",
                    title: "Discovery & Audit",
                    desc: "Deep dive into existing infra and business logic requirements.",
                  },
                  {
                    step: "02",
                    title: "Rapid Prototyping",
                    desc: "Iterative design sprints to validate core features within days.",
                  },
                  {
                    step: "03",
                    title: "Agile Implementation",
                    desc: "Bi-weekly releases with full transparent tracking via Jira.",
                  },
                  {
                    step: "04",
                    title: "Global Deployment",
                    desc: "Auto-scaling deployments with zero-downtime guarantees.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-5xl font-black text-indigo-500/30 italic leading-none">
                      {item.step}
                    </span>
                    <div>
                      <h5 className="text-xl font-bold mb-2 text-white">
                        {item.title}
                      </h5>
                      <p className="text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl">
                <div className="flex items-center space-x-2 mb-10">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-6 font-mono text-sm">
                  <p className="text-indigo-400">
                    # Initializing Sync Engine...
                  </p>
                  <p className="text-slate-300">
                    {">>"} Fetching cluster metrics...
                  </p>
                  <p className="text-green-400">
                    {">>"} Connection established: US-EAST-1
                  </p>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 2 }}
                      className="h-full bg-indigo-500"
                    />
                  </div>
                  <p className="text-slate-500">85% Optimization Complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            subtitle="Engagements"
            title="Choose Your"
            highlight="Speed to Market"
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                name: "Squad Start",
                price: "$8,500",
                period: "/month",
                desc: "Perfect for startups needing extra development muscle.",
                features: [
                  "2 Senior Developers",
                  "Project Manager",
                  "Daily Standups",
                  "Weekly Deployments",
                ],
              },
              {
                name: "Scale Up",
                price: "$18,000",
                period: "/month",
                featured: true,
                desc: "A full-scale autonomous team to own a product line.",
                features: [
                  "4 Senior Developers",
                  "1 UI/UX Designer",
                  "DevOps Specialist",
                  "QA Automation Engineer",
                  "Unlimited Architecture Consulting",
                ],
              },
              {
                name: "Enterprise Sync",
                price: "Custom",
                period: "",
                desc: "Legacy modernization and enterprise-wide digital shift.",
                features: [
                  "Dedicated On-site Leads",
                  "Compliance & Security Audit",
                  "Global Scaling Infrastructure",
                  "24/7 Priority SLA",
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-10 rounded-[2.5rem] border-2 flex flex-col ${
                  plan.featured
                    ? "border-indigo-600 bg-white shadow-2xl scale-105 z-10"
                    : "border-slate-100 bg-slate-50"
                }`}
              >
                {plan.featured && (
                  <span className="bg-indigo-600 text-white text-xs font-black px-4 py-1 rounded-full w-max mb-6 uppercase tracking-widest">
                    Most Popular
                  </span>
                )}
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  {plan.name}
                </h4>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-black text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-slate-500 ml-2 font-medium">
                    {plan.period}
                  </span>
                </div>
                <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                  {plan.desc}
                </p>

                <div className="space-y-5 mb-10 flex-grow">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start">
                      <CheckCircle2 className="text-indigo-600 mr-3 w-5 h-5 flex-shrink-0" />
                      <span className="text-slate-700 font-medium text-sm">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                    plan.featured
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  Secure a Team
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden">
            <div className="lg:w-1/2 p-12 lg:p-20 bg-indigo-600 text-white">
              <h2 className="text-5xl font-bold mb-8 italic">Ready to Sync?</h2>
              <p className="text-indigo-100 text-xl mb-12">
                Join 100+ high-growth companies that built their foundation with
                IQ Sync.
              </p>

              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                  <div className="bg-white/10 p-4 rounded-2xl">
                    <Mail />
                  </div>
                  <span className="text-xl font-medium">
                    engineering@iqsync.io
                  </span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="bg-white/10 p-4 rounded-2xl">
                    <Phone />
                  </div>
                  <span className="text-xl font-medium">+1 (415) 888-0000</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="bg-white/10 p-4 rounded-2xl">
                    <MapPin />
                  </div>
                  <span className="text-xl font-medium">
                    Market St, San Francisco
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 p-12 lg:p-20">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border-none p-5 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all"
                      placeholder="E.g. Elon Musk"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full bg-slate-50 border-none p-5 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all"
                      placeholder="elon@mars.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                    Project Type
                  </label>
                  <select className="w-full bg-slate-50 border-none p-5 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all appearance-none">
                    <option>SaaS Development</option>
                    <option>AI / Machine Learning</option>
                    <option>Legacy Modernization</option>
                    <option>Team Augmentation</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                    Project Details
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-slate-50 border-none p-5 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all"
                    placeholder="Tell us about your technical challenges..."
                  />
                </div>
                <button className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 hover:-translate-y-1 shadow-xl transition-all">
                  Sync Your Vision
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-12 mb-24">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <Cpu className="text-indigo-500 w-8 h-8" />
                <span className="text-3xl font-black text-white">IQ SYNC</span>
              </div>
              <p className="text-slate-400 text-lg mb-8 max-w-sm">
                Next-generation software engineering for the modern enterprise.
                We synchronize human creativity with machine precision.
              </p>
              <div className="flex space-x-4">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white hover:bg-indigo-600 transition-all"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h6 className="text-white font-black mb-8 uppercase tracking-widest text-sm">
                Services
              </h6>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Web Development
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mobile Engineering
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cloud Infra
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    UI/UX Design
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h6 className="text-white font-black mb-8 uppercase tracking-widest text-sm">
                Company
              </h6>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Media Kit
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Open Source
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h6 className="text-white font-black mb-8 uppercase tracking-widest text-sm">
                Resources
              </h6>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Developer Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Whitepapers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h6 className="text-white font-black mb-8 uppercase tracking-widest text-sm">
                Legal
              </h6>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-800 flex flex-col md:row justify-between items-center text-slate-500 text-sm">
            <p>© 2026 IQ Sync Global Engineering. All rights reserved.</p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <span className="flex items-center">
                <Lock size={14} className="mr-2" /> SSL Encrypted
              </span>
              <span className="flex items-center hover:text-white cursor-pointer">
                <ExternalLink size={14} className="mr-2" /> System Status
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const ArrowUpRight = ({ className, size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);
