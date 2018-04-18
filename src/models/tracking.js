module.exports = (sequelize, DataTypes) => {
  const Tracking = sequelize.define('Tracking', {
    code: DataTypes.STRING
  }, {});
  Tracking.associate = function(models) {
    models.Tracking.hasMany(models.Event, { foreignKey: 'trackingId' });
  };
  return Tracking;
};
