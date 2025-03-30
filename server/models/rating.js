module.exports = (sequelize, DataTypes) => {
    return sequelize.define('rating', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      rating: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, { underscored: true });
  };