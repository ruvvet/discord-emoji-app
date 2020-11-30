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
      models.emoji.belongsTo(models.user, { foreignKey: 'userId' }); // 1:M relationship with users. Users can create many emojis but each belongs to 1 user
      models.emoji.belongsToMany(models.tag, {
        through: 'emojitags',
        foreignKey: 'emojiId',
      }); // M:N relationship with tags
    }
  }
  emoji.init(
    {
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
