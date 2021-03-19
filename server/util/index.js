function sendResponse(res, payload, status){
  if(!status) status = 200
  res.status(status).send(payload)
}

function sendError(res, message, status){
  sendResponse(res, {message: message}, status)
}

module.exports = {
  sendResponse,
  sendError
}