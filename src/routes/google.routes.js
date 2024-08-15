const { Router } = require('express');
const router = Router();
const { searchAndFetchRow } = require('../controllers/spreadsheets');


// Ruta para búsqueda
router.get('/search', async (req, res) => {
  try {
    // Extraer el parámetro de búsqueda de la consulta
    const queryParam = Object.keys(req.query)[0]; // Toma el primer parámetro de consulta
    const queryValue = req.query[queryParam]; // Toma el valor del parámetro de consulta

    if (!queryParam || !queryValue) {
      return res.status(400).json({ error: 'Falta el parámetro de consulta o el valor.' });
    }

    // Buscar los datos
    const data = await searchAndFetchRow(queryParam, queryValue);
    res.json(data); // Enviar el array directamente

  } catch (error) {
    // Manejo de errores
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Ha ocurrido un error durante la búsqueda.' });
  }
});

module.exports =  router;