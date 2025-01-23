import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  glitchUrl: string;
  gridArea: string; // Use gridArea to define the layout
}

interface BentoGridProps {
  projects: Project[];
}

const BentoGrid = ({ projects }: BentoGridProps) => {
  if (!projects || projects.length === 0) {
    return <div>No projects to display.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Grid container with explicit row and column definitions */}
      <div 
        className="grid gap-2"
        style={{
          // gridTemplateRows: 'repeat(4, minmax(60px, 1fr))', // Reduced row height to 60px
          gridTemplateColumns: 'repeat(4, 1fr)', // Keep column width at 100px
          maxWidth: '1200px', // Keep max width of the grid
          width: '100%', // Take up full width of the container
          margin: '0 auto', // Center the grid horizontally
        }}
      >
        {projects.map((project) => (
          <Link
            key={project.id}
            href={{
              pathname: `/projects/${project.id}`,
              query: { glitchUrl: project.glitchUrl },
            }}
            className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ gridArea: project.gridArea }} // Apply gridArea style
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
              <h2 className="text-sm font-bold text-white mb-1">{project.title}</h2>
              <p className="text-gray-300 text-xs">{project.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BentoGrid;