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
  if (currentNumber === "") return;
  if (previousNumber !== null) {
    calculate();
  }
  previousNumber = currentNumber;
  currentNumber = "0";
  operator = op;
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

// Aktualizace statistik na stránce
function updateStats() {
  const statsElement = document.getElementById("stats");
  statsElement.textContent = JSON.stringify(stats, null, 2);
}

// Načtení statistik při prvním načtení
loadStats();