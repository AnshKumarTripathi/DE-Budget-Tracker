const welcomeForm = document.getElementById("welcome-form");
const username = document.getElementById("username");

function storeUsername(e) {
  e.preventDefault();
  if (username.value.trim() !== "") {
    localStorage.setItem("username", username.value);
    window.location.href = "index.html";
  }
}

welcomeForm.addEventListener("submit", storeUsername);
