let currentNumber = "0";
let previousNumber = null;
let operator = null;

// Statistiky počtu stisknutí
let stats = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
};

// Načíst statistiky z JSON souboru při načtení stránky
async function loadStats() {
  const response = await fetch('/stats');
  stats = await response.json();
  updateStats();
}

// Uložit statistiky do JSON souboru
async function saveStats() {
  await fetch('/stats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stats),
  });
}

function updateDisplay() {
  document.getElementById("display").textContent = currentNumber;
}

function appendNumber(num) {
  if (currentNumber === "0") {
    currentNumber = String(num);
  } else {
    currentNumber += String(num);
  }

  // Zvýšit statistiku pro číslo
  stats[num]++;
  updateStats();
  saveStats();

  updateDisplay();
}


function appendDot() {
  if (!currentNumber.includes(".")) {
    currentNumber += ".";
  }
  updateDisplay();
}

function clearEntry() {
  currentNumber = "0";
  updateDisplay();
}

function clearAll() {
  currentNumber = "0";
  previousNumber = null;
  operator = null;
  updateDisplay();
}

function backspace() {
  currentNumber = currentNumber.slice(0, -1) || "0";
  updateDisplay();
}

function operate(op) {
  if (operator && currentNumber === "0") {
    // Pokud již existuje operátor a aktuální číslo není zadáno, pouze aktualizujeme operátor
    operator = op;
    return;
  }

  if (previousNumber !== null) {
    calculate(); // Vypočítej, pokud už byla nastavena předchozí hodnota
  }

  previousNumber = currentNumber; // Ulož aktuální číslo jako předchozí
  currentNumber = "0"; // Resetuj aktuální číslo
  operator = op; // Nastav nový operátor
}

function calculate() {
  if (!previousNumber || !operator) return;

  const prev = parseFloat(previousNumber);
  const curr = parseFloat(currentNumber);
  let result = 0;

  switch (operator) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "*":
      result = prev * curr;
      break;
    case "/":
      result = prev / curr;
      break;
    case "%":
      result = prev % curr;
      break;
    case "x^2":
      result = prev ** 2;
      break;
    case "sqrt":
      result = Math.sqrt(prev);
      break;
    case "1/x":
      result = 1 / prev;
      break;
    default:
      return;
  }

  currentNumber = String(result);
  previousNumber = null;
  operator = null;
  updateDisplay();
}

function toggleSign() {
  currentNumber = String(parseFloat(currentNumber) * -1);
  updateDisplay();
}

function updateDisplay() {
  const maxLength = 15; // Maximální počet znaků na displeji
  let displayText = currentNumber;

  // Zkrátit číslo, pokud přesahuje maximální délku
  if (displayText.length > maxLength) {
    displayText = displayText.slice(0, maxLength) + "...";
  }

  document.getElementById("display").textContent = displayText;
}

// Aktualizace statistik na stránce
function updateStats() {
  const statsTableBody = document.querySelector("#stats-table tbody");
  statsTableBody.innerHTML = ""; // Vymaže starý obsah

  // Pro každý klíč (číslo) v objektu stats vytvoří řádek
  for (const number in stats) {
    const row = document.createElement("tr");

    const numberCell = document.createElement("td");
    numberCell.textContent = number;
    row.appendChild(numberCell);

    const countCell = document.createElement("td");
    countCell.textContent = stats[number];
    row.appendChild(countCell);

    statsTableBody.appendChild(row);
  }
}

async function loadStats() {
  const response = await fetch('/stats');
  stats = await response.json();
  updateStats();
}

// Uložit statistiky do JSON souboru
async function saveStats() {
  await fetch('/stats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stats),
  });
}

// Načtení statistik při prvním načtení
loadStats();