import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the file path to the output file
const filePath = path.join(__dirname, '../dist/index.js'); // Adjust if your output file name is different

// Shebang line to be added
const shebang = '#!/usr/bin/env node\n';

// Read the existing file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }

  // Check if the shebang already exists to avoid duplicates
  if (!data.startsWith(shebang)) {
    // Prepend the shebang line
    const newData = shebang + data;

    // Write the updated content back to the file
    fs.writeFile(filePath, newData, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }
      console.log('Shebang line added successfully!');
    });
  } else {
    console.log('Shebang line already exists.');
  }
});
