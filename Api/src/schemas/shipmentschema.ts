import {Schema} from "express-validator";

export const shipmentAddSchema: Schema = {
    id: {
        in: ['body'],
        errorMessage: 'id is required',
        isLength: {
            options: {min: 1},
        },
        trim: true,
    }
}

export const getShipmentSchema: Schema = {
    id: {
        in: ['params'],
        errorMessage: 'id is required',
        isLength: {
            options: {min: 1},
        },
        trim: true,
    }
}

export const shipmentExistsSchema: Schema = {
    id: {
        in: ['params'],
        errorMessage: 'id is required',
        isLength: {
            options: {min: 1},
        },
        trim: true,
    }
}

export const hasSensorSchema: Schema = {
    id: {
        in: ['params'],
        errorMessage: 'id is required',
        isLength: {
            options: {min: 1},
        },
        trim: true,
    },
    sensorID: {
        in: ['params'],
        errorMessage: 'SensorID is required',
        isLength: {
            options: {min: 1},
        },
        trim: true,
    }
}

