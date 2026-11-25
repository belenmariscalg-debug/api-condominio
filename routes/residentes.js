const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * tags:
 *   name: Residentes
 *   description: Dueños e inquilinos del condominio
 */

/**
 * @swagger
 * /residentes:
 *   get:
 *     summary: Obtiene todos los registros de residentes
 *     tags: [Residentes]
 *     responses:
 *       200:
 *         description: Lista de residentes
 *         content:
 *           application/json:
 *             example:
 *               - id_residente: 1
 *                 nombre: Laura Beltrán Díaz
 *                 telefono: "4421112233"
 *                 tipo: inquilino
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM residentes ORDER BY id_residente');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /residentes/{id}:
 *   get:
 *     summary: Obtiene un residente por su ID
 *     tags: [Residentes]
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
    const result = await pool.query('SELECT * FROM residentes WHERE id_residente = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /residentes:
 *   post:
 *     summary: Crea un residente
 *     tags: [Residentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, telefono, tipo]
 *             properties:
 *               nombre:
 *                 type: string
 *               telefono:
 *                 type: string
 *               tipo:
 *                 type: string
 *           example:
 *             nombre: Laura Beltrán Díaz
 *             telefono: "4421112233"
 *             tipo: inquilino
 *     responses:
 *       201:
 *         description: Registro creado
 *       500:
 *         description: Error del servidor (ej. llave foránea inexistente)
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, telefono, tipo } = req.body;
    const result = await pool.query(
      'INSERT INTO residentes (nombre, telefono, tipo) VALUES ($1, $2, $3) RETURNING *',
      [nombre, telefono, tipo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /residentes/{id}:
 *   put:
 *     summary: Actualiza un residente
 *     tags: [Residentes]
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
 *               telefono:
 *                 type: string
 *               tipo:
 *                 type: string
 *           example:
 *             nombre: Laura Beltrán Díaz
 *             telefono: "4429998877"
 *             tipo: dueño
 *     responses:
 *       200:
 *         description: Registro actualizado
 *       404:
 *         description: No encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const { nombre, telefono, tipo } = req.body;
    const result = await pool.query(
      'UPDATE residentes SET nombre=$1, telefono=$2, tipo=$3 WHERE id_residente=$4 RETURNING *',
      [nombre, telefono, tipo, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /residentes/{id}:
 *   delete:
 *     summary: Elimina un residente
 *     tags: [Residentes]
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
    const result = await pool.query('DELETE FROM residentes WHERE id_residente = $1 RETURNING *', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(200).json({ mensaje: 'Registro eliminado', eliminado: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
