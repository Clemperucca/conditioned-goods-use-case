import * as assert from 'assert';
import * as fabricNetwork from 'fabric-network';
import { SmartContractUtil } from './ts-smart-contract-util';

import * as os from 'os';
import * as path from 'path';

import {toObject} from '../src/helpers';
import Measurement from '../src/models/Measurement';
import Shipment from '../src/models/Shipment';

describe('MeasurementContract-blockchain-backend@1.0.0' , () => {
    const homedir: string = os.homedir();
    const walletPath: string = path.join(homedir, '.fabric-vscode', 'v2', 'environments', 'blockchain', 'wallets', 'Org1');
    const gateway: fabricNetwork.Gateway = new fabricNetwork.Gateway();
    let fabricWallet: fabricNetwork.Wallet;
    const identityName: string = 'Org1 Admin';
    let connectionProfile: any;

    beforeAll(async () => {
        connectionProfile = await SmartContractUtil.getConnectionProfile();
        fabricWallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

        jest.setTimeout(10000);
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

    describe('AddMeasurement', () => {
        it('should submit AddMeasurement transaction', async () => {
            // Add shipment
            await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['7'], gateway);
            
            // Register sensor
            await SmartContractUtil.submitTransaction('ShipmentContract', 'registerSensor', ['7','1'], gateway);

            const response: Buffer = await SmartContractUtil.submitTransaction('MeasurementContract', 'addMeasurement', ['7', '1', '-10', `${new Date()}`], gateway);
            
            const measurement = toObject<Measurement>(response);

            // Match it to this object, since we cannot predict the timstamp.
            const expected = {
                sensorID: "1",
                value: -10,
            } 

             expect(measurement).toMatchObject(expected);
        });
    });

    describe('GetMeasurement', () => {
        it('should submit GetMeasurement transaction', async () => {
            // Add shipment
            await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['8'], gateway);

            // Register sensor
            await SmartContractUtil.submitTransaction('ShipmentContract', 'registerSensor', ['8','1'], gateway);

            // Add measurement
            await SmartContractUtil.submitTransaction('MeasurementContract', 'addMeasurement', ['8', '1', '-10', `${new Date()}`], gateway);

            const response: Buffer = await SmartContractUtil.evaluateTransaction('MeasurementContract', 'getMeasurement', ['8'], gateway);
            const measurement = toObject<Measurement>(response);

            // Match it to this object, since we cannot predict the timstamp.
            const expected = {
                sensorID: "1",
                value: -10,
            } 

            expect(measurement).toMatchObject(expected);
        });
    });

    describe('GetHistory', () => {
        it('should submit GetHistory transaction', async () => {
            // Add shipment
            await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['9'], gateway);

            // Register sensor
            await SmartContractUtil.submitTransaction('ShipmentContract', 'registerSensor', ['9','1'], gateway);

            // Add measurement
            await SmartContractUtil.submitTransaction('MeasurementContract', 'addMeasurement', ['9', '1', '-10', `${new Date()}`], gateway);

            // Add second measurement
            await SmartContractUtil.submitTransaction('MeasurementContract', 'addMeasurement', ['9', '1', '-8', `${new Date()}`], gateway);

            const response: Buffer = await SmartContractUtil.evaluateTransaction('MeasurementContract', 'getHistory', ['9'], gateway);
            
            const measurement = toObject<Array<Measurement>>(response);

            const expected1 = {
                sensorID: "1",
                value: -10,
            };
            const expected2 = {
                sensorID: "1",
                value: -8,
            }
            
            expect(measurement).toContainEqual(expect.objectContaining(expected1));
            expect(measurement).toContainEqual(expect.objectContaining(expected2));
        });
    });

    describe('ValidateSLA', () => {
        it('should validate the SLA to be true', async () => {
            // Add shipment
            await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['10'], gateway);

            // Register sensor
            await SmartContractUtil.submitTransaction('ShipmentContract', 'registerSensor', ['10','1'], gateway);

            // Add measurement
            await SmartContractUtil.submitTransaction('MeasurementContract', 'addMeasurement', ['10', '1', '-10', `${new Date()}`], gateway);

            const response: Buffer = await SmartContractUtil.evaluateTransaction('MeasurementContract', 'validateSLA', ['10', '-9'], gateway);
            
            const isValid = toObject<boolean>(response);

            expect(isValid).toBe(true);
        });

        it('should validate the SLA to be false', async () => {
            // Add shipment
            await SmartContractUtil.submitTransaction('ShipmentContract', 'addShipment', ['10'], gateway);

            // Register sensor
            await SmartContractUtil.submitTransaction('ShipmentContract', 'registerSensor', ['10','1'], gateway);

            // Add measurement
            await SmartContractUtil.submitTransaction('MeasurementContract', 'addMeasurement', ['10', '1', '-10', `${new Date()}`], gateway);

            const response: Buffer = await SmartContractUtil.evaluateTransaction('MeasurementContract', 'validateSLA', ['10', '500'], gateway);
            
            const isValid = toObject<boolean>(response);

            expect(isValid).toBe(false);
        });
    });
});
