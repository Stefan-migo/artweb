import { useState } from 'react';
import { useRouter } from 'next/router';
import { createNewProject } from '@/lib/projectUtils';

const NewProjectPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const title = e.target.title.value;
      const description = e.target.description.value;

      const project = await createNewProject(title, description);
      console.log('Project created:', project);

      // Redirect to the new project page
      router.push(`/projects/${project.id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>

      <form onSubmit={handleCreateProject} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default NewProjectPage;