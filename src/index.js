const rp = require('request-promise');
const cheerio = require('cheerio');
const moment = require('moment');

const correios = require('./correios');
const models = require('./models');

class Server {
  constructor(app) {
    this.app = app;
  }

  initialize() {
    this.addRoutes();
  }

  addRoutes() {
    this.app.get('/track/:code', this.track.bind(this));
  }

  handleError(res) {
    return (err) => {
      res.status(500).json(err);
    };
  }

  track(req, res) {
    const { code } = req.params;
    correios.track(code).then(events => {
      if (!events.length) {
        return res.status(404).json({ error: 'Tracking não encontrado' });
      }


      models.Tracking
        .findOrCreate({ where: { code } })
        .spread((tracking, created) => {

          models.Event.destroy({ where: { trackingId: tracking.id } }).then(_ => {
            const promises = events.map(event => {
              const statusAt = moment(`${event.date} ${event.time}`, 'DD/MM/YYYY kk:mm')
              const data = {
                trackingId: tracking.id,
                statusAt,
                location: event.location,
                status: event.status,
              };
              return models.Event.create(data);
            });

            Promise.all(promises).then(_ => {
              res.json(events);
            }, this.handleError(res)).catch(this.handleError(res));
          }, this.handleError(res)).catch(this.handleError(res));
        });
    });
  }
}

module.exports = Server;
