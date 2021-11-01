import {Request, Response} from "express";
import {connect} from '../gateway';
import {toObject} from '../helpers';
import {Shipment, Pagination} from '../types';

/**
 * Get shipments.
 */
export async function getShipments({params}: Request, res: Response) {
  const {index = "", amount = 50} = params;
  const gateway = await connect();

  try {
    // Get channel
    const network = await gateway.getNetwork(process.env.CHANNELNAME);

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.evaluateTransaction('getShipments', `${index}`, `${amount}`);

    res.json(toObject<Pagination<Shipment>>(result));
  } catch({message}) {
    // TODO: An error logger like sentry would be nice.
    res.status(500).json({error: message});
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
    const network = await gateway.getNetwork(process.env.CHANNELNAME);

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.evaluateTransaction('getShipment', `${id}`);

    res.json(toObject<Shipment>(result));
  } catch({message}) {
    res.status(500).json({error: message});
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
    const network = await gateway.getNetwork(process.env.CHANNELNAME);

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.evaluateTransaction('shipmentExist', `${id}`);

    res.json(toObject<boolean>(result));
  } catch({message}) {
    res.status(500).json({error: message});
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
    const network = await gateway.getNetwork(process.env.CHANNELNAME);

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.evaluateTransaction('sensorIsRegistered', `${id}`,`${sensorID}`);

    res.json(toObject<boolean>(result));
  } catch({message}) {
    res.status(500).json({error: message});
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
    const network = await gateway.getNetwork(process.env.CHANNELNAME);

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.submitTransaction('addShipment', `${id}`);

    res.json(toObject<Shipment>(result));
  } catch({message}) {
    res.status(500).json({error: message});
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
    const network = await gateway.getNetwork(process.env.CHANNELNAME);

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.submitTransaction('registerSensor', `${id}`, `${sensorID}`);

    res.json(result.toString());
  } catch({message}) {
    res.status(500).json({error: message});
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
    const network = await gateway.getNetwork(process.env.CHANNELNAME);

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.submitTransaction('updateShipment', `${id}`);

    res.json(toObject<Shipment>(result));
  } catch({message}) {
    res.status(500).json({error: message});
  } finally {
    gateway.disconnect();
  }
}

/**
 * Search shipment by string.
 */
export async function getShipmentBySearchString({params}: Request, res: Response) {
  const {searchString = "", index = "", amount = 50} = params;

  const gateway = await connect();

  try {
     // Get channel
    const network = await gateway.getNetwork(process.env.CHANNELNAME);

    // Get contract
    const contract = network.getContract('blockchain-backend');

    // Query data
    const result = await contract.submitTransaction('getShipmentBySearchString', `${searchString}`, `${index}`, `${amount}`);

    res.json(toObject<Pagination<Shipment>>(result));
  } catch({message}) {
    res.status(500).json({error: message});
  } finally {
    gateway.disconnect();
  }
}