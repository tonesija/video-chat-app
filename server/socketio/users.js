const users = new Map()


function userJoin(id, username, room){
  const user = {id, username, room}

  users[id] = user

  return user
}

function getUser(id) {
  return users[id]
}

function userLeave(id) {
  if(users[id] == null) return null
  let user = {
    id: id,
    username: users[id].username,
    room: users[id].room
  }
  users[id] = null
  console.log(user + ' aaaaa')
  return user
}

function getRoomUsers(room) {
  const toReturn = []
  for(let id in users){
    console.log(users[id])
    if(users[id].room === room) toReturn.push(users[id])
  }
  return toReturn
}

module.exports = {
  userJoin,
  getUser,
  userLeave,
  getRoomUsers
}