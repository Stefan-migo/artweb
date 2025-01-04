import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const Sketch = dynamic(() => import('react-p5'), { ssr: false });

const P5Wrapper = ({ sketchCode }) => {
  const sketchRef = useRef(null);

  useEffect(() => {
    if (sketchCode) {
      try {
        const sketchFunctions = new Function('p5', sketchCode);
        sketchRef.current = sketchFunctions;
      } catch (error) {
        console.error('Error evaluating sketch code:', error);
      }
    }
  }, [sketchCode]);

  return (
    <div className="w-full max-w-[500px]">
      {sketchRef.current && <Sketch setup={(p5) => sketchRef.current(p5)} />}
    </div>
  );
};

export default P5Wrapper;