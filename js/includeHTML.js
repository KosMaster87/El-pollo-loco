/**
 * Just include.
 */
async function loadPage(filePath) {
  const element = document.getElementById("w3_include");
  let resp = await fetch(filePath);
  if (resp.ok) {
    element.innerHTML = await resp.text();
  } else {
    element.innerHTML = "Page not found";
  }
}

// async function includeHTML() {
//   let includeElements = document.querySelectorAll("[w3-include-html]");
//   for (let i = 0; i < includeElements.length; i++) {
//     const element = includeElements[i];
//     file = element.getAttribute("w3-include-html");
//     let resp = await fetch(file);
//     if (resp.ok) {
//       element.innerHTML = await resp.text();
//     } else {
//       element.innerHTML = "Page not found";
//     }
//   }
// }
