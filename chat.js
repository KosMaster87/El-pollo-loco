function handleLandscapeMode(
  width,
  rotateLayerRef,
  mobileControlHubRef,
  isLandscape
) {
  const rotateImage = rotateLayerRef.querySelector("img");

  if (width <= 667 || (width >= 668 && width <= 1080)) {
    rotateLayerRef.style.display = "none";
    mobileControlHubRef.style.display = gameStartetOnce ? "flex" : "none";
  } else if (width <= 1368 && isLandscape) {
    rotateLayerRef.style.display = "none";
    mobileControlHubRef.style.display = "flex";
  } else {
    rotateLayerRef.style.display = "flex";
    rotateImage.src = "./../img/10_menu/screen_rotation.svg"; // src des img-Tags ändern
    mobileControlHubRef.style.display = "none";
  }
}
