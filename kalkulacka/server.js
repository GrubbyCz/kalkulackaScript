const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Cesta k JSON souboru se statistikami
const statsFilePath = path.join(__dirname, 'stats.json');

// Middleware pro zpracování JSON
app.use(express.json());
app.use(express.static('public')); // Slouží statické soubory (HTML, CSS, JS)

// Funkce pro načtení statistik ze souboru
function loadStats() {
  if (fs.existsSync(statsFilePath)) {
    const statsData = fs.readFileSync(statsFilePath, 'utf-8');
    return JSON.parse(statsData);
  } else {
    // Pokud soubor neexistuje, vytvoříme prázdné statistiky
    const initialStats = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    fs.writeFileSync(statsFilePath, JSON.stringify(initialStats, null, 2));
    return initialStats;
  }
}

// Načíst statistiky při startu serveru
let stats = loadStats();

// API: Získání statistik
app.get('/stats', (req, res) => {
  res.json(stats);
});

// API: Aktualizace statistik
app.post('/stats', (req, res) => {
  stats = req.body;
  fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2)); // Uložit do souboru
  res.status(200).send('Statistiky byly aktualizovány.');
});

// Spuštění serveru
app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});