const express = require('express');
const dotenv = require('dotenv');
const db = require('./db'); // We'll create this db connection file next

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // Middleware to parse JSON bodies

// Basic route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// API routes
const claimRoutes = require('./routes/claims');
app.use('/api/claims', claimRoutes);
// Add other routes here later (e.g., for users, documents)

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
