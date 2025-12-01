import ArticlesSection from "@/components/sections/ArticlesSection";
import CitiesSection from "@/components/sections/CitiesSection";
import HeroSection from "@/components/sections/HeroSection";


export default function Home() {
  return (
    <div>
      <HeroSection />
      <CitiesSection/>
      <ArticlesSection/>
    </div>
  );
}