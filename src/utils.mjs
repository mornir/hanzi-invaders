function getXCoordinates(canvasWidth) {
  const x = getRndInteger(3, 8)
  return canvasWidth / x
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export { getXCoordinates }
