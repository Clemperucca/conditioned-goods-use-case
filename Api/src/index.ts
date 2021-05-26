import express, {Request, Response} from "express";
import {validationResult} from "express-validator";
import cors from 'cors';
import dotenv from 'dotenv';
import {checkSchema} from 'express-validator';
import {routeTypes, routeResolver} from './routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

for (const [key, value] of Object.entries(routeResolver)) {
    const {type, schema = {}, func} = value;

    app[type](key, checkSchema(schema), (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()){
          return res.status(400).json({
            errors: errors.array()
          });
        }

        func(req, res);
    });
}

// start the Express server.
app.listen(process.env.PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`🚀 Server ready on http://localhost:`+process.env.PORT+` !`)
});

export default app;