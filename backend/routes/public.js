import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/tag/:tagId', async (req, res) => {
  const [rows] = await db.query(
    'SELECT p.*, u.name as owner_name, u.phone as owner_phone FROM pets p JOIN users u ON p.owner_id = u.id WHERE p.tag_id = ?',
    [req.params.tagId]
  );
  if (rows.length === 0) return res.status(404).json({ message: 'Tag not found' });
  res.json(rows[0]);
});

router.post('/scan/:tagId', async (req, res) => {
  const { lat, lng } = req.body;
  const [pets] = await db.query('SELECT id, name FROM pets WHERE tag_id = ?', [req.params.tagId]);
  if (pets.length > 0) {
    await db.query(
      'INSERT INTO alerts (pet_id, type, title, message) VALUES (?, "scan", ?, ?)',
      [pets[0].id, `${pets[0].name} Scanned!`, `Someone scanned the tag at coordinates ${lat}, ${lng}`]
    );
  }
  res.json({ success: true });
});

router.post('/message/:tagId', async (req, res) => {
  const { message } = req.body;
  const [pets] = await db.query('SELECT id, name FROM pets WHERE tag_id = ?', [req.params.tagId]);
  if (pets.length > 0) {
    await db.query(
      'INSERT INTO alerts (pet_id, type, title, message) VALUES (?, "lost", ?, ?)',
      [pets[0].id, `Message about ${pets[0].name}`, message]
    );
  }
  res.json({ success: true });
});

export default router;
