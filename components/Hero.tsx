"use client";

import Image from "next/image";
import { Plus, Globe, BookOpen, Zap, Mic } from "lucide-react";

const Hero = () => {
  const steps = [
    {
      number: 1,
      title: "Upload PDF",
      description: "Add your book file"
    },
    {
      number: 2,
      title: "AI Processing",
      description: "We analyze the content"
    },
    {
      number: 3,
      title: "Voice Chat",
      description: "Discuss with AI"
    }
  ];

  return (
    <section className="w-full mb-10 md:mb-16">
      <div className="wrapper">
        <div className="bg-amber-100 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Left Section */}
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 font-serif">
                Your Library
              </h2>
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                Convert your books into interactive AI conversations. Listen, learn, and discuss your favorite reads.
              </p>
              <button className="w-fit flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 max-md:w-full max-md:justify-center">
                <Plus size={20} />
                Add new book
              </button>
            </div>

            {/* Center Section - Illustration */}
            <div className="flex justify-center items-center py-8 md:py-0 max-md:hidden">
              <Image
                src="/assets/hero-illustration.png"
                alt="Hero Illustration"
                width={400}
                height={300}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Right Section - Steps Card */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-beige-100 bg-beige-100 text-black font-bold text-sm hover:bg-beige-200 transition-colors duration-200">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </section>
  );
};

export default Hero;
