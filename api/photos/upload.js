import { Dropbox } from "dropbox";
import formidable from "formidable-serverless"; // handles multipart/form-data
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // we handle parsing with formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const dropboxToken = process.env.DROPBOX_APP_TOKEN; // server-side token
  const dbx = new Dropbox({ accessToken: dropboxToken });

  try {
    // Parse the incoming form
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }

      if (!files.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const folderPath = fields.path || "/";
      const file = files.file;

      // Read file buffer
      const fileBuffer = fs.readFileSync(file.filepath);

      // Sanitize filename
      const sanitizedName = file.originalFilename.replace(/[^a-zA-Z0-9.-]/g, "_");
      const dropboxPath = `${folderPath}/${Date.now()}_${sanitizedName}`;

      try {
        await dbx.filesUpload({
          path: dropboxPath,
          contents: fileBuffer,
          autorename: true,
        });

        return res.status(200).json({ message: "Upload successful!" });
      } catch (uploadErr) {
        console.error("Dropbox upload error:", uploadErr);
        return res.status(500).json({ error: "Error uploading to Dropbox" });
      }
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}