const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/authMiddleware'); // Import the middleware

// GET /api/claims - Get all claims for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from token by middleware
    const { rows } = await db.query('SELECT * FROM claims WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/claims - Create a new claim for the authenticated user
router.post('/', verifyToken, async (req, res) => {
  const {
    debtor_name,
    debtor_email,
    debtor_address,
    claim_amount,
    due_date,
    status = 'nouveau', // Default status
    invoice_reference,
    description,
    recovered_amount = 0.00, // Default recovered amount
  } = req.body;

  const userId = req.user.id; // Extracted from token by middleware

  // Basic validation
  if (!debtor_name || !claim_amount) {
    return res.status(400).json({ msg: 'Please include debtor name and claim amount' });
  }
  if (!userId) {
    return res.status(400).json({ msg: 'User ID is missing. Ensure you are authenticated.'});
  }

  try {
    const newClaim = await db.query(
      `INSERT INTO claims (user_id, debtor_name, debtor_email, debtor_address, claim_amount, due_date, status, invoice_reference, description, recovered_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [userId, debtor_name, debtor_email, debtor_address, claim_amount, due_date, status, invoice_reference, description, recovered_amount]
    );
    res.status(201).json(newClaim.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === '23503') { // Foreign key violation (e.g. user_id doesn't exist)
        return res.status(400).json({ msg: 'Error creating claim due to invalid reference (e.g., user ID).' });
    }
    res.status(500).send('Server error');
  }
});

// GET /api/claims/:id - Get a single claim by ID, ensuring it belongs to the authenticated user
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rows } = await db.query('SELECT * FROM claims WHERE id = $1 AND user_id = $2', [id, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Claim not found or access denied' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/claims/:id - Update a claim, ensuring it belongs to the authenticated user
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      debtor_name,
      debtor_email,
      debtor_address,
      claim_amount,
      due_date,
      status,
      invoice_reference,
      description,
      recovered_amount,
    } = req.body;

    // Fetch current claim to ensure it exists and belongs to the user
    const currentClaimResult = await db.query('SELECT * FROM claims WHERE id = $1 AND user_id = $2', [id, userId]);
    if (currentClaimResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Claim not found or access denied' });
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
         recovered_amount = $9,
         updated_at = NOW()
       WHERE id = $10 AND user_id = $11
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
        recovered_amount !== undefined ? recovered_amount : currentClaim.recovered_amount,
         id,
         userId // for the WHERE clause
      ]
    );
    res.json(updatedClaim.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/claims/:id - Delete a claim, ensuring it belongs to the authenticated user
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const deleteOp = await db.query('DELETE FROM claims WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);

    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ msg: 'Claim not found or access denied' });
    }
    res.json({ msg: 'Claim deleted', deletedClaim: deleteOp.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
