module.exports = (sequelize, DataTypes) => {
    return sequelize.define('cart', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    });
  };