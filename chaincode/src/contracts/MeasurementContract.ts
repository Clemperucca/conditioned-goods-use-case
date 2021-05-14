import {Context, Contract} from 'fabric-contract-api';
import Measurement from '../models/Measurement';
import Shipment from '../models/Shipment';
import {ShipmentContract} from './ShipmentContract';
import {toBytes, toObject, toArrayOfObjects} from '../helpers';
import SLA from '../SLA.json';
import {isInRange} from '../validate';
import {sendMail} from '../mail';
import {getHtml, getText} from '../mails/temperature';

// Note: removed ts annotations because they currently do not allow nested objects.
/** 
 * Handles the measurements in the shipments. 
 */
export class MeasurementContract extends Contract {
    private shipmentContract: ShipmentContract;

    /** 
     * Constructor
     */
    constructor() {
        super();

        // Make an instance of the ShipmentContract to make the methods inside available.
        this.shipmentContract = new ShipmentContract();
    }


    /** 
     * Get a measurement from a shipment.
     */
    public async getMeasurement(ctx: Context, id: string) {
        const shipment: Shipment = await this.shipmentContract.getShipment(ctx, id);
        return shipment.temperature;
    }

    /** 
     * Get measurement history
     */
    public async getHistory(ctx: Context, id: string) {
        const iterator = ctx.stub.getHistoryForKey(id);
        const shipments = await toArrayOfObjects<Shipment>(iterator);

        // Map through the shipment history and get the temperature values.
        return shipments.filter(({temperature}) => temperature).map(({temperature}) => temperature);
    }

    /** 
     * Add a measurement to a shipment.
     */
    public async addMeasurement(ctx: Context, id: string, sensorID: string, value: string, timestamp: string) {
        let shipment: Shipment = await this.shipmentContract.getShipment(ctx, id);
        let temperature = parseInt(value);
        let date = Date.parse(timestamp);

        if (!shipment.sensors.includes(sensorID)) {
            throw new Error(`Sensor is not registered to this shipment.`);
        }

        if (!await this.validateSLA(ctx, id, temperature)) {
            await sendMail(`Shipment #${id}`, getText(id, value), getHtml(id, value));
        }

        shipment.temperature = {
            value: temperature,
            sensorID,
            timestamp: date,
        };

        await ctx.stub.putState(id, toBytes<Shipment>(shipment));

        return shipment.temperature;
    }

    /** 
     * Validate SLA
     */
    private async validateSLA(ctx: Context, id: string, newValue: number) {
        const temp = await this.getMeasurement(ctx, id);
        const minTemp = SLA.temperature.min;
        const maxTemp = SLA.temperature.max;
        
        if (!isInRange(newValue, minTemp, maxTemp)) {
            // Temp value should always be an number.
            if (!temp || temp && isInRange(temp.value as number, minTemp, maxTemp)) {
                return false;
            }
        }

        return true;
    }
}