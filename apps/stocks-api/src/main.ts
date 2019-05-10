/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import {environment} from "./environments/environment";
const fetch = require("node-fetch");

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost',
    routes: {
      cors: true
    }
  });

  const getData = async (url) => {
    let response = await fetch(url);
    let data = await response.json()
    return data;
  };

  server.method('getData', getData, {
    cache: {
      expiresIn: 60000,
      generateTimeout: 2000
    }
  });

  server.route({
    path: '/beta/stock/{symbol}/chart/{period}',
    method: 'GET',
    handler: async function (request, h) {
      const { symbol, period } = request.params;
      const token = request.query.token;
      const url = `${environment.apiURL}/beta/stock/${symbol}/chart/${period}?token=${token}`;
      return await server.methods.getData(url);
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
