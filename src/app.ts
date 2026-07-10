import express from 'express';
import router from './router'
import uploader from './utils/multer';
import * as OpenApiValidator from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

class App {
  public server;

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

    const yamlSpecFile = './openapi.yml',
          validatorOptions = {
            apiSpec: yamlSpecFile,
            validateRequests: false,
            fileUploader: false
          }

    this.server.use(OpenApiValidator.middleware(validatorOptions))

    // error customization, if request is invalid
    this.server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {

      res.status(err.status || 500).json({ message: err.message })
    });

    /**
     * * Swagger UI Setup (Serve API documentation page)
     */
    const swaggerDocument = YAML.load(yamlSpecFile);
    this.server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    /**
     * * Multer setups
     */ 

    this.server.use(
      '/api/v1/upload/:top',
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        uploader(req, res, (err: any) => {
          if(err) return res.status(500).json({ message: err.message })
          if(!req.file) return res.status(500).json({ message: "File is missing" })
          const data: any = { ...req.file }

          return res.json({ frecuencies: data.frecuencies })
        })
    })
  }

  routes() {
    this.server.use(router);
  }
}

export default new App().server;