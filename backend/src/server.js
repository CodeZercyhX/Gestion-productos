const app = require("./app");
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // Dirección del frontend
}));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


app.get('/', (req, res) => {
  res.redirect('/login'); // Cambia '/login' a la ruta de tu frontend correspondiente
});