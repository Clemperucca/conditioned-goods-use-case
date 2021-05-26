import React from "react";

export default function CardMeasurementTable({title, labels = [], items = [], renderItem}) {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                {title}
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                {labels.map((label) => 
                   <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    {label}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => renderItem(item, i))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
