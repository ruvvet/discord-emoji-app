'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.hasMany(models.emoji);
    }
  }
  user.init(
    {
      username: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      access_token: {
        type: DataTypes.STRING,
      },
      expires_in: {
        type: DataTypes.INTEGER,
        validate: { isInt: true },
      },
      refresh_token: {
        type: DataTypes.STRING,
      },
      date_visited: {
        type: DataTypes.DATE,
        validate: { isDate: true },
      },
    },
    {
      sequelize,
      modelName: 'user',
    }
  );
  return user;
};
