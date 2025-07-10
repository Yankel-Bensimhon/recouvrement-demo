const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/claims - Get all claims (will be user-specific later)
router.get('/', async (req, res) => {
  try {
    // For now, fetching all claims. Later, this should be filtered by user_id
    const { rows } = await db.query('SELECT * FROM claims ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/claims - Create a new claim
router.post('/', async (req, res) => {
  const {
    debtor_name,
    debtor_email,
    debtor_address,
    claim_amount,
    due_date,
    status = 'nouveau', // Default status
    invoice_reference,
    description,
    // user_id will come from authenticated user session later
  } = req.body;

  // Basic validation
  if (!debtor_name || !claim_amount) {
    return res.status(400).json({ msg: 'Please include debtor name and claim amount' });
  }

  try {
    // In a real app, user_id would be extracted from an auth token or session
    const temp_user_id = 1; // Placeholder for now, assuming a user with id=1 exists

    const newClaim = await db.query(
      `INSERT INTO claims (user_id, debtor_name, debtor_email, debtor_address, claim_amount, due_date, status, invoice_reference, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [temp_user_id, debtor_name, debtor_email, debtor_address, claim_amount, due_date, status, invoice_reference, description]
    );
    res.status(201).json(newClaim.rows[0]);
  } catch (err) {
    console.error(err.message);
    // Check for specific DB errors, e.g., foreign key violation if user_id doesn't exist
    if (err.code === '23503') { // Foreign key violation
        return res.status(400).json({ msg: 'Invalid user_id or other foreign key constraint failed.' });
    }
    res.status(500).send('Server error');
  }
});

// GET /api/claims/:id - Get a single claim by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM claims WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Claim not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/claims/:id - Update a claim
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      debtor_name,
      debtor_email,
      debtor_address,
      claim_amount,
      due_date,
      status,
      invoice_reference,
      description,
    } = req.body;

    // Fetch current claim to ensure it exists and for partial updates
    const currentClaimResult = await db.query('SELECT * FROM claims WHERE id = $1', [id]);
    if (currentClaimResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Claim not found' });
    }
    const currentClaim = currentClaimResult.rows[0];

    // Construct update query, only updating fields that are provided
    const updatedClaim = await db.query(
      `UPDATE claims SET
         debtor_name = $1,
         debtor_email = $2,
         debtor_address = $3,
         claim_amount = $4,
         due_date = $5,
         status = $6,
         invoice_reference = $7,
         description = $8,
         updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        debtor_name !== undefined ? debtor_name : currentClaim.debtor_name,
        debtor_email !== undefined ? debtor_email : currentClaim.debtor_email,
        debtor_address !== undefined ? debtor_address : currentClaim.debtor_address,
        claim_amount !== undefined ? claim_amount : currentClaim.claim_amount,
        due_date !== undefined ? due_date : currentClaim.due_date,
        status !== undefined ? status : currentClaim.status,
        invoice_reference !== undefined ? invoice_reference : currentClaim.invoice_reference,
        description !== undefined ? description : currentClaim.description,
        id
      ]
    );
    res.json(updatedClaim.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/claims/:id - Delete a claim
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await db.query('DELETE FROM claims WHERE id = $1 RETURNING *', [id]);

    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ msg: 'Claim not found' });
    }
    res.json({ msg: 'Claim deleted', deletedClaim: deleteOp.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
