const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * tags:
 *   name: Edificios
 *   description: Edificios y zonas del condominio
 */

/**
 * @swagger
 * /edificios:
 *   get:
 *     summary: Obtiene todos los edificios
 *     tags: [Edificios]
 *     responses:
 *       200:
 *         description: Lista de edificios
 *         content:
 *           application/json:
 *             example:
 *               - id_edificio: 1
 *                 nombre: Torre Aurora
 *                 cantidad_pisos: 12
 *                 amenidades: Alberca, gimnasio
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM edificios ORDER BY id_edificio');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /edificios/{id}:
 *   get:
 *     summary: Obtiene un edificio por su ID
 *     tags: [Edificios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del edificio
 *     responses:
 *       200:
 *         description: Edificio encontrado
 *       404:
 *         description: Edificio no encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM edificios WHERE id_edificio = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Edificio no encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /edificios:
 *   post:
 *     summary: Crea un nuevo edificio
 *     tags: [Edificios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, cantidad_pisos]
 *             properties:
 *               nombre:
 *                 type: string
 *               cantidad_pisos:
 *                 type: integer
 *               amenidades:
 *                 type: string
 *           example:
 *             nombre: Torre Kappa
 *             cantidad_pisos: 10
 *             amenidades: Alberca, gimnasio
 *     responses:
 *       201:
 *         description: Edificio creado
 *       500:
 *         description: Error del servidor
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, cantidad_pisos, amenidades } = req.body;
    const result = await pool.query(
      'INSERT INTO edificios (nombre, cantidad_pisos, amenidades) VALUES ($1, $2, $3) RETURNING *',
      [nombre, cantidad_pisos, amenidades]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /edificios/{id}:
 *   put:
 *     summary: Actualiza un edificio
 *     tags: [Edificios]
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
 *               nombre:
 *                 type: string
 *               cantidad_pisos:
 *                 type: integer
 *               amenidades:
 *                 type: string
 *           example:
 *             nombre: Torre Kappa Renovada
 *             cantidad_pisos: 11
 *             amenidades: Alberca, gimnasio, spa
 *     responses:
 *       200:
 *         description: Edificio actualizado
 *       404:
 *         description: Edificio no encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const { nombre, cantidad_pisos, amenidades } = req.body;
    const result = await pool.query(
      'UPDATE edificios SET nombre=$1, cantidad_pisos=$2, amenidades=$3 WHERE id_edificio=$4 RETURNING *',
      [nombre, cantidad_pisos, amenidades, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Edificio no encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /edificios/{id}:
 *   delete:
 *     summary: Elimina un edificio
 *     tags: [Edificios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Edificio eliminado
 *       404:
 *         description: Edificio no encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM edificios WHERE id_edificio = $1 RETURNING *', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Edificio no encontrado' });
    res.status(200).json({ mensaje: 'Edificio eliminado', eliminado: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
