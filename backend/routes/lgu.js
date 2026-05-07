import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  const [totalPets] = await db.query('SELECT COUNT(*) as count FROM pets');
  const [lostPets] = await db.query('SELECT COUNT(*) as count FROM pets WHERE status = "lost"');
  const [totalOwners] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "owner"');
  
  res.json({
    total_pets: totalPets[0].count,
    lost_pets: lostPets[0].count,
    total_owners: totalOwners[0].count,
    reunited_today: 2, // Mock data
    new_this_month: 45,
    scans_this_month: 128,
    reunited_month: 15
  });
});

router.get('/alerts', async (req, res) => {
  const [rows] = await db.query(
    'SELECT p.name as pet_name, p.breed, p.photo_url, p.address, u.name as owner_name, p.created_at as reported_at FROM pets p JOIN users u ON p.owner_id = u.id WHERE p.status = "lost" ORDER BY p.created_at DESC'
  );
  res.json(rows);
});

export default router;
