
import supertest from 'supertest';
import {app} from '../src/index';

describe('Measurement controller', () =>  {
    const request = supertest(app);

    describe("Add measurement", () => {
        it("/shipment/measurement/add", async () => {
            let timestamp = Date.now();

            const expected = {
                sensorID: '1',
                value: -25,
                timestamp,
            };

            await request.post('/shipment/add')
                .send({
                    id: '12'
                });

            await request.post('/shipment/sensor/add')
                .send({
                    id: "12",
                    sensorID: "1"
                });

            const {body} = await request.post('/shipment/measurement/add')
                .send(expected)
                .expect(200);

            expect(body).toEqual(expected);
        }, 30000);
    });

    describe("Get measurement", () => {
        it("/shipment/13/measurement", async () => {
            let timestamp = Date.now();

            const expected = {
                sensorID: '1',
                value: -25,
                timestamp,
            };

            await request.post('/shipment/add')
                .send({
                    id: '13'
                });

            await request.post('/shipment/sensor/add')
                .send({
                    id: "13",
                    sensorID: "1"
                });

            await request.post('/shipment/measurement/add')
                .send(expected);
            
            const {body} = await request.get('/shipment/13/measurement')
                .expect(200);

            expect(body).toEqual(expected);
        }, 30000);
    });

    describe("Get history", () => {
        it("/shipment/14/measurements", async () => {
            let timestamp = Date.now();

            const expected = {
                sensorID: '1',
                value: -25,
                timestamp,
            };

            await request.post('/shipment/add')
                .send({
                    id: '14'
                });

            await request.post('/shipment/sensor/add')
                .send({
                    id: "14",
                    sensorID: "1"
                });

            await request.post('/shipment/measurement/add')
                .send(expected);

            const {body} = await request.get('/shipment/14/measurements')
                .expect(200);

            expect(body).toEqual(
                expect.arrayContaining([expect.objectContaining(expected)])
            );
            expect(body.length).toEqual(1);
        }, 30000);
    });
});