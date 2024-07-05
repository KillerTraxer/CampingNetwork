const express = require('express');
const router = express.Router();
const Users = require('../models/User');

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email, password });

        if (!user) {
            return res.status(404).json({ message: 'Credenciales inválidas' });
        }

        res.json({ message: 'Inicio de sesión exitoso', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
