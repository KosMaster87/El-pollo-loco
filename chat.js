function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }

  // Korrekte Anwendung von !important in JavaScript
  document.getElementById("mobileControlHub").style.setProperty("display", "none", "important");
  document.getElementById("menuPop").style.display = "none";
  adjustDisplayBasedOnWidthAndOrientation();
}
