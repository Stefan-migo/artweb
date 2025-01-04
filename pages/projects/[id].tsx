import { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { supabase } from '../../lib/supabaseClient';

const Sketch = dynamic(() => import('react-p5'), { ssr: false });

const ProjectPage = ({ project }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('visual');

  if (router.isFallback) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!project) {
    return <div className="text-center mt-10">Project not found.</div>;
  }

  // Convert the sketch code strings into functions
  const sketchFunctions = project.sketch
    ? {
        setup: new Function('p5', project.sketch.setup),
        draw: new Function('p5', project.sketch.draw),
      }
    : null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">{project.title}</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('visual')}
          className={`px-4 py-2 rounded ${
            activeTab === 'visual'
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Visual
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

      {/* Tab Content */}
      {activeTab === 'visual' && (
        <div className="flex justify-center">
          {sketchFunctions ? (
            <div className="w-full max-w-[500px]">
              <Sketch setup={sketchFunctions.setup} draw={sketchFunctions.draw} />
            </div>
          ) : (
            <div className="text-center text-gray-700">
              No visual component available for this project.
            </div>
          )}
        </div>
      )}

      {activeTab === 'code' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Code</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            <code>{project.code}</code>
          </pre>
        </div>
      )}

      {/* Project Details */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p className="text-gray-700 mb-6">{project.description}</p>
        <h2 className="text-2xl font-bold mb-4">Details</h2>
        <p className="text-gray-700 mb-6">{project.details}</p>
      </div>
    </div>
  );
};

export async function getStaticProps({ params }) {
  console.log('Fetching project with ID:', params.id); // Debugging
  console.log('Type of id:', typeof params.id); // Debugging

  // Convert id to a number
  const projectId = Number(params.id);
  console.log('Converted projectId:', projectId); // Debugging

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId) // Use the number id
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return {
      notFound: true,
    };
  }

  if (!project) {
    console.error('Project not found');
    return {
      notFound: true,
    };
  }

  console.log('Fetched project:', project); // Debugging

  return {
    props: {
      project,
    },
    revalidate: 60, // Revalidate the page every 60 seconds
  };
}

export async function getStaticPaths() {
  const { data: projects, error } = await supabase.from('projects').select('id');

  if (error) {
    console.error('Error fetching project IDs:', error);
    return {
      paths: [],
      fallback: true,
    };
  }

  console.log('Fetched project IDs:', projects); // Debugging

  const paths = projects.map((project) => ({
    params: { id: project.id.toString() }, // Convert id to string for the URL
  }));

  console.log('Generated paths:', paths); // Debugging

  return {
    paths,
    fallback: true,
  };
}

export default ProjectPage;