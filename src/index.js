const rp = require('request-promise');
const cheerio = require('cheerio');

class Server {
  constructor(app) {
    this.app = app;
  }

  addRoutes() {
    this.app.get('/track/:code', this.track.bind(this));
  }

  track(req, res) {
    const { code } = req.params;
    const formData = { objetos: code };

    rp({
      method: 'POST',
      uri: 'http://www2.correios.com.br/sistemas/rastreamento/newprint.cfm',
      formData,
    }).then(html => {
      const $ = cheerio.load(html);
      const trackingEls = $('.listEvent').find('tr');
      const rows = [];
      trackingEls.map((key, el) => {
        const el$ = $(el);
        const cols = el$.find('td');
        const data = []
        cols.map((key, colEl) => {
          const text = $(colEl).text().replace(/\n|\r|\t/g, '').trim();
          data.push(text);
        });
        const details = data[0].split(/\s\s+/g);
        rows.push({
          status: data[1],
          date: details[0],
          time: details[1],
          location: details[2],
        });
      });
      res.json(rows);
    });
  }
}

module.exports = Server;
