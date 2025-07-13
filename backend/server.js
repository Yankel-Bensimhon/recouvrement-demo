const express = require('express');
const dotenv = require('dotenv');
const db = require('./db');
const cookieParser = require('cookie-parser'); // Import cookie-parser

dotenv.config({ path: __dirname + '/../.env' }); // Load .env from root for NEXTAUTH_SECRET

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

// Basic route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// API routes
const claimRoutes = require('./routes/claims');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const configRoutes = require('./routes/config');

app.use('/api/claims', claimRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/config', configRoutes);


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
