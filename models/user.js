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
      models.user.hasMany(models.emoji); // 1:M relationship with emojis
    }
  }
  user.init(
    {
      uuid: {
        type: DataTypes.STRING,
      },
      discord_id: {
        type: DataTypes.STRING,
      },
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
      expiry: {
        type: DataTypes.BIGINT,
        validate: { isInt: true },
      },
      refresh_token: {
        type: DataTypes.STRING,
      },
      date_visited: {
        type: DataTypes.DATE,
        validate: { isDate: true },
      },
      selected_guild: {
        type: DataTypes.STRING,
      },
      selected_emoji: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'user',
    }
  );
  return user;
};
