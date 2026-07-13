import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Search, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle,
  Cpu,
  Layers,
  LineChart
} from "lucide-react";
import { motion } from "framer-motion";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  // Animation variants for smooth, premium transitions
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.15 }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 pb-24 overflow-hidden relative selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Decorative ambient radial blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full bg-violet-900/15 blur-[130px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <motion.section 
        className="relative flex flex-col items-center justify-center text-center pt-20 sm:pt-32 px-4 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-xs sm:text-sm shadow-xl backdrop-blur-md mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold tracking-wide">AI-Powered Resume Parsing & Matching</span>
        </div>

        {/* Headline */}
        <h1 className="text-center font-display mb-6 tracking-tight">
          <span className="block font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.08] text-white">
            Skip the boards.
          </span>
          <span className="block font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 text-transparent bg-clip-text">
            Let AI find your next role.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          Upload your resume for automated profile extraction. Instantly match against live JSearch listings with transparent, explainable fit reasoning.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md px-4 mb-20">
          <Link to="/my-jobs" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#030712] font-bold px-8 py-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] border-0"
            >
              <FileText className="w-5 h-5 mr-2" />
              Upload Resume
            </Button>
          </Link>
          <Link to="/jobs" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full glass-card text-white hover:bg-slate-900 border border-slate-800 px-8 py-6 rounded-xl transition-all hover:scale-[1.02]"
            >
              Explore Live Jobs
              <ArrowRight className="w-5 h-5 ml-2 text-slate-400" />
            </Button>
          </Link>
        </div>

        {/* HERO INTERACTIVE VISUAL */}
        <motion.div 
          className="w-full max-w-4xl rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-slate-700/60 transition-colors duration-300"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Card subtle backlights */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-colors duration-300" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/15 transition-colors duration-300" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
            
            {/* Left Mock Panel: Resume Parsing */}
            <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/60 pb-6 lg:pb-0 lg:pr-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">resume_alex_dev.pdf</h4>
                    <p className="text-xs text-slate-500">Parsed by Gemini AI</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-400">
                      <span>Profile Completeness</span>
                      <span className="text-emerald-400">95%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full" style={{ width: "95%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Extracted Profile</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium">React</span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium">TypeScript</span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium">TailwindCSS</span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium">Node.js</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-900/60 hidden lg:block">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Candidate Profile synced successfully.</span>
                </div>
              </div>
            </div>

            {/* Right Mock Panel: Match Explanations */}
            <div className="lg:col-span-7 flex flex-col justify-between pl-0 lg:pl-4">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Matched Position</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">Staff Frontend Engineer</h3>
                    <p className="text-sm text-slate-400">Seeq Corporation &bull; Washington, DC</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/5">
                      <span className="text-xl font-extrabold text-emerald-400 leading-none">94%</span>
                      <span className="text-[8px] text-emerald-500 font-bold uppercase mt-0.5">Match</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">AI Reasoning Breakdown</h4>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5 text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5 border border-emerald-500/20">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <p className="text-slate-300 text-sm flex-1 leading-normal">
                        Your **8+ years of React and TypeScript** matches Seeq's core stack requirements.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5 text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5 border border-emerald-500/20">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <p className="text-slate-300 text-sm flex-1 leading-normal">
                        Experience building analytical dashboards aligns with Seeq's industrial analytics products.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5 text-sm">
                      <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center mt-0.5 border border-amber-500/20">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                      </div>
                      <p className="text-slate-400 text-sm flex-1 leading-normal">
                        Seeq uses **Recoil** for global state; your resume lists **Redux/Zustand** (minor gap).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center justify-between text-xs text-slate-500">
                <span>Updated 2 minutes ago</span>
                <span className="text-indigo-400 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                  View Full Report <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.section>

      {/* 2. STATS SECTION */}
      <motion.section {...fadeInUp} className="max-w-5xl mx-auto px-4 w-full mt-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-12 border-y border-slate-800/60 bg-slate-950/10 rounded-2xl px-8">
          <div className="text-center p-5">
            <h3 className="text-4xl sm:text-5xl font-black text-white mb-2 font-display">10,000+</h3>
            <p className="text-slate-500 font-semibold text-xs tracking-wider uppercase">JSearch API Listings</p>
          </div>
          <div className="text-center p-5">
            <h3 className="text-4xl sm:text-5xl font-black text-white mb-2 font-display">100%</h3>
            <p className="text-slate-500 font-semibold text-xs tracking-wider uppercase">Explainable AI Scoring</p>
          </div>
          <div className="text-center p-5">
            <h3 className="text-4xl sm:text-5xl font-black text-white mb-2 font-display">0%</h3>
            <p className="text-slate-500 font-semibold text-xs tracking-wider uppercase">Recruiter Spam</p>
          </div>
        </div>
      </motion.section>

      {/* 3. CORE FEATURES */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-32"
      >
        <motion.div variants={fadeInUp} className="p-8 rounded-2xl border border-slate-800/80 bg-slate-950/20 hover:bg-slate-950/50 transition-all duration-300 shadow-sm hover:scale-[1.02] hover:shadow-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 transition-all">
              <Cpu className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Gemini Pro</span>
          </div>
          <h3 className="font-bold text-xl mb-3 text-white">AI Profile Extraction</h3>
          <p className="text-slate-400 leading-relaxed text-sm">Upload your PDF or Word resume. Our parser extracts experience, education, and skill blocks into structured candidate tables instantly.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="p-8 rounded-2xl border border-slate-800/80 bg-slate-950/20 hover:bg-slate-950/50 transition-all duration-300 shadow-sm hover:scale-[1.02] hover:shadow-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.08)] group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 transition-all">
              <LineChart className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Semantic Fit</span>
          </div>
          <h3 className="font-bold text-xl mb-3 text-white">Explainable Job Scores</h3>
          <p className="text-slate-400 leading-relaxed text-sm">Every live job listing receives a weighted percentage rating. Review detailed reasoning on stack alignment, location checks, and potential skill gaps.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="p-8 rounded-2xl border border-slate-800/80 bg-slate-950/20 hover:bg-slate-950/50 transition-all duration-300 shadow-sm hover:scale-[1.02] hover:shadow-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 transition-all">
              <Layers className="w-6 h-6 text-violet-400" />
            </div>
            <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">Cache Sync</span>
          </div>
          <h3 className="font-bold text-xl mb-3 text-white">Application Tracking</h3>
          <p className="text-slate-400 leading-relaxed text-sm">Save live JSearch listings. Log application states from interview invitation through selection without leaving your job seeker dashboard.</p>
        </motion.div>
      </motion.section>

      {/* 4. HOW IT WORKS (Sequential Numbered Steps Only) */}
      <motion.section {...fadeInUp} className="max-w-5xl mx-auto px-4 w-full mt-36">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A simple, three-step sequential workflow to automate your application matches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Desktop Connecting Line */}
          <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-slate-800 to-transparent -z-10" />
          
          <motion.div variants={fadeInUp} className="flex flex-col items-center text-center group">
            <div className="w-22 h-22 rounded-2xl flex items-center justify-center bg-slate-950 border border-slate-800 shadow-xl mb-6 relative z-10 transition-all duration-300 group-hover:scale-[1.03] group-hover:border-indigo-500/30 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-slate-100 font-bold text-slate-950 flex items-center justify-center text-xs shadow-lg">1</span>
              <FileText className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Upload Resume</h3>
            <p className="text-slate-400 leading-relaxed text-sm max-w-xs">
              Upload your resume (PDF/DOCX). Gemini AI extracts your work experience, skills, and education to build your candidate profile.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col items-center text-center group">
            <div className="w-22 h-22 rounded-2xl flex items-center justify-center bg-slate-950 border border-slate-800 shadow-xl mb-6 relative z-10 transition-all duration-300 group-hover:scale-[1.03] group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-slate-100 font-bold text-slate-950 flex items-center justify-center text-xs shadow-lg">2</span>
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">AI-Ranked Matches</h3>
            <p className="text-slate-400 leading-relaxed text-sm max-w-xs">
              JSearch crawls the web for live roles. We calculate a semantic match score and bullet-point fit reasons for every position.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col items-center text-center group">
            <div className="w-22 h-22 rounded-2xl flex items-center justify-center bg-slate-950 border border-slate-800 shadow-xl mb-6 relative z-10 transition-all duration-300 group-hover:scale-[1.03] group-hover:border-violet-500/30 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
              <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-slate-100 font-bold text-slate-950 flex items-center justify-center text-xs shadow-lg">3</span>
              <CheckCircle className="w-8 h-8 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Apply & Track</h3>
            <p className="text-slate-400 leading-relaxed text-sm max-w-xs">
              Apply via one-click redirect links and record application updates in real time to keep your search organized.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* 5. FAQ SECTION */}
      <motion.section {...fadeInUp} className="max-w-3xl mx-auto w-full px-4 mt-36">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400">
            Answers to common questions about Jobly's AI capabilities.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
              className="px-6 py-2 rounded-2xl border border-slate-800/80 bg-slate-950/20 backdrop-blur-md"
            >
              <AccordionTrigger className="text-slate-200 hover:text-emerald-400 text-left text-base sm:text-lg font-semibold border-0 !no-underline transition-colors duration-200">
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-5 h-5 text-slate-500" />
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 text-sm sm:text-base leading-relaxed pt-2 pb-6 border-0">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.section>

      {/* 6. FINAL CTA */}
      <motion.section 
        {...fadeInUp} 
        className="text-center max-w-5xl mx-auto px-4 mt-32 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-30 -z-10" />
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl py-16 sm:py-24 px-8 backdrop-blur-xl relative overflow-hidden">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white tracking-tight">
            Ready to find your match?
          </h2>
          <p className="text-slate-400 mb-10 text-base sm:text-lg max-w-xl mx-auto">
            Take control of your applications and leverage Google Gemini matching algorithms today.
          </p>
          <Link to="/my-jobs">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-[#030712] font-bold px-10 py-7 rounded-xl shadow-lg shadow-emerald-500/20 text-base transition-transform hover:scale-[1.02] border-0">
              Start by Uploading Resume
            </Button>
          </Link>
        </div>
      </motion.section>

    </main>
  );
};

export default LandingPage;