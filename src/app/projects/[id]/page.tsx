'use client'; // Mark this as a Client Component

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { projects } from '@/data/projects'; // Import the projects data

const ProjectPage = () => {
  const params = useParams();
  const id = params.id as string; // Extract the `id` from the URL

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState<'visualization' | 'code'>('visualization');

  // Find the project by ID
  const project = projects.find((p) => p.id === parseInt(id));

  if (!project) {
    return <div className="text-center mt-10">Project not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1 className="text-3xl font-bold text-center mb-8">{project.title}</h1>

      {/* Split layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column: Embedded project */}
        <div className="flex-1">
          <div className="sticky top-4">
            <iframe
              src={project.glitchUrl}
              width="100%"
              height="600"
              style={{ border: 'none' }}
              title="p5.js Sketch"
              allow="accelerometer; gyroscope"
            ></iframe>
          </div>
        </div>

        {/* Right column: Project details and tabs */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('visualization')}
              className={`px-4 py-2 rounded ${
                activeTab === 'visualization'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Visualization
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded ${
                activeTab === 'code'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Code
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'visualization' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">About the Project</h2>
              <p className="text-lg text-gray-700">{project.description}</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4">Code</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                <code>{project.code}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;