import {Request, Response} from "express";
import {connect} from '../gateway';
import {toObject} from '../helpers';
import {Shipment} from '../types';

/**
 * Get shipments.
 */
export async function getShipments(req: Request, res: Response) {
    const gateway = await connect();

    try {
      // Get channel
      const network = await gateway.getNetwork('mychannel');

      // Get contract
      const contract = network.getContract('blockchain-backend');

      // Query data
      const result = await contract.evaluateTransaction('getShipments');

      res.json(toObject<Shipment>(result));
    } catch(err) {
      // TODO: An error logger like sentry would be nice.
      console.log(err);
    } finally {
      gateway.disconnect();
    }
}

/**
 * Get shipment.
 */
 export async function getShipment({params}: Request, res: Response) {
  const {id} = params;
  const gateway = await connect();

  try {
    // Get channel
    const network = await gateway.getNetwork('mychannel');

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.evaluateTransaction('getShipment', `${id}`);

    res.json(toObject<Shipment>(result));
  } catch(err) {
    console.log(err);
  } finally {
    gateway.disconnect();
  }
}

/**
 * Checks if shipment exists
 */
 export async function shipmentExist({params}: Request, res: Response) {
  const {id} = params;
  const gateway = await connect();

  try {
    // Get channel
    const network = await gateway.getNetwork('mychannel');

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.evaluateTransaction('shipmentExists', `${id}`);

    res.json(toObject<boolean>(result));
  } catch(err) {
    console.log(err);
  } finally {
    gateway.disconnect();
  }
}

/**
 *  Checks if shipment has a sensor
 */
 export async function hasSensor({params}: Request, res: Response) {
  const {id, sensorID} = params;
  const gateway = await connect();

  try {
    // Get channel
    const network = await gateway.getNetwork('mychannel');

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.evaluateTransaction('hasSensor', `${id}`,`${sensorID}`);

    res.json(toObject<boolean>(result));
  } catch(err) {
    console.log(err);
  } finally {
    gateway.disconnect();
  }
}

/**
 * Add shipment
 */
 export async function addShipment({body}: Request, res: Response) {
  const {id} = body;
  const gateway = await connect();

  try {
    // Get channel
    const network = await gateway.getNetwork('mychannel');

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.submitTransaction('addShipment', `${id}`);

    res.json(toObject<Shipment>(result));
  } catch(err) {
    console.log(err);
  } finally {
    gateway.disconnect();
  }
}

/**
 * Registers sensor
 */
 export async function registerSensor({body}: Request, res: Response) {
  const {id, sensorID} = body;
  const gateway = await connect();

  try {
    // Get channel
    const network = await gateway.getNetwork('mychannel');

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.submitTransaction('registerSensor', `${id}`, `${sensorID}`);

    res.json(toObject<boolean>(result));
  } catch(err) {
    console.log(err);
  } finally {
    gateway.disconnect();
  }
}

/**
 * Update shipment
 */
 export async function updateShipment({body}: Request, res: Response) {
  const {id} = body;
  const gateway = await connect();

  try {
    // Get channel
    const network = await gateway.getNetwork('mychannel');

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.submitTransaction('updateShipment', `${id}`);

    res.json(toObject<Shipment>(result));
  } catch(err) {
    console.log(err);
  } finally {
    gateway.disconnect();
  }
}