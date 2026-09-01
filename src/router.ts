import express from 'express';
import path from 'path';

const router = express.Router();
const clientDistPath = path.resolve(import.meta.dirname, '../dist');

// react render setups for the client
router.use(express.static(clientDistPath));
router.use(express.static('src/public'));

router.use((_req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

export default router;