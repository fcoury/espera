module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    trackingId: DataTypes.INTEGER,
    location: DataTypes.STRING,
    status: DataTypes.STRING,
    statusAt: DataTypes.DATE
  }, {});
  Event.associate = function(models) {
    models.Event.belongsTo(models.Tracking, { foreignKey: 'trackingId' });
  };
  return Event;
};
