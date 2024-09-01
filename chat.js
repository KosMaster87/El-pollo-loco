function resetCanvas() {
  // Hole das Canvas-Element und den Kontext
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Lösche den gesamten Inhalt des Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Stelle sicher, dass das Canvas-Element immer noch sichtbar ist
  canvas.style.display = "none"; // Verstecke es kurz
  canvas.style.display = "block"; // Zeige es wieder an

  // Optional: CSS-Klasse neu anwenden, falls erforderlich
  canvas.classList.add("canvas");
}
