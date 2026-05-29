import express from 'express';
import db from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

router.get('/', auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pets WHERE owner_id = ?', [req.userId]);
  res.json(rows);
});

router.get('/:id', auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pets WHERE id = ? AND owner_id = ?', [req.params.id, req.userId]);
  if (rows.length === 0) return res.status(404).json({ message: 'Pet not found' });
  res.json(rows[0]);
});

router.post('/', auth, async (req, res) => {
  const { name, species, breed, age, weight, color, photo_url, medical_conditions, vaccines, address, hide_phone } = req.body;
  const tag_id = `PTC-${Math.floor(1000 + Math.random() * 9000)}-${name?.charAt(0).toUpperCase() || 'P'}`;
  
  const [result] = await db.query(
    'INSERT INTO pets (owner_id, tag_id, name, species, breed, age, weight, color, photo_url, medical_conditions, vaccines, address, hide_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [req.userId, tag_id, name, species, breed, age, weight, color, photo_url, medical_conditions, vaccines, address, hide_phone]
  );
  res.status(201).json({ id: result.insertId, tag_id });
});

router.put('/:id', auth, async (req, res) => {
  const { name, species, breed, age, weight, color, photo_url, medical_conditions, vaccines, address, hide_phone } = req.body;
  await db.query(
    'UPDATE pets SET name=?, species=?, breed=?, age=?, weight=?, color=?, photo_url=?, medical_conditions=?, vaccines=?, address=?, hide_phone=? WHERE id=? AND owner_id=?',
    [name, species, breed, age, weight, color, photo_url, medical_conditions, vaccines, address, hide_phone, req.params.id, req.userId]
  );
  res.json({ message: 'Pet updated' });
});

router.post('/:id/lost', auth, async (req, res) => {
  await db.query('UPDATE pets SET status="lost" WHERE id=? AND owner_id=?', [req.params.id, req.userId]);
  res.json({ message: 'Pet reported lost' });
});

router.post('/:id/found', auth, async (req, res) => {
  await db.query('UPDATE pets SET status="healthy" WHERE id=? AND owner_id=?', [req.params.id, req.userId]);
  res.json({ message: 'Pet reported found' });
});

export default router;
