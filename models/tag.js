'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.tag.belongsToMany(models.emoji, {
        through: 'emojitags',
        foreignKey: 'tagId',
      });
    }
  }
  tag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'tag',
    }
  );
  return tag;
};
