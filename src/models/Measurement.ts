
import {Object, Property} from 'fabric-contract-api';

/** 
 * Measurement
 */
@Object()
export default class Measurement {
    @Property()
    public name: string; 

    @Property()
    public value: string;
}