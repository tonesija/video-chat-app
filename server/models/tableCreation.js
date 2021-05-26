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
    password: DataTypes.STRING,
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
    name: DataTypes.STRING
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

  //------ STAVLJANJE U EXPORT POLJE ------
  const tables = []
  tables.push(User)
  tables.push(ChatMessage)
  tables.push(Notification)
  tables.push(GroupChatMessage)
  tables.push(Group)

  return tables
}