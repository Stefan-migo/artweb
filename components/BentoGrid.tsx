import Link from 'next/link';

const projects = [
  {
    id: 1,
    title: 'Project 1',
    description: 'A generative art piece created with p5.js.',
    image: '/project1.jpg', // Replace with your image path
    link: '/projects/1',
  },
  {
    id: 2,
    title: 'Project 2',
    description: 'An interactive sound art piece created with Sonic Pi.',
    image: '/project2.jpg', // Replace with your image path
    link: '/projects/2',
  },
  {
    id: 3,
    title: 'Project 3',
    description: 'A visual experiment using Max8.',
    image: '/project3.jpg', // Replace with your image path
    link: '/projects/3',
  },
  // Add more projects as needed
];

const BentoGrid = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h2 className="text-xl font-bold text-white">{project.title}</h2>
                <p className="text-gray-300">{project.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BentoGrid;