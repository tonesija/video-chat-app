function sendResponse(res, payload, status){
  if(!status) status = 200
  res.status(status).send(payload)
}

function sendError(res, message, status){
  sendResponse(res, {message: message}, status)
}

function getFileName(originalName){
  originalName = removeSpaces(originalName)
  let now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth()
  let day = now.getDay()
  let hour = now.getHours()
  let minute = now.getMinutes()
  originalName = Date.now()+originalName
  return originalName
}

function removeSpaces (path) {
  return path.replace(/\s/g , "-");
}

module.exports = {
  sendResponse,
  sendError,
  getFileName,
  removeSpaces
}