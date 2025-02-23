"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCards } from "@/components/ui/animated-cards";
import { useRef } from "react";
import { features, products } from "@/lib/constants";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { useScroll, useTransform } from "motion/react";
import { GoogleGeminiEffect } from "../components/ui/google-gemini-effect";
import Link from "next/link";

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="mb-20">
        <HeroParallax
          products={products}
          title="Your Portfolio, Smarter Than Ever!"
          description="Say goodbye to tedious portfolio building! Our AI-powered tool crafts a sleek, responsive, and professional portfolio tailored just for you."
        />
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <BackgroundBeams />
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-12">
            Features that make us special
          </h2>
          <div className="w-full pt-10">
            <AnimatedCards items={features} />
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="container mx-auto relative z-10">
          <div
            className="h-[500vh] bg-black w-full rounded-md relative overflow-clip -translate-y-32"
            ref={ref}
          >
            <GoogleGeminiEffect
              pathLengths={[
                pathLengthFirst,
                pathLengthSecond,
                pathLengthThird,
                pathLengthFourth,
                pathLengthFifth,
              ]}
              title="Just Upload Your Resume, AI Does the Rest!"
              description="Get Beautiful Websites Written by AI For Free"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already transformed their
            online presence with our AI-powered portfolio builder.
          </p>
          <Link href="/build">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              <Upload className="mr-2 h-4 w-4" />
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
