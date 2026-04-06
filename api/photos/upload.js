import { Dropbox } from "dropbox";
import formidable from "formidable-serverless";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const dropboxToken = process.env.DROPBOX_APP_TOKEN;
    if (!dropboxToken) return res.status(500).json({ error: "Missing Dropbox token" });

    const dbx = new Dropbox({ accessToken: dropboxToken });

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }

      const file = files.file;
      if (!file) return res.status(400).json({ error: "No file uploaded" });

      // Read file as buffer safely
      let fileBuffer;
      if (file.filepath) {
        // fallback for local dev
        fileBuffer = fs.readFileSync(file.filepath);
      } else if (file._writeStream && file._writeStream.path) {
        fileBuffer = fs.readFileSync(file._writeStream.path);
      } else if (file.toBuffer) {
        fileBuffer = await file.toBuffer(); // formidable 3.x+
      } else {
        return res.status(500).json({ error: "Unable to read uploaded file" });
      }

      const sanitizedName = (file.originalFilename || "file").replace(/[^a-zA-Z0-9.-]/g, "_");
      const folderPath = fields.path || "/";
      const dropboxPath = `${folderPath}/${Date.now()}_${sanitizedName}`;

      try {
        await dbx.filesUpload({
          path: dropboxPath,
          contents: fileBuffer,
          autorename: true,
        });
        console.log("Upload successful:", dropboxPath);
        return res.status(200).json({ message: "Upload successful!" });
      } catch (dropboxErr) {
        console.error("Dropbox upload error:", dropboxErr);
        return res.status(500).json({ error: "Error uploading to Dropbox" });
      }
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}