const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/authMiddleware');

// POST /api/documents - Record a generated document's metadata
router.post('/', verifyToken, async (req, res) => {
  const { claim_id, document_type, data: formDataUsed } = req.body;
  const user_id = req.user.id; // From authenticated user

  if (!claim_id || !document_type || !formDataUsed) {
    return res.status(400).json({ message: 'claim_id, document_type, and data are required.' });
  }

  try {
    // Verify that the claim belongs to the user
    const claimCheck = await db.query('SELECT id FROM claims WHERE id = $1 AND user_id = $2', [claim_id, user_id]);
    if (claimCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied: Claim does not belong to the user or does not exist.' });
    }

    // Insert document metadata
    const newDocument = await db.query(
      `INSERT INTO documents (claim_id, user_id, document_type, data, generated_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [claim_id, user_id, document_type, formDataUsed]
    );

    res.status(201).json(newDocument.rows[0]);
  } catch (error) {
    console.error('Error saving document metadata:', error);
    res.status(500).json({ message: 'Server error while saving document metadata.' });
  }
});

// GET /api/documents?claim_id=:claimId - List documents for a specific claim
router.get('/', verifyToken, async (req, res) => {
  const { claim_id } = req.query;
  const user_id = req.user.id;

  if (!claim_id) {
    return res.status(400).json({ message: 'claim_id query parameter is required.' });
  }

  try {
    // Verify that the claim belongs to the user to ensure they can only list their documents
    const claimCheck = await db.query('SELECT id FROM claims WHERE id = $1 AND user_id = $2', [claim_id, user_id]);
    if (claimCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied: Claim does not belong to the user or does not exist.' });
    }

    const { rows } = await db.query(
      'SELECT id, document_type, generated_at FROM documents WHERE claim_id = $1 AND user_id = $2 ORDER BY generated_at DESC',
      [claim_id, user_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error while fetching documents.' });
  }
});

// We are not implementing PDF storage/download from server in this step.
// GET /api/documents/:id/download - Placeholder for future implementation

module.exports = router;
