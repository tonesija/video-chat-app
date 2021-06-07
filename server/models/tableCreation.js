const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function hashPassword (user) {
  console.log('HASHING PASSWORD')
  const SALT_FACTOR = 8
  if(!user.changed('password')){
    console.log('ipak ne hashiran')
    return
  }
  return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(user.password, salt, null))
    .then(hash => {
      user.setDataValue('password', hash)
    })
}

function comparePassword(password) {
  console.log(password, this.password)
  return bcrypt.compareAsync(password, this.password)
}

module.exports = (sequelize, DataTypes) => {
  //------ STVARANJE MODELA ------
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique:true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    imgPath: DataTypes.STRING,
    password: DataTypes.STRING(61),
    theme: DataTypes.BOOLEAN
  }, {timestamps: false})

  const Friends = sequelize.define('Friends')
  
  const ChatMessage = sequelize.define('ChatMessage', {
    content: DataTypes.STRING
  })

  const Notification = sequelize.define('Notification', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    type: DataTypes.ENUM('request', 'notification', 'groupRequest'),
    hasImg: DataTypes.BOOLEAN,
    imgPath: DataTypes.STRING,
    otherUserUsername: DataTypes.STRING,
    groupId: DataTypes.INTEGER
  })

  const GroupChatMessage = sequelize.define('GroupChatMessage', {
    content: DataTypes.STRING
  })

  const Group = sequelize.define('Group', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    imgPath: DataTypes.STRING
  })

  const GroupMembers = sequelize.define('GroupMembers')

  //------ DEFINIRANJE VEZA ------
  User.belongsToMany(User, {through: Friends, 
    as: 'Friend', foreignKey: 'username'})
  
  ChatMessage.belongsTo(User, {as: 'user1'})
  ChatMessage.belongsTo(User, {as: 'user2'})

  User.hasMany(Notification)

  Group.belongsToMany(User, {through: GroupMembers})

  User.hasMany(Group, {foreignKey: 'creatorId'})

  Group.hasMany(GroupChatMessage)
  GroupChatMessage.belongsTo(User)

  //------ ZA HASHIRANJE LOZINKE USERA ------
  

  User.addHook("beforeCreate", hashPassword)
  User.addHook("beforeUpdate", hashPassword)
  User.prototype.comparePassword = comparePassword

  //------ STAVLJANJE U EXPORT POLJE ------
  const tables = []
  tables.push(User)
  tables.push(ChatMessage)
  tables.push(Notification)
  tables.push(GroupChatMessage)
  tables.push(Group)
  tables.push(GroupMembers)

  return tables
}