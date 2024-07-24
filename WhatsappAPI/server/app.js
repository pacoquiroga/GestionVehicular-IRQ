const express = require('express');
const cors = require('cors'); // Importa el middleware cors
const path = require('path');
const app = express();

const pathHTML = path.resolve(__dirname, '../public/');

app.use(cors()); // Utiliza el middleware cors con la configuración predeterminada
app.use(express.static(pathHTML));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./messageRoute'));

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${PORT}`);
});
