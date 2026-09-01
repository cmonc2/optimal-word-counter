import app from './app.js';
import { env } from './schemas/env.js';

app.listen(env.SERVER_PORT, () => {
  console.info(`Listening on http://localhost:${env.SERVER_PORT}`);
});