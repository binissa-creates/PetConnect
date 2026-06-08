import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone, email_alerts, sms_alerts } = req.body;
    
    // Convert booleans to numbers for MySQL tinyint
    const emailAlertsVal = (email_alerts === true || email_alerts === 1 || email_alerts === '1') ? 1 : 0;
    const smsAlertsVal = (sms_alerts === true || sms_alerts === 1 || sms_alerts === '1') ? 1 : 0;

    try {
      // Try full update first
      await db.query(
        'UPDATE users SET name = ?, email = ?, phone = ?, email_alerts = ?, sms_alerts = ? WHERE id = ?',
        [name, email, phone, emailAlertsVal, smsAlertsVal, req.userId]
      );
    } catch (dbErr) {
      // If columns don't exist, fall back to core columns
      if (dbErr.code === 'ER_BAD_FIELD_ERROR' || dbErr.message.includes('Unknown column')) {
        console.warn('Alert columns missing, falling back to core profile update');
        const [result] = await db.query(
          'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
          [name, email, phone, req.userId]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
      } else {
        throw dbErr; // Re-throw if it's another error (like duplicate email)
      }
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update Profile Error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already in use by another account' });
    }
    res.status(500).json({ message: err.message || 'Failed to update profile' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, role || 'owner']
    );
    
    const user = { id: result.insertId, name, email, role: role || 'owner' };
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    delete user.password;
    
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

export default router;
