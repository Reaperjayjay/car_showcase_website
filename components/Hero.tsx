"use client";
import Image from "next/image";
import CustomButton from "./CustomButton";
import { useState, useEffect } from "react";

const heroImages = [
  "/hero.png",
  "/hero-2.png",
  "/hero-3.png",
  "/hero-4.png",
  "/hero-5.png",
  "/hero-6.png",
  "/hero-7.png",
];
const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  // Infinite loop interval (changes every 4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const handleScroll = () => {
    const nextSection = document.getElementById("discover");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero relative">
      {/* PAGE-WIDE BLEED EFFECT */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[70vh] rounded-full bg-primary-blue opacity-20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="flex-1 pt-36 padding-x relative z-10">
        <h1 className="hero__title">
          Find, book, or rent your dream car—quick and easy!
        </h1>
        <p className="hero__subtitle">
          Streamline your car rental experience with our easy-to-use platform.
        </p>
        <CustomButton
          title="Get Started"
          containerStyles="bg-primary-blue text-white rounded-full mt-10"
          handleClick={handleScroll}
        />
      </div>
      <div className="hero__image-container">
        <div className="hero__image relative z-20">
          {heroImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`hero car ${index + 1}`}
              fill
              priority={index === 0} // Loads the very first image instantly
              className={`object-contain transition-opacity duration-1000 ease-in-out absolute inset-0 ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="hero__image-overlay -z-0" />
      </div>
    </div>
  );
};

export default Hero;
