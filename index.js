const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
const app = express();
const PORT = 3000;

//defining cache
let cache = {
  data: null,
  timestamp: 0,
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend')));

// Load credentials
const auth = new google.auth.GoogleAuth({
  keyFile: 'shire-name-gen-7d8c8258b597.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});



  const spreadsheetId = '1ytizffUOdn2owXSWMGmjoH4W476A_W7S29QHS6yVfB8'; //actual sheet ID
  const range = 'Sheet1!A:D'; 

  async function fetchSheetData() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) return [];

  const headers = rows[0];
  const data = rows.slice(1);

  const result = {
    eeowna: [],
    appendix: [],
    feminine: [],
    masculine: [],
  };

  data.forEach(row => {
    if (row[0]) result.eeowna.push(row[0].trim());
    if (row[1]) result.appendix.push(row[1].trim());
    if (row[2]) result.feminine.push(row[2].trim());
    if (row[3]) result.masculine.push(row[3].trim());
  });

  return result;
}

app.get('/', (req, res) => {
  res.send('Shire Name Generator backend is running.');
});

app.get('/names', async (req, res) => {
  const now = Date.now();
  if (cache.data && (now - cache.timestamp) < CACHE_DURATION) {
    return res.json(cache.data);
  }

  try {
    const names = await fetchSheetData(); // fetch fresh data
    cache.data = names;
    cache.timestamp = now;
    res.json(names);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch names.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
