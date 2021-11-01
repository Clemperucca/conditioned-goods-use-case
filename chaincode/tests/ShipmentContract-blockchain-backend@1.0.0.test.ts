import * as fabricNetwork from 'fabric-network';
import {SmartContractUtil} from './ts-smart-contract-util';

import * as os from 'os';
import * as path from 'path';

import {toObject} from '../src/libs/helpers';
import Shipment from '../src/models/Shipment';
import PaginationResponse from '../src/models/PaginationResponse';

describe('ShipmentContract-blockchain-backend@1.0.0' , () => {
    const homedir: string = os.homedir();
    const walletPath: string = path.join(homedir, '.fabric-vscode', 'v2', 'environments', 'blockchain', 'wallets', 'Org1');
    const gateway: fabricNetwork.Gateway = new fabricNetwork.Gateway();
    let fabricWallet: fabricNetwork.Wallet;
    const identityName: string = 'Org1 Admin';
    let connectionProfile: any;

    beforeAll(async () => {
        connectionProfile = await SmartContractUtil.getConnectionProfile();
        fabricWallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);
    });

    beforeEach(async () => {
        const discoveryAsLocalhost: boolean = SmartContractUtil.hasLocalhostURLs(connectionProfile);
        const discoveryEnabled: boolean = true;

        const options: fabricNetwork.GatewayOptions = {
            discovery: {
                asLocalhost: discoveryAsLocalhost,
                enabled: discoveryEnabled,
            },
            identity: identityName,
            wallet: fabricWallet,
        };

        await gateway.connect(connectionProfile, options);
    });

    afterEach(async () => {
        gateway.disconnect();
    });

    describe('AddShipment', () => {
        it('should submit AddShipment transaction', async () => {
            const response: Buffer = await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['1'], gateway);

            const shipment = toObject<Shipment>(response);

            // Match to this object since we cannot predict the timestamp.
            const expected = {
                id: '1',
                sensors: [],
            }

            expect(shipment).toMatchObject(expected);
        });
    });

    describe('UpdateShipment', () => {
        it('should submit UpdateShipment transaction', async () => {
            // Add shipment
            await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['2'], gateway);

            const response: Buffer = await SmartContractUtil.submitTransaction('ShipmentContract', 'updateShipment', ['2'], gateway);
            
            const shipment = toObject<Shipment>(response);

            // Match to this object since we cannot predict the timestamp.
            const expected = {
                id: '2',
                sensors: [],
            }

            expect(shipment).toMatchObject(expected);
        });
    });

    describe('GetShipment', () => {
        it('should submit GetShipment transaction', async () => {
            // Add shipment
            await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['3'], gateway);

            const response: Buffer = await SmartContractUtil.evaluateTransaction('ShipmentContract', 'getShipment', ['3'], gateway);
            
            const shipment = toObject<Shipment>(response);

            // Match to this object since we cannot predict the timestamp.
            const expected = {
                id: '3',
                sensors: [],
            }

            expect(shipment).toMatchObject(expected);
        });
    });

    describe('ShipmentExist', () => {
        it('should evaluate ShipmentExist transaction', async () => {
            // Add shipment
            await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['4'], gateway);

            const response: Buffer = await SmartContractUtil.evaluateTransaction('ShipmentContract', 'shipmentExist', ['4'], gateway);

            const exist = toObject<boolean>(response);

            expect(exist).toEqual(true);
        });
    });

    describe('GetShipments', () => {
        it('should submit GetShipments transaction', async () => {
            // Add shipment
            await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['5'], gateway);

            const response: Buffer = await SmartContractUtil.evaluateTransaction('ShipmentContract', 'getShipments', ["", "50"], gateway);
            
            const shipments = toObject<PaginationResponse<Shipment>>(response);

            const expected = {
                id: '5',
                sensors: [],
            };

            expect(shipments.result).toEqual(
                expect.arrayContaining([expect.objectContaining(expected)])
            )
        });
    });

    describe('GetShipmentsBySensorID', () => {
        it('should return the latest shipment of the attached sensor', async () => {
            // Add shipment
            await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['11'], gateway);
        
            // Add Sensor
            await SmartContractUtil.submitTransaction('ShipmentContract', 'registerSensor', ['11', '999'], gateway);

            const response: Buffer = await SmartContractUtil.evaluateTransaction('ShipmentContract', 'getShipmentBySensor', ['999'], gateway);

            const shipment = toObject<Shipment>(response);

            const expected = {
                id: '11',
                sensors: ["999"],
            };

           
            expect(shipment).toMatchObject(expected);
        });
    });

     describe('getShipmentBySearchString', () => {
        it('Should return the sensor with the given id', async () => {
            // Add shipment
            await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['12'], gateway);

            const response: Buffer = await SmartContractUtil.evaluateTransaction('ShipmentContract', 'getShipmentBySearchString', ['12', '', '1'], gateway);

            const shipments = toObject<PaginationResponse<Shipment>>(response);

            const expected = {
                id: '12',
                sensors: [],
            };

             expect(shipments.result).toEqual(
                expect.arrayContaining([expect.objectContaining(expected)])
            )
        });
    });

    describe('RegisterSensor', () => {
        it('should submit RegisterSensor transaction', async () => {
            // Add shipment
            await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['13'], gateway);

            const response: Buffer = await SmartContractUtil.submitTransaction('ShipmentContract', 'registerSensor', ['13', 'fuu34hf'], gateway);
            
            const hasRegistered = response.toString();

            expect(hasRegistered).toEqual('fuu34hf');
        });
    });

    describe('HasSensor', () => {
        it('should submit HasSensor transaction', async () => {
            // Add shipment
            await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['14'], gateway);

            // Add Sensor
            await SmartContractUtil.submitTransaction('ShipmentContract', 'registerSensor', ['14', '1'], gateway);

            const response: Buffer = await SmartContractUtil.evaluateTransaction('ShipmentContract', 'sensorIsRegistered', ['14', '1'], gateway);
            
            const hasSensor = toObject<boolean>(response);

            expect(hasSensor).toEqual(true);
        });
    });
});
