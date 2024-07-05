// routes/createpost.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Importa el modelo Post
const multer = require("multer");   // Para manejar la carga de archivos (imágenes)
const path = require('path');

// Configura multer para almacenar imágenes (puedes personalizar esto según tus necesidades)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre de archivo único
    }
});
const upload = multer({ storage: storage });

// Ruta POST /api/createpost
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { description, userId } = req.body;
        const imagePath = req.file.path;

        // Crea un nuevo post
        const newPost = new Post({
            image: imagePath,
            description,
            userId
        });

        // Guarda el post en la base de datos
        await newPost.save();

        res.status(201).json({ message: 'Post creado con éxito', post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el post' });
    }
});

module.exports = router;
