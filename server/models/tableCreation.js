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
    content: {
      type: DataTypes.STRING
    }
  })


  //------ DEFINIRANJE VEZA ------

  User.belongsToMany(User, {through: Friends, as: 'Friend', foreignKey: 'username'})
  
  ChatMessage.belongsTo(User, {as: 'user1'})
  ChatMessage.belongsTo(User, {as: 'user2'})

  
  /*User.hasOne(Doctor, {foreignKey: 'userId'})
  User.hasOne(CloseContact, {foreignKey: 'userId', as: 'User'})
  User.hasMany(Messages, {as: 'Messages', foreignKey: 'userId'})

  Doctor.belongsTo(User, {foreignKey: 'userId'})
  Doctor.hasMany(Patient, {as: 'Patients', foreignKey: 'doctorId'})

  Patient.belongsTo(User, {foreignKey: 'userId', as: 'User'})
  Patient.hasMany(Entry, {as: 'Entries', foreignKey: 'userId'})
  //primjer:
  //patient.addCloseContact(closeContact)
  //closeContact.addPatient(patient)
  Patient.belongsToMany(CloseContact, {through: LooksAfter})
  CloseContact.belongsToMany(Patient, {through: LooksAfter})*/

  //------ STAVLJANJE U EXPORT POLJE ------
  const tables = []
  tables.push(User)
  tables.push(ChatMessage)


  return tables
}