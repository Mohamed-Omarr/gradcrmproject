import { IncomingForm, File, Fields } from 'formidable';
import { NextApiRequest } from 'next';

export function parseFormInMemory(req: NextApiRequest) {
  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
    filter: part => part.mimetype?.startsWith('image/'),
    multiples: false,
  });

  return new Promise<{ fields: Fields; files: Record<string, File | File[]> }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}
