import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, TrendingUp, Search, CheckCircle2, Shield, Briefcase, LayoutDashboard, Sparkles } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const LandingPage = () => {
  const { user } = useUser();
  const role = user?.unsafeMetadata?.role;

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-50px" },
    transition: { staggerChildren: 0.15 }
  };

  return (
    <main className="flex flex-col gap-24 sm:gap-32 pb-20 sm:pb-32 overflow-hidden">
      
      {/* 1. CLEAN HERO (NO IMAGE) */}
      <motion.section 
        className="relative flex flex-col items-center justify-center text-center pt-24 sm:pt-36 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-sm sm:text-base text-blue-400 font-medium tracking-wide uppercase mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI-Powered Job Search Assistant
        </p>

        <h1 className="text-center font-display text-[var(--text-primary)] mb-6 max-w-4xl mx-auto">
          <span className="block font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] tracking-tight leading-[1.15] mb-2 text-[var(--text-primary)]">
            Find The Right{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text">
              Opportunity
            </span>
          </span>
        </h1>

        <p className="mt-4 text-[var(--text-secondary)] text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed px-4">
          An AI-powered job search assistant that parses resumes, matches candidates to live job listings, and tracks applications end-to-end.
        </p>

        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex justify-center gap-4 flex-wrap w-full px-4">
            <Link to="/jobs" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 sm:px-8 py-6 rounded-xl shadow-sm transition-transform hover:scale-[1.02] border-0"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Find your next role
              </Button>
            </Link>

          </div>
        </div>
      </motion.section>

      {/* TRUSTED BY (Integrated subtly below hero) */}
      <motion.section {...fadeInUp} className="px-4">
        <p className="text-center text-gray-500 text-xs sm:text-sm mb-10 uppercase tracking-wider font-semibold">
          Trusted by leading companies
        </p>
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="flex gap-8 sm:gap-12 lg:gap-16 items-center">
            {companies.map(({ name, id, path }) => (
              <CarouselItem key={id} className="basis-1/2 sm:basis-1/3 lg:basis-1/6">
                <img
                  src={path}
                  alt={name}
                  className="h-6 sm:h-8 lg:h-10 object-contain mx-auto opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-110 drop-shadow-sm"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </motion.section>



      {/* 3. STATS SECTION */}
      <motion.section {...fadeInUp} className="max-w-5xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-20 border-y border-[var(--border-color)]">
          <div className="text-center p-5">
            <h3 className="text-5xl sm:text-6xl font-black text-[var(--text-primary)] mb-2 font-display">120+</h3>
            <p className="text-[var(--text-secondary)] font-medium text-lg tracking-wide uppercase">Jobs</p>
          </div>
          <div className="text-center p-5">
            <h3 className="text-5xl sm:text-6xl font-black text-[var(--text-primary)] mb-2 font-display">45+</h3>
            <p className="text-[var(--text-secondary)] font-medium text-lg tracking-wide uppercase">Companies</p>
          </div>
          <div className="text-center p-5">
            <h3 className="text-5xl sm:text-6xl font-black text-[var(--text-primary)] mb-2 font-display">300+</h3>
            <p className="text-[var(--text-secondary)] font-medium text-lg tracking-wide uppercase">Applications</p>
          </div>
        </div>
      </motion.section>

      {/* 4. FEATURES (SaaS Feel) */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 mt-24"
      >
        <motion.div variants={fadeInUp} className="p-8 rounded-2xl border border-[var(--border-color)] bg-[#0B0F14]/40 hover:bg-[#0B0F14]/80 transition-all duration-300 shadow-sm hover:scale-[1.02] hover:shadow-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 flex items-center justify-center border border-blue-500/20 transition-all">
              <Search className="w-7 h-7 text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Real-time Filters</span>
          </div>
          <h3 className="font-bold text-2xl mb-3 text-[var(--text-primary)]">Smart Job Search</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed text-lg">Search jobs by title, filter by location and company, and discover opportunities tailored to your preferences in real-time.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="p-8 rounded-2xl border border-[var(--border-color)] bg-[#0B0F14]/40 hover:bg-[#0B0F14]/80 transition-all duration-300 shadow-sm hover:scale-[1.02] hover:shadow-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 flex items-center justify-center border border-cyan-500/20 transition-all">
              <Zap className="w-7 h-7 text-cyan-400" />
            </div>
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">1-Click Apply</span>
          </div>
          <h3 className="font-bold text-2xl mb-3 text-[var(--text-primary)]">Easy Apply</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed text-lg">Apply to jobs in seconds with a streamlined application flow and manage your saved opportunities effortlessly.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="p-8 rounded-2xl border border-[var(--border-color)] bg-[#0B0F14]/40 hover:bg-[#0B0F14]/80 transition-all duration-300 shadow-sm hover:scale-[1.02] hover:shadow-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 flex items-center justify-center border border-purple-500/20 transition-all">
              <LayoutDashboard className="w-7 h-7 text-purple-400" />
            </div>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">Full Control</span>
          </div>
          <h3 className="font-bold text-2xl mb-3 text-[var(--text-primary)]">Application Tracking</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed text-lg">Log application statuses, review match metrics, and track your interviews and offers in one organized candidate dashboard.</p>
        </motion.div>
      </motion.section>

      {/* 5. HOW IT WORKS (Horizontal Steps) */}
      <motion.section {...fadeInUp} className="max-w-6xl mx-auto px-4 w-full mt-24">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-[var(--text-primary)] font-display tracking-tight">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent -z-10" />
          
          <motion.div variants={fadeInUp} className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-[#0B0F14] border border-[var(--border-color)] shadow-xl mb-6 relative z-10 transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[var(--text-primary)] font-bold text-[#0B0F14] flex items-center justify-center text-sm shadow-lg">1</span>
              <Search className="w-8 h-8 text-[var(--text-primary)]" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">Upload Resume</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed max-w-sm text-lg">Upload your resume to extract key details, build your candidate profile, and score your profile completeness.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-[#0B0F14] border border-[var(--border-color)] shadow-xl mb-6 relative z-10 transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[var(--text-primary)] font-bold text-[#0B0F14] flex items-center justify-center text-sm shadow-lg">2</span>
              <Shield className="w-8 h-8 text-[var(--text-primary)]" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">AI Match Scores</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed max-w-sm text-lg">Receive live JSearch listings ranked by Gemini AI matching scores, complete with explanations of why you fit the role.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-blue-500 border border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] mb-6 relative z-10 transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]">
              <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white font-bold text-blue-600 flex items-center justify-center text-sm shadow-lg shadow-blue-500/20">3</span>
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">Apply & Track</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed max-w-sm text-lg">Apply to external postings with redirect links, and track your application status from applied to selected.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ (Refined Minimal Style) */}
      <motion.section {...fadeInUp} className="max-w-3xl mx-auto w-full px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[var(--text-primary)] tracking-tight">
          Frequently asked
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-12 text-sm sm:text-lg">
          Everything you need to know about our platform.
        </p>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
              className="px-6 py-2 rounded-2xl border border-[var(--border-color)] bg-[#0B0F14]/30"
            >
              <AccordionTrigger className="text-[var(--text-primary)] hover:text-blue-400 text-left text-base sm:text-lg font-semibold border-0 !no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed pt-2 pb-6 border-0">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.section>

      {/* 6. FINAL CTA */}
      <motion.section 
        {...fadeInUp} 
        className="text-center max-w-4xl mx-auto px-4 mt-8 bg-gradient-to-b from-transparent to-blue-900/10 rounded-3xl py-16 sm:py-24 border border-[var(--border-color)]/50"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-[var(--text-primary)] tracking-tight">
          Ready to get started?
        </h2>
        <p className="text-[var(--text-secondary)] mb-10 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
          Join thousands of modern professionals finding their next big break.
        </p>
        <Link to="/jobs">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-7 rounded-xl shadow-sm text-lg transition-transform hover:scale-[1.02] border-0">
            Find your next role
          </Button>
        </Link>
      </motion.section>

    </main>
  );
};

export default LandingPage;