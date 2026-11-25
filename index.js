const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Administración de Condominio Residencial',
      version: '1.0.0',
      description:
        'API REST para gestionar edificios, departamentos, residentes y pagos de mantenimiento de un condominio.',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [path.join(__dirname, 'routes', '*.js').replace(/\\/g, '/')],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas (una por tabla)
app.use('/edificios', require('./routes/edificios'));
app.use('/departamentos', require('./routes/departamentos'));
app.use('/residentes', require('./routes/residentes'));
app.use('/pagos', require('./routes/pagos'));

app.get('/', (req, res) => res.json({ mensaje: 'API Condominio funcionando. Docs en /api-docs' }));

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  console.log(`Swagger en http://localhost:${PORT}/api-docs`);
});
