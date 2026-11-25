const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Pagos de mantenimiento mensual
 */

/**
 * @swagger
 * /pagos:
 *   get:
 *     summary: Obtiene todos los registros de pagos
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de pagos
 *         content:
 *           application/json:
 *             example:
 *               - id_pago: 1
 *                 mes_cobro: "2026-06-01"
 *                 monto: 1500
 *                 estado: deuda
 *                 id_departamento: 1
 *                 id_residente: 1
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pagos_mantenimiento ORDER BY id_pago');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /pagos/{id}:
 *   get:
 *     summary: Obtiene un pago de mantenimiento por su ID
 *     tags: [Pagos]
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
    const result = await pool.query('SELECT * FROM pagos_mantenimiento WHERE id_pago = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Crea un pago de mantenimiento
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mes_cobro, monto, estado, id_departamento, id_residente]
 *             properties:
 *               mes_cobro:
 *                 type: string
 *               monto:
 *                 type: number
 *               estado:
 *                 type: string
 *               id_departamento:
 *                 type: integer
 *               id_residente:
 *                 type: integer
 *           example:
 *             mes_cobro: "2026-06-01"
 *             monto: 1500
 *             estado: deuda
 *             id_departamento: 1
 *             id_residente: 1
 *     responses:
 *       201:
 *         description: Registro creado
 *       500:
 *         description: Error del servidor (ej. llave foránea inexistente)
 */
router.post('/', async (req, res) => {
  try {
    const { mes_cobro, monto, estado, id_departamento, id_residente } = req.body;
    const result = await pool.query(
      'INSERT INTO pagos_mantenimiento (mes_cobro, monto, estado, id_departamento, id_residente) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [mes_cobro, monto, estado, id_departamento, id_residente]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /pagos/{id}:
 *   put:
 *     summary: Actualiza un pago de mantenimiento
 *     tags: [Pagos]
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
 *               mes_cobro:
 *                 type: string
 *               monto:
 *                 type: number
 *               estado:
 *                 type: string
 *               id_departamento:
 *                 type: integer
 *               id_residente:
 *                 type: integer
 *           example:
 *             mes_cobro: "2026-06-01"
 *             monto: 1500
 *             estado: pagado
 *             id_departamento: 1
 *             id_residente: 1
 *     responses:
 *       200:
 *         description: Registro actualizado
 *       404:
 *         description: No encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const { mes_cobro, monto, estado, id_departamento, id_residente } = req.body;
    const result = await pool.query(
      'UPDATE pagos_mantenimiento SET mes_cobro=$1, monto=$2, estado=$3, id_departamento=$4, id_residente=$5 WHERE id_pago=$6 RETURNING *',
      [mes_cobro, monto, estado, id_departamento, id_residente, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /pagos/{id}:
 *   delete:
 *     summary: Elimina un pago de mantenimiento
 *     tags: [Pagos]
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
    const result = await pool.query('DELETE FROM pagos_mantenimiento WHERE id_pago = $1 RETURNING *', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(200).json({ mensaje: 'Registro eliminado', eliminado: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
