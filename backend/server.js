require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const analysisRoutes = require('./routes/analysis');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Rate limiter — 20 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, please slow down.' }
});
app.use('/api/', limiter);

// Routes
app.use('/api', analysisRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 AlphaSignal backend running on http://localhost:${PORT}`);
  console.log(`   Groq key:      ${process.env.GROQ_API_KEY ? '✅ set' : '❌ missing'}`);
  console.log(`   Alpha Vantage: ${process.env.ALPHA_VANTAGE_KEY ? '✅ set' : '❌ missing'}\n`);
});