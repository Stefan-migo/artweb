const AboutMe = () => {
    return (
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">About Me</h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg text-gray-700 mb-4">
              Hi, I’m [Your Name], a generative artist exploring the intersection of code, art, and technology. My work is driven by a fascination with algorithms, randomness, and the beauty of emergent patterns.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Using tools like p5.js, Max8, and Sonic Pi, I create interactive and dynamic art pieces that challenge traditional notions of creativity. Each project is a unique exploration of form, color, and sound.
            </p>
            <p className="text-lg text-gray-700">
              When I’m not coding, you can find me experimenting with new frameworks, collaborating with other artists, or exploring the outdoors for inspiration.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutMe;