import { supabase } from './supabaseClient';

export const createNewProject = async (title: string, description: string) => {
  try {
    // Insert the new project into the 'projects' table
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert([{ title, description }])
      .select('*') // Explicitly select the inserted row
      .single(); // Ensure only one row is returned

    if (projectError) throw projectError;
    if (!projectData) throw new Error('Project creation failed: No data returned');

    console.log('Project created:', projectData);

    // Define the base files for a new project
    const baseFiles = [
      {
        file_name: 'index.html',
        file_type: 'text/html',
        file_content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
  <script src="sketch.js"></script>
</body>
</html>`,
      },
      {
        file_name: 'sketch.js',
        file_type: 'text/javascript',
        file_content: `function setup() {
  createCanvas(800, 600);
  background(220);
}

function draw() {
  // Your code here
}`,
      },
      {
        file_name: 'styles.css',
        file_type: 'text/css',
        file_content: `body {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}`,
      },
    ];

    // Insert the base files into the 'project_files' table
    const { data: filesData, error: filesError } = await supabase
      .from('project_files')
      .insert(baseFiles.map((file) => ({ ...file, project_id: projectData.id })));

    if (filesError) throw filesError;

    return projectData;
  } catch (err) {
    console.error('Error creating project:', err);
    throw err;
  }
};