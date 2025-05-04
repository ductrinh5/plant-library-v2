import { DB } from "./connect.js";
import cors from "cors";
import express, { application } from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import fs from "fs";
import saveThumbnailRoute from "./routes/saveThumbnail.js";
import uploadRoute from "./routes/upload.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const app = express();

app.use(cors());
app.use(express.static("public")); // để phục vụ file tĩnh
app.use(bodyParser.json({ limit: "10mb" }));
app.use(saveThumbnailRoute);
app.use(uploadRoute);

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Single hardcoded user
  const ADMIN_USER = "duc1811";
  const ADMIN_PASS = "secret123";

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    // You can use sessions or return a token
    res.status(200).json({ message: "Login success", token: "abc123" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), "public", "models");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, req.body.filename || file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res
    .status(200)
    .json({ status: "success", path: `/models/${req.file.filename}` });
});

app.get("/", (req, res) => {
  res.status(200);
  res.send("Plant service is online");
});

app.get("/api", (req, res) => {
  res.set("content-type", "application/json");

  let sql;
  let params;

  if (req.query.id) {
    // If an ID is provided, fetch only that plant
    sql = "SELECT * FROM plants WHERE plant_id = ?";
    params = [req.query.id];
  } else {
    // Otherwise, fetch all plants
    sql = "SELECT * FROM plants";
    params = [];
  }

  let data = { plants: [] };

  try {
    DB.all(sql, params, (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        data.plants.push({
          id: row.plant_id,
          name: row.plant_name,
          family: row.plant_family,
          description: row.plant_desc,
          distribution: row.plant_dist,
          value: row.plant_value,
          history: row.plant_history,
          growth: row.plant_growth,
          application: row.plant_app,
          model: row.plant_model_3D,
          preview: row.plant_preview,
        });
      });

      res.json(data);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api", (req, res) => {
  console.log(req.body);

  res.set("content-type", "application/json");
  const sql =
    "INSERT INTO plants(plant_name, plant_family, plant_desc, plant_dist, plant_value, plant_history, plant_growth, plant_app, plant_model_3D, plant_preview) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ?, ?)";
  let newId;
  try {
    DB.run(
      sql,
      [
        req.body.name,
        req.body.family,
        req.body.description,
        req.body.distribution.join(", "),
        req.body.value,
        req.body.history,
        req.body.growth,
        req.body.application.join(", "),
        req.body.model,
        req.body.preview,
      ],
      function (err) {
        if (err) throw err;
        newId = this.lastID; //provides the auto increment integer plant_id
        res.status(201);
        let data = { status: 201, message: `New plant ${newId} saved.` };
        let content = JSON.stringify(data);
        res.send(content);
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(468);
    res.send(`{"code":468, "status":"${err.message}"}`);
  }
});

const __filename = fileURLToPath(import.meta.url);


app.delete("/api", (req, res) => {
  res.set("content-type", "application/json");
  const sql =
    "SELECT plant_preview, plant_model_3D FROM plants WHERE plant_id = ?";
  const deleteSql = "DELETE FROM plants WHERE plant_id = ?";

  try {
    // First get the file paths
    DB.get(sql, [req.query.id], function (err, row) {
      if (err) throw err;

      if (!row) {
        return res.status(404).send(`{"message":"Plant not found."}`);
      }

      // Extract filenames from URLs
      const modelPath = row.plant_model_3D.split('/').pop(); // Get just the filename
      const thumbnailPath = row.plant_preview.split('/').pop(); // Get just the filename

      // Delete files first
      const filesToDelete = [
        path.join(process.cwd(), "public", "models", modelPath),
        path.join(process.cwd(), "public", "thumbnails", thumbnailPath),
      ];

      let filesDeleted = 0;
      filesToDelete.forEach((filePath) => {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            filesDeleted++;
            console.log(`Deleted file: ${filePath}`);
          } else {
            console.log(`File not found: ${filePath}`);
          }
        } catch (fileErr) {
          console.error(`Error deleting file ${filePath}:`, fileErr);
        }
      });

      // Then delete from database
      DB.run(deleteSql, [req.query.id], function (err) {
        if (err) throw err;

        if (this.changes === 1) {
          res.status(200).json({
            message: `Item was removed successfully`,
            filesDeleted: filesDeleted,
            dbDeleted: true,
          });
        } else {
          res.status(200).json({
            message: "No database record deleted",
            filesDeleted: filesDeleted,
          });
        }
      });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      code: 500,
      error: err.message,
    });
  }
});

app.listen(3000, (err) => {
  if (err) {
    console.log("ERROR:", err.message);
  }
  console.log("LISTENING on port 3000");
});
