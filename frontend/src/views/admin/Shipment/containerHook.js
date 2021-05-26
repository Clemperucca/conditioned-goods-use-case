import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import useFetch from 'use-http';
import {randomColor} from "color.js";

/** 
 * Hook to handle shipment functionalities.
 */
export default function useShipment() {
    const {id} = useParams();
    const {data: shipment} = useFetch(`${process.env.REACT_APP_API_URL}/shipment/${id}`, {}, [id]);
    const {data: measurements} = useFetch(`${process.env.REACT_APP_API_URL}/shipment/${id}/measurements`, {}, [id]);

    const [chartData, setChartData] = useState();

    function orderData(measurements) {
        const groups = {};

        measurements?.sort((date1, data2) => data2.timestamp + date1.timestamp);

        measurements?.forEach(({sensorID, timestamp, value}) => {
            let color = randomColor();
            let group = groups[sensorID] || {label: `Sensor ${sensorID}`, data: [],  backgroundColor: color, borderColor: color, fill: false};
    
            groups[sensorID] = {...group, data: [...group.data, {x: timestamp,y: value}]};
        });

        return Object.values(groups);
  }

  useEffect(() => {
    const chartData = orderData(measurements);

    setChartData(chartData);
  }, [measurements]);

  return {
      shipment, 
      chartData, 
      measurements
    }
}