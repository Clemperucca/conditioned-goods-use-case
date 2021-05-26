import {Object, Property} from 'fabric-contract-api';
import Measurement from './Measurement';

/** 
 * Shipment
 */
export default class Shipment {
    public id: string; 
    public temperature?: Measurement;
    public sensors: Array<string>;
    public createdAt: number;
}