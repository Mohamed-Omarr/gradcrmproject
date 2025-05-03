import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { NextApiRequest } from 'next';

//  This is your custom parser
export function parseForm(req: NextApiRequest) {
  // Define upload location
  const uploadDir = path.join(process.cwd(), '/public/uploads/products');
  
  // Ensure the directory exists (creates if not)
  fs.mkdirSync(uploadDir, { recursive: true });

  // Create and configure formidable form parser
  const form = formidable({
    uploadDir,                    // Save files to this dir
    keepExtensions: true,         // Keep .jpg, .png etc
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
    filter: part => part.mimetype?.startsWith('image/'), // Only accept images
    filename: (name, ext, part, form) => {
      const timestamp = Date.now();
      return `${timestamp}_${name.replace(/\s+/g, '_')}${ext}`; // Sanitize and timestamp the filename
    },
  });

  // Return a promise that resolves when parsing is complete
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);

      // Post-process file path here
      // If you expect only one file (e.g., `thumbnail`)
      const file = files.thumbnail?.[0]; // could also be files['thumbnail'] in older versions
      if (file) {
        const absolutePath = file.filepath || file.path; // different versions use different keys
        const relativePath = path.relative(path.join(process.cwd(), 'public'), absolutePath).replace(/\\/g, '/');
        
        // Replace the original file with just the public-facing path
        files.thumbnail = `/` + relativePath;
      }

      resolve({ fields, files });
    });
  });
}
