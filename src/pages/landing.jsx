import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Sparkles, Zap, Shield, TrendingUp } from "lucide-react";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-20 sm:gap-28 py-10 sm:py-20">
      {/* HERO SECTION - Modern & Premium */}
      <section className="text-center hero-fade max-w-5xl mx-auto px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300">Discover jobs. Hire talent.</span>
        </div>

        <h1 className="text-center font-display text-white mb-6">
          {/* Line 1 */}
          <span className="block font-black text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[1.1] mb-2">
            Find The Right{" "}
            <span className="gradient-text-animated block sm:inline mt-2 sm:mt-0">Opportunity</span>
          </span>

          {/* Line 2 */}
          <span className="inline-flex items-center justify-center gap-2 sm:gap-3 flex-wrap mt-4">
            <span className="font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-gray-100">
              and get
            </span>

            <img
              src="/hired.png"
              alt="hired"
              className="h-10 sm:h-16 lg:h-20 xl:h-24 drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]"
              style={{ marginLeft: '-0.25rem' }}
            />
          </span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed px-4">
          Streamlining job discovery and talent acquisition with intuitive tools
           and seamless workflows
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap px-4">
          <Link to="/jobs">
            <Button
              size="lg"
              className="gradient-button text-white font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl shadow-lg"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Browse Jobs
            </Button>
          </Link>
          <Link to="/post-job">
            <Button
              size="lg"
              variant="outline"
              className="glass-card text-white font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl border-purple-500/30 hover:border-purple-500/50 shadow-lg"
            >
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Post a Job
            </Button>
          </Link>
        </div>
      </section>

      {/* TRUSTED BY SECTION */}
      <section className="stagger-fade px-4">
        <p className="text-center text-gray-500 text-xs sm:text-sm mb-10 uppercase tracking-wider font-medium">
          Trusted by leading companies
        </p>
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="flex gap-8 sm:gap-12 lg:gap-16 items-center">
            {companies.map(({ name, id, path }) => (
              <CarouselItem key={id} className="basis-1/2 sm:basis-1/3 lg:basis-1/6">
                <img
                  src={path}
                  alt={name}
                  className="h-6 sm:h-10 lg:h-12 object-contain opacity-60 grayscale-0 transition-all duration-300"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* BANNER IMAGE with modern treatment */}
      <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden glass-card p-1 mx-4">
        <img
          src="/banner.jpeg"
          alt="Platform showcase"
          className="w-full rounded-xl sm:rounded-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0118] via-transparent to-transparent pointer-events-none rounded-xl sm:rounded-2xl" />
      </section>

      {/* FEATURES SECTION - Modern Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        <div className="glass-card p-6 sm:p-8 rounded-2xl group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="font-bold text-xl sm:text-2xl mb-4 text-white">
            For Candidates
          </CardTitle>
          <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
            Discover relevant opportunities with AI-powered matching, apply
            seamlessly with one click, and track your progress in a unified
            dashboard
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-2xl group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="font-bold text-xl sm:text-2xl mb-4 text-white">
            For Employers
          </CardTitle>
          <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
            Post openings in seconds, manage applicants with powerful filters,
            and hire top talent faster with our streamlined recruitment tools
          </p>
        </div>
      </section>

      {/* FAQ SECTION - Modern Accordion */}
      <section className="max-w-3xl mx-auto w-full px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-400 mb-12 text-sm sm:text-base">
          Everything you need to know about our platform
        </p>

        <Accordion type="multiple" className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
              className="glass-card px-6 rounded-xl border-0"
            >
              <AccordionTrigger className="text-white hover:text-purple-400 text-left text-sm sm:text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm sm:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
};

export default LandingPage;