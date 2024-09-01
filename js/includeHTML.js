/**
 * Just include.
 */
async function loadPage(filePath) {
  const w3_includeRef = document.getElementById("w3_include");
  const resp = await fetch(filePath);

  if (resp.ok) {
    w3_includeRef.innerHTML = await resp.text();

    menuPopManager();

    document.getElementById("w3_include").style.display = "flex";
  } else {
    w3_includeRef.innerHTML = "Page not found";
  }
}

function menuPopManager() {
  const menuPopRef = document.getElementById("menuPop");

  if (menuPopRef.style.display === "flex") {
    menuPopRef.style.display = "none";
  }
}
