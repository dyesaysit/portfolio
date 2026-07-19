require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const CERT_PASSWORD = process.env.CERT_PASSWORD || 'omar2026';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change_this_secret_in_production';
const PROTECTED_DIR = path.join(__dirname, 'protected_certs');

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.use(session({
  name: 'omar_sess',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 30 // 30 minutes
  }
}));

// Serve the static site (optional). If you deploy static elsewhere, you can disable this.
app.use(express.static(path.join(__dirname)));

// Auth endpoint: client posts { password }
app.post('/auth', function (req, res) {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ ok: false, message: 'Missing password' });
  if (password === CERT_PASSWORD) {
    req.session.authenticated = true;
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, message: 'Invalid password' });
});

// Serve protected certificate file if session is authenticated
app.get('/cert/:file', function (req, res) {
  if (!req.session || !req.session.authenticated) {
    return res.status(401).send('Unauthorized');
  }

  const filename = path.basename(req.params.file);
  const filePath = path.join(PROTECTED_DIR, filename);

  if (!filePath.startsWith(PROTECTED_DIR)) {
    return res.status(400).send('Invalid file');
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.sendFile(filePath);
});

// Simple logout
app.post('/logout', function (req, res) {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Protected certificates directory: ${PROTECTED_DIR}`);
});
