import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all pets for owner
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pets WHERE owner_id = ? ORDER BY created_at DESC', [req.userId]);
    res.json(rows);
  } catch (err) {
    console.error('Get Pets Error:', err);
    res.status(500).json({ message: 'Failed to retrieve pets' });
  }
});

// Get pet details with vaccinations, medical records, and emergency contacts
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pets WHERE id = ? AND owner_id = ?', [req.params.id, req.userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Pet not found' });
    
    const pet = rows[0];
    
    const [vaccinations] = await db.query('SELECT * FROM vaccinations WHERE pet_id = ? ORDER BY date_given DESC', [pet.id]);
    const [medicalRecords] = await db.query('SELECT * FROM medical_records WHERE pet_id = ? ORDER BY record_date DESC', [pet.id]);
    const [emergencyContacts] = await db.query('SELECT * FROM emergency_contacts WHERE pet_id = ? ORDER BY is_primary DESC', [pet.id]);
    
    res.json({
      ...pet,
      vaccinations,
      medicalRecords,
      emergencyContacts
    });
  } catch (err) {
    console.error('Get Pet Details Error:', err);
    res.status(500).json({ message: 'Failed to retrieve pet details' });
  }
});

// Create pet
router.post('/', auth, async (req, res) => {
  try {
    const { name, species, breed, sex, date_of_birth, weight, color, photo_url, microchip_id, address, hide_phone, hide_address, hide_medical, barangay, tag_id } = req.body;
    
    // Generate tag_id if not provided
    const finalTagId = tag_id || `PTC-${Math.floor(1000 + Math.random() * 9000)}-${name?.charAt(0).toUpperCase() || 'P'}`;
    
    // Check if tag is already registered in nfc_tags
    const [existingTag] = await db.query('SELECT id FROM nfc_tags WHERE tag_uid = ? AND status = "active"', [finalTagId]);
    if (existingTag.length > 0) {
      return res.status(400).json({ message: 'NFC Tag is already registered to another pet' });
    }

    const [result] = await db.query(
      'INSERT INTO pets (owner_id, name, species, breed, sex, date_of_birth, weight, color, photo_url, microchip_id, address, hide_phone, hide_address, hide_medical, barangay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.userId, name, species, breed, sex || 'Unknown', date_of_birth || null, weight || null, color || null, photo_url || null, microchip_id || null, address || null, hide_phone || 0, hide_address || 0, hide_medical || 0, barangay || null]
    );

    const petId = result.insertId;

    // Insert or update nfc_tags table
    await db.query(
      'INSERT INTO nfc_tags (tag_uid, pet_id, status, activated_at) VALUES (?, ?, "active", CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE pet_id = ?, status = "active", activated_at = CURRENT_TIMESTAMP',
      [finalTagId, petId, petId]
    );
    
    res.status(201).json({ id: petId, tag_id: finalTagId });
  } catch (err) {
    console.error('Create Pet Error:', err);
    res.status(500).json({ message: 'Failed to register pet', error: err.message });
  }
});

// Update pet
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, species, breed, sex, date_of_birth, weight, color, photo_url, microchip_id, address, hide_phone, hide_address, hide_medical, barangay } = req.body;
    
    const [result] = await db.query(
      'UPDATE pets SET name=?, species=?, breed=?, sex=?, date_of_birth=?, weight=?, color=?, photo_url=?, microchip_id=?, address=?, hide_phone=?, hide_address=?, hide_medical=?, barangay=? WHERE id=? AND owner_id=?',
      [name, species, breed, sex || 'Unknown', date_of_birth || null, weight || null, color || null, photo_url || null, microchip_id || null, address || null, hide_phone || 0, hide_address || 0, hide_medical || 0, barangay || null, req.params.id, req.userId]
    );
    
    res.json({ message: 'Pet details updated successfully' });
  } catch (err) {
    console.error('Update Pet Error:', err);
    res.status(500).json({ message: 'Failed to update pet details' });
  }
});

// Delete pet
router.delete('/:id', auth, async (req, res) => {
  try {
    const petId = req.params.id;
    const [pets] = await db.query('SELECT id FROM pets WHERE id = ? AND owner_id = ?', [petId, req.userId]);
    if (pets.length === 0) return res.status(404).json({ message: 'Pet not found' });
    
    // Also deactivate the NFC tag associated
    await db.query('UPDATE nfc_tags SET status = "deactivated" WHERE pet_id = ?', [petId]);
    await db.query('DELETE FROM pets WHERE id = ?', [petId]);
    
    res.json({ message: 'Pet deleted successfully' });
  } catch (err) {
    console.error('Delete Pet Error:', err);
    res.status(500).json({ message: 'Failed to delete pet' });
  }
});

// Report pet lost
router.post('/:id/lost', auth, async (req, res) => {
  try {
    const petId = req.params.id;
    const { last_seen_location, reward_amount, lost_description, last_seen_lat, last_seen_lng, contact_instructions } = req.body;
    
    const [pets] = await db.query('SELECT name FROM pets WHERE id = ? AND owner_id = ?', [petId, req.userId]);
    if (pets.length === 0) return res.status(404).json({ message: 'Pet not found' });
    const petName = pets[0].name;

    await db.query('UPDATE pets SET status = "lost" WHERE id = ?', [petId]);
    
    // Insert into lost_pet_reports
    await db.query('DELETE FROM lost_pet_reports WHERE pet_id = ? AND status = "active"', [petId]);
    await db.query(
      'INSERT INTO lost_pet_reports (pet_id, reporter_id, last_seen_location, last_seen_lat, last_seen_lng, reward_amount, description, contact_instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [petId, req.userId, last_seen_location, last_seen_lat || null, last_seen_lng || null, reward_amount || null, lost_description || null, contact_instructions || null]
    );

    // Insert alert/notification
    await db.query(
      'INSERT INTO notifications (user_id, pet_id, type, title, message) VALUES (?, ?, "lost_alert", ?, ?)',
      [req.userId, petId, `${petName} Reported Lost!`, `You reported ${petName} lost in ${last_seen_location || 'unknown location'}.`]
    );
    
    res.json({ message: 'Pet reported lost successfully' });
  } catch (err) {
    console.error('Report Lost Error:', err);
    res.status(500).json({ message: 'Failed to report pet lost' });
  }
});

// Report pet found
router.post('/:id/found', auth, async (req, res) => {
  try {
    const petId = req.params.id;
    const [pets] = await db.query('SELECT name FROM pets WHERE id = ? AND owner_id = ?', [petId, req.userId]);
    if (pets.length === 0) return res.status(404).json({ message: 'Pet not found' });
    const petName = pets[0].name;

    await db.query('UPDATE pets SET status = "healthy" WHERE id = ?', [petId]);
    await db.query(
      'UPDATE lost_pet_reports SET status = "resolved", resolved_at = CURRENT_TIMESTAMP WHERE pet_id = ? AND status = "active"',
      [petId]
    );

    await db.query(
      'INSERT INTO notifications (user_id, pet_id, type, title, message) VALUES (?, ?, "system", ?, ?)',
      [req.userId, petId, `${petName} Found!`, `Great news! ${petName} has been marked as found.`]
    );
    
    res.json({ message: 'Pet reported found successfully' });
  } catch (err) {
    console.error('Report Found Error:', err);
    res.status(500).json({ message: 'Failed to mark pet as found' });
  }
});

export default router;
