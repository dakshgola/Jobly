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

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className=" text-center hero-fade">

 <h1 className="text-center font-display text-white">
  {/* Line 1 */}
  <span
    className="
      block
      font-black
      text-4xl sm:text-6xl lg:text-8xl
      tracking-[-0.015em]
      sm:tracking-[-0.02em]
      lg:tracking-[-0.03em]
    "
  >
    Find The Right Opportunity
  </span>

  {/* Line 2 */}
  <span className="mt-2 sm:mt-3 inline-flex items-center justify-center">
    <span
      className="
        font-black
        text-3xl sm:text-5xl lg:text-6xl
        tracking-[-0.01em]
        sm:tracking-[-0.015em]
        lg:tracking-[-0.02em]
      "
    >
      and get
    </span>

    <img
      src="/hired.png"
      alt="hired"
      className="
        h-12 sm:h-20 lg:h-28
        -ml-2
        translate-y-[6px]
        drop-shadow-[0_10px_30px_rgba(168,85,247,0.45)]
      "
    />
  </span>
</h1>



        <p className="font-manrope font-medium text-gray-300 sm:mt-4 text-xs sm:text-xl">
          Streamlining job discovery and talent acquisition
        </p>
      </section>

      <div className="flex gap-6 justify-center">
        <Link to={"/jobs"}>
          <Button variant="blue" size="xl">
            Browse Jobs
          </Button>
        </Link>
        <Link to={"/post-job"}>
          <Button variant="destructive" size="xl">
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Carousel companies section */}
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full py-10"
      >
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
              <img
                src={path}
                alt={name}
                className="h-9 sm:h-14 object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Banner image */}
      <img src="/banner.jpeg" className="w-full" />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            Discover relevant opportunities, apply seamlessly, and track your
            progress in one place
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post openings, manage applicants, and hire top talent faster
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <Accordion type="multiple" className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;
