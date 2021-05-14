/**
 * Measurement type.
 */
export type Measurement = {
    sensorID: string;
    value: string | number;
    timestamp: Date;
}

/**
 * Shipment type.
 */
export type Shipment = {
    id: string;
    temperature?: Measurement;
    sensors: string[];
};