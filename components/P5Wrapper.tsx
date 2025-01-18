import { useEffect, useRef } from 'react';

const P5Wrapper = ({ code, id }) => {
  const canvasParentRef = useRef(null);
  const p5InstanceRef = useRef(null);

  // Initialize or reinitialize the p5.js sketch
  const initSketch = async () => {
    if (typeof window === 'undefined') return;

    // Remove the existing p5 instance if it exists
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }

    const p5 = (await import('p5')).default;

    const sketch = (p5) => {
      p5.setup = () => {
        const canvasWidth = canvasParentRef.current.clientWidth;
        const canvasHeight = 600; // Fixed height for the canvas
        p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef.current);
        p5.background(220);

        try {
          // Remove the `export default` statement from the code
          const cleanedCode = code.replace(/export\s+default\s+/g, '');
          // Pass the p5 instance to the sketch code
          const sketchCode = `
            (function(p5) {
              ${cleanedCode}
            })(p5);
          `;
          eval(sketchCode); // Execute the fetched code
        } catch (err) {
          console.error('Error executing sketch:', err);
        }
      };

      p5.windowResized = () => {
        const canvasWidth = canvasParentRef.current.clientWidth;
        const canvasHeight = 600; // Fixed height for the canvas
        p5.resizeCanvas(canvasWidth, canvasHeight);
        p5.background(220); // Redraw the background after resizing
      };
    };

    // Create a new p5 instance and store it in the ref
    p5InstanceRef.current = new p5(sketch);
  };

  // Initialize the sketch when the component mounts or the code changes
  useEffect(() => {
    initSketch();

    // Cleanup function to remove the p5 instance when the component unmounts
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [code]);

  return (
    <div>
      <div
        ref={canvasParentRef}
        id={id} // Use the passed `id` prop
        style={{ height: '600px', border: '2px solid red' }} // Fixed height
      ></div>
    </div>
  );
};

export default P5Wrapper;