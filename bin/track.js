const correios = require('../src/correios');

correios.track(process.argv[2]).then(json => console.log('json', json));
