import Blogs from "@/components/sections/Blogs";
import HeroSection from "@/components/sections/HeroSection";
import Properties from "@/components/sections/Properties";
import CitiesPage from "./cities/page";


export default function Home() {
  return (
    <div>
      <HeroSection />
      <CitiesPage/>
      <Properties/>
      <Blogs/>
    </div>
  );
}
