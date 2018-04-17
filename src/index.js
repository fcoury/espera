const rp = require('request-promise');
const cheerio = require('cheerio');

const correios = require('./correios');

class Server {
  constructor(app) {
    this.app = app;
  }

  addRoutes() {
    this.app.get('/track/:code', this.track.bind(this));
  }

  track(req, res) {
    const { code } = req.params;
    correios.track(code).then(json => res.json(json));
  }
}

module.exports = Server;
