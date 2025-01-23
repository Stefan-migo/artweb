import HeroAnimation from '@/components/HeroAnimation';
import AboutMe from '@/components/AboutMe';
import BentoGrid from '@/components/BentoGrid';
import { projects } from '@/data/projects'; // Import the projects data

export default function Home() {
  return (
    <div>
      <HeroAnimation />
      <AboutMe />
      <BentoGrid projects={projects} /> {/* Pass the projects data */}
    </div>
  );
}