function isLandscapeOrientation() {
  return window.matchMedia("(orientation: landscape)").matches;
}

function getScreenWidth() {
  return window.innerWidth;
}

function adjustDisplayBasedOnWidthAndOrientation(isGameRunning) {
  const rotateLayerRef = document.getElementById("rotateLayer");
  const mobileControlHubRef = document.getElementById("mobileControlHub");
  const width = getScreenWidth();
  const isLandscape = isLandscapeOrientation();

  if (isLandscape) {
    handleLandscapeMode(width, isGameRunning, rotateLayerRef, mobileControlHubRef);
  } else {
    handlePortraitMode(width, rotateLayerRef, mobileControlHubRef);
  }
}

function handleLandscapeMode(width, isGameRunning, rotateLayerRef, mobileControlHubRef) {
  if (width <= 667 || (width >= 668 && width <= 1080)) {
    rotateLayerRef.style.display = "none";
    mobileControlHubRef.style.display = isGameRunning ? "flex" : "none";
  } else {
    rotateLayerRef.style.display = "none";
    mobileControlHubRef.style.display = "none";
  }
}

function handlePortraitMode(width, rotateLayerRef, mobileControlHubRef) {
  if (width >= 667) {
    rotateLayerRef.style.display = "none";
    mobileControlHubRef.style.display = "none";
  } else {
    rotateLayerRef.style.display = "flex";
    mobileControlHubRef.style.display = "none";
  }
}

adjustDisplayBasedOnWidthAndOrientation(isGameRunning);
