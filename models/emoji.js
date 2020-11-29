'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class emoji extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.emoji.belongsTo(models.user, { foreignKey: 'userId' });
      models.emoji.belongsToMany(models.tag, {
        through: 'emojitags',
        foreignKey: 'emojiId',
      });
    }
  }
  emoji.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      url: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'emoji',
    }
  );
  return emoji;
};
