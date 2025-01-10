const welcomeForm = document.getElementById("welcome-form");
const username = document.getElementById("username");
const themeSwitch = document.getElementById("theme-switch");

function storeUsername(e) {
  e.preventDefault();
  if (username.value.trim() !== "") {
    localStorage.setItem("username", username.value);
    window.location.href = "../html/index.html";
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  document.querySelector(".container").classList.toggle("dark-theme");
  localStorage.setItem("theme", themeSwitch.checked ? "dark" : "light");
}

themeSwitch.addEventListener("change", toggleTheme);

welcomeForm.addEventListener("submit", storeUsername);

// Apply the saved theme
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    themeSwitch.checked = true;
    toggleTheme();
  }
});
