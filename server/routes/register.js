const express = require('express');
const router = express.Router();
const Users = require('../models/User');

router.post('/', async (req, res) => {
    try {
        const { name, lastName, email, password, role } = req.body;

        const newUser = new Users({
            name,
            lastName,
            email,
            password,
            role
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            res.status(400).json({ message: 'Este email ya está en uso' });
        } else {
            res.status(500).json({ message: 'Error en el servidor durante el registro' });
        }
    }
});

module.exports = router;