import {ShipmentContract} from './contracts/ShipmentContract';
export {ShipmentContract} from './contracts/ShipmentContract';
import {MeasurementContract} from './contracts/MeasurementContract';
export {MeasurementContract} from './contracts/MeasurementContract';
import dotenv from "dotenv";

dotenv.config();

export const contracts = [ShipmentContract, MeasurementContract];