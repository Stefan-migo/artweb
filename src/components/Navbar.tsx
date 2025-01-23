import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-50 backdrop-blur-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-bold text-white">
          My Art Portfolio
        </Link>
        <div className="space-x-4">
          <Link href="/about" className="text-white hover:text-gray-300">
            About
          </Link>
          <Link href="/manifest" className="text-white hover:text-gray-300">
            Manifest
          </Link>
          <Link href="/sales" className="text-white hover:text-gray-300">
            Sales
          </Link>
          <Link href="/projects" className="text-white hover:text-gray-300">
            Projects
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;