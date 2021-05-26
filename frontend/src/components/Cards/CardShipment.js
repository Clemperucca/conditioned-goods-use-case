import React from 'react';
import {DateTime} from 'luxon';

export default function CardShipment({shipment}) {
  return (
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h2 className="text-blueGray-700 text-xl font-semibold">
                Shipment
              </h2>
            </div>
          </div>
        </div>
        <div className="p-4 pt-6 flex flex-col items-center mb-4">
          <div className="flex mb-4">
            <p className="text-6xl text-black font-medium">{shipment?.temperature?.value || 0}</p>
            <p className="font-medium">°C</p>
          </div>
          <p className="text-gray-500">Last temperature</p>
        </div>
        <div className="p-4">
          <div className="py-2">
            <p className="font-medium">Shipment ID</p>
            <p>#{shipment?.id}</p>
          </div>
          <div className="py-2">
            <p className="font-medium">Sensors</p>
            <p>{shipment?.sensors.length || '-'}</p>
          </div>
          <div className="py-2">
            <p className="font-medium">Creation date</p>
            <p>{DateTime.fromMillis(shipment?.createdAt || 0).toFormat("dd-MM-yyyy HH:mm:ss")}</p>
          </div>
        </div>
      </div>
  );
}