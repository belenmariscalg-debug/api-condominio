const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * tags:
 *   name: Departamentos
 *   description: Departamentos de cada edificio
 */

/**
 * @swagger
 * /departamentos:
 *   get:
 *     summary: Obtiene todos los registros de departamentos
 *     tags: [Departamentos]
 *     responses:
 *       200:
 *         description: Lista de departamentos
 *         content:
 *           application/json:
 *             example:
 *               - id_departamento: 1
 *                 numero_interior: "1105"
 *                 metros_cuadrados: 72.5
 *                 id_edificio: 1
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departamentos ORDER BY id_departamento');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /departamentos/{id}:
 *   get:
 *     summary: Obtiene un departamento por su ID
 *     tags: [Departamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro
 *     responses:
 *       200:
 *         description: Registro encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departamentos WHERE id_departamento = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /departamentos:
 *   post:
 *     summary: Crea un departamento
 *     tags: [Departamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [numero_interior, metros_cuadrados, id_edificio]
 *             properties:
 *               numero_interior:
 *                 type: string
 *               metros_cuadrados:
 *                 type: number
 *               id_edificio:
 *                 type: integer
 *           example:
 *             numero_interior: "1105"
 *             metros_cuadrados: 72.5
 *             id_edificio: 1
 *     responses:
 *       201:
 *         description: Registro creado
 *       500:
 *         description: Error del servidor (ej. llave foránea inexistente)
 */
router.post('/', async (req, res) => {
  try {
    const { numero_interior, metros_cuadrados, id_edificio } = req.body;
    const result = await pool.query(
      'INSERT INTO departamentos (numero_interior, metros_cuadrados, id_edificio) VALUES ($1, $2, $3) RETURNING *',
      [numero_interior, metros_cuadrados, id_edificio]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /departamentos/{id}:
 *   put:
 *     summary: Actualiza un departamento
 *     tags: [Departamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero_interior:
 *                 type: string
 *               metros_cuadrados:
 *                 type: number
 *               id_edificio:
 *                 type: integer
 *           example:
 *             numero_interior: "1106"
 *             metros_cuadrados: 80
 *             id_edificio: 2
 *     responses:
 *       200:
 *         description: Registro actualizado
 *       404:
 *         description: No encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const { numero_interior, metros_cuadrados, id_edificio } = req.body;
    const result = await pool.query(
      'UPDATE departamentos SET numero_interior=$1, metros_cuadrados=$2, id_edificio=$3 WHERE id_departamento=$4 RETURNING *',
      [numero_interior, metros_cuadrados, id_edificio, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /departamentos/{id}:
 *   delete:
 *     summary: Elimina un departamento
 *     tags: [Departamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro eliminado
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM departamentos WHERE id_departamento = $1 RETURNING *', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(200).json({ mensaje: 'Registro eliminado', eliminado: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
