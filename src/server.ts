import express, { request, response } from 'express';

import routes from './routes/index';

const app = express();

app.use(express.json());

app.use(routes);

app.get('/', (request, response) => {
  return response.json({ message: 'Hello World' });
});

app.listen(3333, () => {
  console.log('🚀 server started on port 3333');
});
