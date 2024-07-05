const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Asegúrate de tener tu modelo User importado

// Ruta GET /api/users (obtener todos los usuarios)
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Busca todos los usuarios en la colección User
        res.json(users); // Devuelve los usuarios en formato JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
});

module.exports = router;