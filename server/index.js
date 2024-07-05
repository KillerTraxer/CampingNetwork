const express = require('express');
const connectDB = require('./config');
const authRoutes = require('./routes/auth');
const createPost = require('./routes/createpost');
const usersRoutes = require('./routes/users');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.get('/api', (req, res) => {
    res.send('Conectado');
});
app.use('/api/auth', authRoutes);
app.use('/api/createpost', createPost);
app.use('/api/users', usersRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});