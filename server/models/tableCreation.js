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
    password: DataTypes.STRING
  }, {timestamps: false})

  const Friends = sequelize.define('Friends')


  //------ DEFINIRANJE VEZA ------

  User.belongsToMany(User, {through: Friends, as: 'Friend', foreignKey: 'username'})
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


  return tables
}