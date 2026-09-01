import app from './app';
import { env } from './schemas/env';

app.listen(env.SERVER_PORT, () => {
  console.info(`Listening on http://localhost:${env.SERVER_PORT}`);
});