import express, {Request, Response} from "express";
import {validationResult} from "express-validator";
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import {checkSchema} from 'express-validator';
import {routeTypes, routeResolver} from './routes';

// Register .env file.
dotenv.config();

// New instance of express.
export const app = express();

// Parse request to json.
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(cors({
  origin: process.env.ORIGIN
}));

// Loop through all the routes
for (const [key, value] of Object.entries(routeResolver)) {
    const {type, schema = {}, func} = value;

    // Get the function assosiated with the type of the request from the app object.
    // And register the assosiated route, shema and function in express.
    app[type](key, checkSchema(schema), (req: Request, res: Response) => {
        // Validate schema.
        const errors = validationResult(req);

        // Check if validation returned errors, if it has return them with an error code.
        if (!errors.isEmpty()){
          return res.status(400).json({
            errors: errors.array()
          });
        }

        // call the assosiated route function. 
        func(req, res);
    });
}