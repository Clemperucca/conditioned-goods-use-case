import {Context, Contract} from 'fabric-contract-api';
import Measurement from '../models/Measurement';
import Shipment from '../models/Shipment';
import {ShipmentContract} from './ShipmentContract';
import {toBytes, toObject, toArrayOfObjects} from '../libs/helpers';
import SLA from '../SLA.json';
import {isInRange} from '../libs/validate';
import {sendMail} from '../libs/mail';
import {getHtml, getText} from '../mails/temperature';

/** 
 * Handles the measurements in the shipments. 
 * Note: removed ts annotations because they currently do not allow nested objects.
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
     * NOTE: it's currently not possible to use pagination on the history query (https://jira.hyperledger.org/browse/FAB-12881, https://jira.hyperledger.org/browse/FAB-12183)
     */
    public async getHistory(ctx: Context, id: string) {
        const iterator = await ctx.stub.getHistoryForKey(id);
        const shipments = await toArrayOfObjects<Shipment>(iterator);

        // Map through the shipment history and get the temperature values.
        return shipments.filter(({temperature}) => temperature).map(({temperature}) => temperature);
    }

    /** 
     * Add a measurement to a shipment.
     * NOTE: timestamp is the amount of milliseconds since 1970 (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_ecmascript_epoch_and_timestamps)
     */
    public async addMeasurement(ctx: Context, sensorID: string, value: string, timestamp: string) {
        let shipment: Shipment = await this.shipmentContract.getShipmentBySensor(ctx, sensorID);
        let temperature = parseInt(value);
        let date = parseInt(timestamp);

        if (!await this.validateSLA(ctx, shipment.id, temperature)) {
            await sendMail(`Shipment #${shipment.id}`, getText(shipment.id, value), getHtml(shipment.id, value));
        }

        shipment.temperature = {
            value: temperature,
            sensorID,
            timestamp: date,
        };

        await ctx.stub.putState(shipment.id, toBytes<Shipment>(shipment));

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