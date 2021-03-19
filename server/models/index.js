const Sequelize = require("sequelize")
const config = require("../config")
const tableCreation = require("./tableCreation")

const db = {}

let sequelize = new Sequelize(
  config.db.options.url,
  {dialect: 'postgres'}
)

const tables = tableCreation(sequelize, Sequelize.DataTypes)

for(let table of tables){
  db[table.name] = table
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;