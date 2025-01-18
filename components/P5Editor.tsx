import { useState, useEffect } from 'react';

const P5Editor = ({ initialCode, onSaveCode }) => {
  const [code, setCode] = useState(initialCode || '');

  // Update the code state when initialCode changes
  useEffect(() => {
    setCode(initialCode || '');
  }, [initialCode]);

  const handleSaveFile = async () => {
    if (onSaveCode && typeof onSaveCode === 'function') {
      try {
        await onSaveCode(code); // Pass the updated code to the parent component
        alert('File saved successfully!');
      } catch (err) {
        console.error('Error saving file:', err);
        alert('Failed to save file.');
      }
    } else {
      console.error('onSaveCode is not a function or is undefined');
    }
  };

  return (
    <div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-96 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleSaveFile}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save File
      </button>
    </div>
  );
};

export default P5Editor;