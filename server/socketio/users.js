const users = {}


function userJoin(id, username, room){
  const user = {id, username, room}

  users[id] = user

  return user
}

function getUser(id) {
  return users[id]
}

function getUserId(name) {
  console.log('getting user id')
  for(let k in users){
    console.log(users[k])
    if(users[k].username === name)
      return k
  }
  return null
}

function userLeave(id) {
  if(users[id] == null) return null
  let user = {
    id: id,
    username: users[id].username,
    room: users[id].room
  }
  delete users[id]
  return user
}

function getRoomUsers(room) {
  const toReturn = []
  for(let id in users){
    if(users[id].room === room) toReturn.push(users[id])
  }
  return toReturn
}

module.exports = {
  userJoin,
  getUser,
  getUserId,
  userLeave,
  getRoomUsers
}