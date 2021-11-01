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

/** 
 * Pagination type.
 */
export type Pagination<T> = {
    result: Array<T>;
    count: number;
    bookmark: string;
}