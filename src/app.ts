import express from 'express';
import router from './router';
import uploader from './utils/multer';
import * as OpenApiValidator from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import fs from 'fs';

class App {
  public server: express.Express;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());

    /**
     * * Swagger setups
     */
    const yamlSpecFile = path.resolve(process.cwd(), 'openapi.yml');

    if (fs.existsSync(yamlSpecFile)) {
      const validatorOptions = {
        apiSpec: yamlSpecFile,
        validateRequests: false,
        fileUploader: false,
      };

      this.server.use(OpenApiValidator.middleware(validatorOptions));

      const swaggerDocument = YAML.load(yamlSpecFile);
      this.server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    // error customization, if request is invalid
    this.server.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      res.status(err.status || 500).json({ message: err.message });
    });

    /**
     * * Multer upload endpoints (supports /api/v1/upload, /v1/upload, and /upload for serverless rewrites)
     */
    const uploadHandler = (req: express.Request, res: express.Response, _next: express.NextFunction) => {
      (uploader as any)(req, res, (err: any) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!req.file) return res.status(500).json({ message: 'File is missing' });
        const data: any = { ...req.file };

        return res.json({ frecuencies: data.frecuencies });
      });
    };

    this.server.use('/api/v1/upload/:top', uploadHandler);
    this.server.use('/v1/upload/:top', uploadHandler);
    this.server.use('/upload/:top', uploadHandler);
  }

  routes() {
    this.server.use(router);
  }
}

export default new App().server;