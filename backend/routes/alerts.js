import express from 'express';
import db from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/', auth, async (req, res) => {
  const [rows] = await db.query(
    'SELECT a.* FROM alerts a JOIN pets p ON a.pet_id = p.id WHERE p.owner_id = ? ORDER BY a.created_at DESC',
    [req.userId]
  );
  res.json(rows);
});

router.patch('/:id/read', auth, async (req, res) => {
  await db.query('UPDATE alerts SET is_read = TRUE WHERE id = ?', [req.params.id]);
  res.json({ message: 'Alert marked as read' });
});

export default router;
