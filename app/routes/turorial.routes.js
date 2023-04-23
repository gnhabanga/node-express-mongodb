module.exports = app => {
  const tutorials = require("../controllers/tutorial.controller.js");


  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", tutorials.create);

  // Retrieve all Tutorials
  router.get("/", tutorials.findAll);

  // Retrieve all published Tutorials
  router.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", tutorials.findOne);

  // Update a Tutorial with id
  router.put("/:id", tutorials.update);

  // Delete a Tutorial with id
  router.delete("/:id", tutorials.delete);

  // Create a new Tutorial
  router.delete("/", tutorials.deleteAll);


  const multer = require('multer');
  const path = require('path');
  const Document = require('../models/document.model.js');

  // Multer storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/') // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // File name format
    }
  });

  // Multer file filter configuration
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') { // Only allow PDF files
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  // Multer upload configuration
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter
  });

  // POST method for file uploads
  router.post('/documents', upload.single('document'), async (req, res) => {
    try {
      const { title, content } = req.body;
      const { filename, path: filePath } = req.file;

      const document = new Document({
        title: title,
        content: content,
        filename: filename,
        filepath: filePath
      });

      await document.save();
      res.status(201).json({ document });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.use("/api/tutorials", router);
};
