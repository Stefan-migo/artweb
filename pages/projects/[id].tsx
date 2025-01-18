import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import P5Wrapper from '@/components/P5Wrapper';
import P5Editor from '@/components/P5Editor';

const ProjectPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [activeTab, setActiveTab] = useState('visual');
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Toggle sidebar visibility

  // Fetch project and files
  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchProject = async () => {
      try {
        // Fetch project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (projectError) throw projectError;

        // Fetch files
        const { data: filesData, error: filesError } = await supabase
          .from('project_files')
          .select('*')
          .eq('project_id', id);

        if (filesError) throw filesError;

        setProject(projectData);
        setFiles(filesData);
        setActiveFile(filesData.find((file) => file.file_name === 'sketch.js') || filesData[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, router.isReady]);

  // Handle file creation
  const handleCreateFile = async () => {
    const fileName = prompt('Enter a name for the new file:');
    if (!fileName) return;

    try {
      const { data, error } = await supabase
        .from('project_files')
        .insert([
          {
            project_id: id,
            file_name: fileName,
            file_type: 'text/plain', // Default type for new files
            file_content: '',
          },
        ]);

      if (error) throw error;

      setFiles([...files, data[0]]);
      setActiveFile(data[0]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle file upload
  const handleUploadFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Upload binary files to Supabase Storage
      if (file.type.startsWith('image/') || file.type === 'text/csv') {
        const { data, error } = await supabase.storage
          .from('project_files')
          .upload(`${id}/${file.name}`, file);

        if (error) throw error;

        // Save file metadata to project_files table
        const { data: fileData, error: fileError } = await supabase
          .from('project_files')
          .insert([
            {
              project_id: id,
              file_name: file.name,
              file_type: file.type,
              file_url: data.Key,
            },
          ]);

        if (fileError) throw fileError;

        setFiles([...files, fileData[0]]);
      } else {
        // Save text-based files to project_files table
        const reader = new FileReader();
        reader.onload = async (e) => {
          const fileContent = e.target.result;

          const { data, error } = await supabase
            .from('project_files')
            .insert([
              {
                project_id: id,
                file_name: file.name,
                file_type: file.type,
                file_content: fileContent,
              },
            ]);

          if (error) throw error;

          setFiles([...files, data[0]]);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const { error } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      // Remove the deleted file from the list
      setFiles(files.filter((file) => file.id !== fileId));

      // If the active file is deleted, reset the active file
      if (activeFile?.id === fileId) {
        setActiveFile(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const initSketch = () => {
    const p5Wrapper = document.getElementById('p5-wrapper');
    if (p5Wrapper) {
      p5Wrapper.innerHTML = ''; // Clear the canvas
    }
    // Reinitialize the sketch (you may need to pass the updated code here)
    // For example, if you have a ref or state for the P5Wrapper, trigger a re-render.
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10">Error: {error}</div>;
  if (!project) return <div className="text-center mt-10">Project not found.</div>;

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1 className="text-3xl font-bold text-center mb-8">{project.title}</h1>

      <div className="flex">
        {/* Sidebar for files */}
        {isSidebarVisible && (
          <div className="w-1/4 p-4 border-r">
            <h2 className="text-xl font-bold mb-4">Project Files</h2>

            {/* Restart Sketch Button */}
            {activeFile?.file_name === 'sketch.js' && (
              <button
                onClick={() => {
                  const p5Wrapper = document.getElementById('p5-wrapper');
                  if (p5Wrapper) {
                    p5Wrapper.innerHTML = ''; // Clear the canvas
                  }
                  initSketch(); // Reinitialize the sketch
                }}
                className="w-full mb-4 px-4 py-2 bg-green-500 text-white rounded"
              >
                Restart Sketch
              </button>
            )}

            {/* Create New File Button */}
            <button
              onClick={handleCreateFile}
              className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Create New File
            </button>

            {/* Upload File Button */}
            <input
              type="file"
              onChange={handleUploadFile}
              className="w-full mb-4"
            />

            {/* Files List */}
            <ul>
              {files.map((file) => (
                <li
                  key={file.id}
                  onClick={() => setActiveFile(file)}
                  className={`p-2 cursor-pointer ${activeFile?.id === file.id ? 'bg-gray-200' : ''
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{file.file_name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent file selection
                        handleDeleteFile(file.id);
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-4 rounded-r-lg z-50"
        >
          {isSidebarVisible ? '◄' : '►'}
        </button>

        {/* Main content */}
        <div className={`flex-1 p-4 ${isSidebarVisible ? 'ml-1/4' : ''}`}>
          {/* Tab Navigation */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-4 py-2 rounded ${activeTab === 'visual'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-700'
                }`}
            >
              Visual
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded ${activeTab === 'code'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-700'
                }`}
            >
              Code
            </button>
          </div>

          {activeTab === 'visual' && (
            <div>
              {activeFile?.file_name === 'sketch.js' && (
                <P5Wrapper code={activeFile.file_content} id="p5-wrapper" />
              )}
            </div>
          )}

          {/* Code Tab */}
          {activeTab === 'code' && activeFile && (
            <P5Editor
              initialCode={activeFile.file_content}
              onSaveCode={async (updatedCode) => {
                const { data, error } = await supabase
                  .from('project_files')
                  .update({ file_content: updatedCode })
                  .eq('id', activeFile.id);

                if (error) throw error;

                setFiles(
                  files.map((file) =>
                    file.id === activeFile.id
                      ? { ...file, file_content: updatedCode }
                      : file
                  )
                );
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;