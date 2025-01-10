const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const budgetContainer = document.getElementById("budget-container");
const userNameDisplay = document.getElementById("user-name");
const themeSwitch = document.getElementById("theme-switch");
const analyzeBtn = document.getElementById("analyze-btn");
const chartContainer = document.getElementById("chart-container");
const chartType = document.getElementById("chart-type");
const budgetChartCanvas = document
  .getElementById("budget-chart")
  .getContext("2d");

let transactions = [];
let budgetChart;

// Function to add transaction
function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount");
    return;
  }
  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
  };
  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();
  text.value = "";
  amount.value = "";
}

// Function to generate unique ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Function to add transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${
      transaction.id
    })">x</button>
  `;
  list.appendChild(item);
}

// Function to update values
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);
  balance.innerText = `Rs ${total}`;
  money_plus.innerText = `+Rs ${income}`;
  money_minus.innerText = `-Rs ${expense}`;
}

// Function to remove transaction
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Function to update local storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to toggle theme
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  document.querySelector(".container").classList.toggle("dark-theme");
  document
    .querySelectorAll(".btn")
    .forEach((btn) => btn.classList.toggle("dark-theme"));
  document
    .querySelectorAll(".list li")
    .forEach((li) => li.classList.toggle("dark-theme"));
  localStorage.setItem("theme", themeSwitch.checked ? "dark" : "light");
}

// Function to initialize app
function init() {
  const storedName = localStorage.getItem("username");
  const savedTheme = localStorage.getItem("theme");
  if (storedName) {
    userNameDisplay.innerText = `Welcome, ${storedName}`;
    budgetContainer.style.display = "block";
    list.innerHTML = "";
    transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.forEach(addTransactionDOM);
    updateValues();
  } else {
    window.location.href = "../login.html";
  }
  if (savedTheme === "dark") {
    themeSwitch.checked = true;
    toggleTheme();
  }
}

// Function to create and update chart
function updateChart() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const labels = transactions.map((transaction) => transaction.text);
  const incomeData = amounts.filter((item) => item > 0);
  const expenseData = amounts
    .filter((item) => item < 0)
    .map((item) => item * -1);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(46, 204, 113, 0.6)",
        borderColor: "rgba(46, 204, 113, 1)",
        borderWidth: 1,
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "rgba(192, 57, 43, 0.6)",
        borderColor: "rgba(192, 57, 43, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  if (budgetChart) {
    budgetChart.destroy();
  }

  if (chartType.value === "pie") {
    budgetChart = new Chart(budgetChartCanvas, {
      type: "pie",
      data: {
        labels: ["Income", "Expense"],
        datasets: [
          {
            data: [
              incomeData.reduce((acc, item) => (acc += item), 0),
              expenseData.reduce((acc, item) => (acc += item), 0),
            ],
            backgroundColor: [
              "rgba(46, 204, 113, 0.6)",
              "rgba(192, 57, 43, 0.6)",
            ],
            borderColor: ["rgba(46, 204, 113, 1)", "rgba(192, 57, 43, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: chartOptions,
    });
  } else if (chartType.value === "bar") {
    budgetChart = new Chart(budgetChartCanvas, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });
  } else if (chartType.value === "line") {
    budgetChart = new Chart(budgetChartCanvas, {
      type: "line",
      data: chartData,
      options: chartOptions,
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
form.addEventListener("submit", addTransaction);
themeSwitch.addEventListener("change", toggleTheme);
analyzeBtn.addEventListener("click", () => {
  chartContainer.style.display = "block";
  updateChart();
});
chartType.addEventListener("change", updateChart);
