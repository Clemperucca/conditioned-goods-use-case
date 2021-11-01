import {Context, Contract} from 'fabric-contract-api';
import Shipment from '../models/Shipment';
import {toBytes, toObject, toJson, toArrayOfObjects} from '../libs/helpers';

/** 
 * Handles the shipments in the ledger. 
 * Note: removed ts annotations because they currently do not allow nested objects.
 */
export class ShipmentContract extends Contract {
    /** 
     * Add a shipment to the ledger.
     */
    public async addShipment(ctx: Context, id: string) {

        if (await this.shipmentExist(ctx, id)) {
            throw new Error("Shipment with this id does already exist.");
        }

        const shipment: Shipment = {
            id,
            sensors: [],
            createdAt: Date.now(),
        }

        // Submit data to the ledger.
        await ctx.stub.putState(id, toBytes<Shipment>(shipment));

        return shipment;
    }

    // TODO: extends this methode when we know more about the content of a shipment.
    /** 
     * Update shipment in the ledger.
     */
    public async updateShipment(ctx: Context, id: string) {
        const shipment = await this.getShipment(ctx, id);

        // TODO: set values we want to change.
        await ctx.stub.putState(id, toBytes<Shipment>(shipment));

        return shipment;
    }

    /** 
     * Get shipment from ledger. 
     */
    public async getShipment(ctx: Context, id: string) {
        const shipment = await ctx.stub.getState(id); 

        if (!(shipment && shipment.length > 0)) {
            throw new Error(`Shipment with this id does not exist.`);
        }

        return toObject<Shipment>(shipment);
    }

    /** 
     * Check if shipment exist
     */
    public async shipmentExist(ctx: Context, id: string) {
        const shipment = await ctx.stub.getState(id);

        // Note: optional channing is not possible (probably because it is not complied right).
        return shipment && shipment.length > 0;
    }

    /** 
     * Get all shipments from the ledger
     * Note: the bookmark will be included in the results.
     */
    public async getShipments(ctx: Context, index: string, amount: string) {
        // Query all data in the ledger.
        const {iterator, metadata} = await ctx.stub.getStateByRangeWithPagination('', '', parseInt(amount), index);
        const shipments = await toArrayOfObjects<Shipment>(iterator);

        return {
            result: shipments,
            count: metadata.fetchedRecordsCount,
            bookmark: metadata.bookmark,
        };
    }

    /** 
     * Register sensor on a shipment
     */
    public async registerSensor(ctx: Context, id: string, sensorID: string) {
        const shipment = await this.getShipment(ctx, id);

        if (shipment.sensors.includes(sensorID)) {
            throw new Error("Sensor is already registered to this shipment.")
        }

        shipment.sensors = [...shipment.sensors, sensorID];

        await ctx.stub.putState(id, toBytes<Shipment>(shipment));

        return sensorID;
    }

    /** 
     * Check if sensor is registered in a shipment.
     */
    public async sensorIsRegistered(ctx: Context, id: string, sensorID: string) {
        const shipment = await this.getShipment(ctx, id);

        return shipment.sensors.includes(sensorID);
    }

    /** 
     * Get shipments by sensorID.
     */
    public async getShipmentBySensor(ctx: Context, id: string) {
        const query = {
            selector: {
                sensors: {
                    $elemMatch: {
                        $eq: id
                    }
                }
            },
            sort: [{createdAt: "desc"}],
        };

        const iterator = await ctx.stub.getQueryResult(toJson(query));
        const shipments = await toArrayOfObjects<Shipment>(iterator);

        if (!(shipments && shipments.length > 0)) {
            throw new Error("Sensor is not registered to a shipment");
        }

        return shipments[0];
    }

    // TODO: look at more search options like sensorID or creation date. 
    /** 
     * Get shipments by searchString.
     */
    public async getShipmentBySearchString(ctx: Context, string: string, index: string, amount: string) {
        const query = {
            selector: {
                id: {
                    $regex: string,
                },
            },
            sort: [{createdAt: "desc"}],
        }

        const {iterator, metadata} = await ctx.stub.getQueryResultWithPagination(toJson(query), parseInt(amount), index);
        const shipments = await toArrayOfObjects<Shipment>(iterator);

        return {
            result: shipments,
            count: metadata.fetchedRecordsCount,
            bookmark: metadata.bookmark,
        };
    }
}