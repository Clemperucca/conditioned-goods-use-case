import {Schema} from "express-validator";

export const getHistorySchema: Schema = {
    id: {
        in: ['params'],
        errorMessage: 'id is required',
        isLength: {
            options: {min: 1},
        },
        trim: true,
    }
}

export const getMeasurementSchema: Schema = {
    id: {
        in: ['params'],
        errorMessage: 'id is required',
        isLength: {
            options: {min: 1},
        },
        trim: true,
    }
}

export const addMeasurementSchema: Schema = {
    id: {
        in: ['body'],
        errorMessage: 'id is required',
        isLength: {
            options: {min: 1},
        },
        trim: true,
    },
    sensorID: {
        in: ['body'],
        errorMessage: 'SensorID is required',
        isLength: {
            options: {min: 1},
        },
        trim: true,
    },
    value: {
        in: ['body'],
        errorMessage: 'value should be an INT',
        isInt: true,
        toInt: true,
    }
}