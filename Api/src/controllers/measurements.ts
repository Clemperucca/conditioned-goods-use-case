import {Request, Response} from "express";
import {connect} from '../gateway';
import {toObject} from '../helpers';
import {Measurement, Shipment} from '../types';

/**
 * Get History
 */
 export async function getHistory({params}: Request, res: Response) {
    const {id} = params;
    const gateway = await connect();
  
    try {
      // Get channel
      const network = await gateway.getNetwork('mychannel');
  
      // Get contract
      const contract = network.getContract('blockchain-backend', 'MeasurementContract');
  
      // Query data
      const result = await contract.evaluateTransaction('GetHistory', `${id}`);
  
      res.json(toObject<Measurement>(result));
    } catch(err) {
      console.log(err);
    } finally {
      gateway.disconnect();
    }
  }

/**
 * Get Measurement
 */
  export async function getMeasurement({params}: Request, res: Response) {
    const {id} = params;
    const gateway = await connect();
  
    try {
      // Get channel
      const network = await gateway.getNetwork('mychannel');
  
      // Get contract
      const contract = network.getContract('blockchain-backend', 'MeasurementContract');
  
      // Query data
      const result = await contract.evaluateTransaction('GetMeasurement', `${id}`);
  
      res.json(toObject<Measurement>(result));
    } catch(err) {
      console.log(err);
    } finally {
      gateway.disconnect();
    }
  }

  /**
 * Add Measurement
 */
   export async function addMeasurement({body}: Request, res: Response) {
    const {id, sensorID, value} = body;
    const gateway = await connect();
  
    try {
      // Get channel
      const network = await gateway.getNetwork('mychannel');
  
      // Get contract
      const contract = network.getContract('blockchain-backend', 'MeasurementContract');
  
      // Query data
      const result = await contract.submitTransaction('AddMeasurement', `${id}`,`${sensorID}`, `${value}`);
  
      res.json(toObject<Shipment>(result));
    } catch(err) {
      console.log(err);
    } finally {
      gateway.disconnect();
    }
  }


