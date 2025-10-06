document.getElementById("loginBtn").addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  if(username) {
    localStorage.setItem("username", username);
    window.location.href = "index.html";
  } else {
    alert("Please enter your name");
  }
});