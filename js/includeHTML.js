/**
 * Just include.
 */
async function loadPage(filePath) {
  const element = document.getElementById("w3_include");
  const menuPopRef = document.getElementById("menuPop");
  let resp = await fetch(filePath);

  if (resp.ok) {
    element.innerHTML = await resp.text();
    
    if (menuPopRef.style.display === "flex") {
      menuPopRef.style.display = "none";
    }

    document.getElementById("w3_include").style.display = "flex";
  } else {
    element.innerHTML = "Page not found";
  }
}