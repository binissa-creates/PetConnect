import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

router.use(auth);
router.use(requireRole(['vet', 'admin']));

// Get vet dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const vetId = req.userId;
    
    // Total patients seen
    const [patients] = await db.query(
      `SELECT COUNT(DISTINCT pet_id) as count FROM (
        SELECT pet_id FROM vaccinations WHERE administered_by = ?
        UNION
        SELECT pet_id FROM medical_records WHERE vet_id = ?
      ) as temp`,
      [vetId, vetId]
    );

    // Total vaccinations administered
    const [vaccinations] = await db.query(
      'SELECT COUNT(*) as count FROM vaccinations WHERE administered_by = ?',
      [vetId]
    );

    // Total medical treatments logged
    const [treatments] = await db.query(
      'SELECT COUNT(*) as count FROM medical_records WHERE vet_id = ?',
      [vetId]
    );

    res.json({
      total_patients: patients[0].count,
      total_vaccinations: vaccinations[0].count,
      total_treatments: treatments[0].count
    });
  } catch (err) {
    console.error('Vet Stats Error:', err);
    res.status(500).json({ message: 'Failed to retrieve clinical stats' });
  }
});

// Get patients seen by this vet
router.get('/patients', async (req, res) => {
  try {
    const vetId = req.userId;
    const [rows] = await db.query(
      `SELECT DISTINCT p.id, p.name, p.species, p.breed, p.photo_url, p.tag_id, u.name as owner_name, u.phone as owner_phone
       FROM pets p 
       JOIN users u ON p.owner_id = u.id
       WHERE p.id IN (
         SELECT pet_id FROM vaccinations WHERE administered_by = ?
         UNION
         SELECT pet_id FROM medical_records WHERE vet_id = ?
       )
       ORDER BY p.name ASC`,
      [vetId, vetId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get Vet Patients Error:', err);
    res.status(500).json({ message: 'Failed to retrieve patients list' });
  }
});

// Search patient by Tag ID (for vet clinical scan)
router.get('/search-patient/:tagId', async (req, res) => {
  try {
    const tagId = req.params.tagId;
    const [rows] = await db.query(
      `SELECT p.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email
       FROM pets p 
       JOIN users u ON p.owner_id = u.id 
       WHERE p.tag_id = ?`,
      [tagId]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Patient not found' });
    
    const pet = rows[0];
    
    const [vaccinations] = await db.query('SELECT * FROM vaccinations WHERE pet_id = ? ORDER BY date_given DESC', [pet.id]);
    const [medicalRecords] = await db.query('SELECT * FROM medical_records WHERE pet_id = ? ORDER BY record_date DESC', [pet.id]);
    const [emergencyContacts] = await db.query('SELECT * FROM emergency_contacts WHERE pet_id = ?', [pet.id]);
    
    res.json({
      ...pet,
      vaccinations,
      medicalRecords,
      emergencyContacts
    });
  } catch (err) {
    console.error('Search Patient Error:', err);
    res.status(500).json({ message: 'Failed to retrieve patient details' });
  }
});

export default router;
