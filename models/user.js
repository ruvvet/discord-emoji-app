'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    access_token: DataTypes.STRING,
    expires_in: DataTypes.INTEGER,
    refresh_token: DataTypes.STRING,
    date_visited: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};