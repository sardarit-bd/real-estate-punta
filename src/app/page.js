import ArticlesSection from "@/components/sections/ArticlesSection";
import CitiesSection from "@/components/sections/CitiesSection";
import HeroSection from "@/components/sections/HeroSection";
import Properties from "@/components/sections/Properties";


export default function Home() {
  return (
    <div>
      <HeroSection />
      <CitiesSection/>
      <Properties/>
    </div>
  );
}
