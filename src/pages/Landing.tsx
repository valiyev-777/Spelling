// src/pages/Landing.tsx

import CTASection from "../components/CTASection";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";

import PreviewSection from "../components/PreviewSection";
import ProblemSection from "../components/ProblemSection";

const Landing = () => {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <PreviewSection />
      <CTASection />
      <Footer />
    </>
  );
};

export default Landing;
