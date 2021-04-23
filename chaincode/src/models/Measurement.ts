
import {Object, Property} from 'fabric-contract-api';

/** 
 * Measurement
 */
export default class Measurement {
    public sensorID: string;
    public value: string | number;
    public timestamp: Date;
}