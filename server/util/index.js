function sendResponse(res, payload, status){
  if(!status) status = 200
  res.status(status).send(payload)
}

function sendError(res, message, status){
  sendResponse(res, {message: message}, status)
}

function getFileName(originalName){
  originalName = removeSpaces(originalName)
  originalName = Date.now()+originalName
  return originalName
}

function removeSpaces(str) {
  return str.replace(/\s/g , "-");
}

//formatiraj korisnika za odgovor (ukloni lozinku)
function formatUser(user){
  return {
    username: user.username,
    email: user.email,
    imgPath: user.imgPath,
    theme: user.theme
  }
}

//DEBUG
function printMethods(obj) {
  console.log()
  for (var id in obj) {
    try {
      if (typeof(obj[id]) == "function") {
        console.log(id + ": " + obj[id].toString())
      }
    } catch (err) {
      console.log(id + ": inaccessible")
    }
  }
  console.log()
}

module.exports = {
  sendResponse,
  sendError,
  getFileName,
  removeSpaces,
  formatUser,
  printMethods
}