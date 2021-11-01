import supertest from 'supertest';
import {app} from '../src/index';

// TODO: add update shipment when it actually does something.
describe('Shipment controller', () =>  {
    const request = supertest(app);

    describe("Get shipments", () => {
        it("/shipments", async () => {
            const expected = {
                id: '1',
                sensors: [],
            };

            await request.post('/shipment/add')
                .send({
                    id: '1'
                });

            const {body} = await request
                .get('/shipments')
                .expect(200);

            expect(body.result).toEqual(
                expect.arrayContaining([expect.objectContaining(expected)])
            );
        }, 30000);

        it("/shipments/1", async () => {
            await request.post('/shipment/add')
                .send({
                    id: '2'
                });

            await request.post('/shipment/add')
                .send({
                    id: '3'
                });

            const {body} = await request
                .get('/shipments/1')
                .expect(200);

            expect(body.result.length).toEqual(1);
        }, 30000);
    });

    describe("Get shipment", () => {
        it("/shipment/4", async () => {
            const expected = {
                id: '4',
                sensors: [],
            };

            await request.post('/shipment/add')
                .send({
                    id: '4'
                });

            const {body} = await request
                .get('/shipment/4')
                .expect(200);

            expect(body).toMatchObject(expected);
        }, 30000);
    });

    describe("Add shipment", () => {
        it("/shipment/add", async () => {
            const expected = {
                id: '5',
                sensors: [],
            };

            const {body} = await request
                .post('/shipment/add')
                .send({
                    id: '5'
                })
                .expect(200);

            expect(body).toMatchObject(expected);
        }, 30000);
    });

    describe("Shipment exist", () => {
        it("/shipment/6/exist", async () => {
            await request.post('/shipment/add')
                .send({
                    id: '6'
                });

            const {body} = await request
                .get('/shipment/6/exist')
                .expect(200);

            expect(body).toEqual(true);
        }, 30000);

        it("/shipment/7/exist", async () => {
            const {body} = await request
                .get('/shipment/7/exist')
                .expect(200);

            expect(body).toEqual(false);
        }, 30000);
    });

    describe("Shipment register sensor", () => {
         it("/shipment/sensor/add", async () => {

            await request.post('/shipment/add')
                .send({
                    id: '8'
                });

            const {body} = await request.post('/shipment/sensor/add')
                .send({
                    id: "8",
                    sensorID: "1"
                })
                .expect(200);

            expect(body).toEqual('1');
        }, 30000);
    });

     describe("Shipment has sensor", () => {
         it("/shipment/9/sensor/1", async () => {
            await request.post('/shipment/add')
                .send({
                    id: '9'
                });

            await request.post('/shipment/sensor/add')
                .send({
                    id: "9",
                    sensorID: "1"
                });

            const {body} = await request.get('/shipment/9/sensor/1')
                .expect(200);

            expect(body).toEqual(true);
        }, 30000);

        it("/shipment/9/sensor/2", async () => {
            const {body} = await request.get('/shipment/9/sensor/2')
                .expect(200);

            expect(body).toEqual(false);
        }, 30000);
    });

    describe("Shipment search", () => {
        it("/shipments/search/10", async () => {
            const expected = {
                id: '10',
                sensors: [],
            }

            await request.post('/shipment/add')
                .send({
                    id: '10'
                });

            await request.post('/shipment/add')
                .send({
                    id: '100'
                });

            const {body} = await request.get('/shipments/search/10')
                .expect(200);

            expect(body.result.length).toEqual(2);
            expect(body.result).toEqual(
                expect.arrayContaining([expect.objectContaining(expected)])
            );
        }, 30000);

         it("/shipments/search/11/1", async () => {
            const expected = {
                id: '11',
                sensors: [],
            }

            await request.post('/shipment/add')
                .send({
                    id: '11'
                });

            await request.post('/shipment/add')
                .send({
                    id: '110'
                });

            const {body} = await request.get('/shipments/search/11/1')
                .expect(200);

            expect(body.result.length).toEqual(1);
            expect(body.result).toEqual(
                expect.arrayContaining([expect.objectContaining(expected)])
            );
        }, 30000);
    });
});