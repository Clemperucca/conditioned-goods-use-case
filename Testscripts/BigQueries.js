const os = require('os');
const path = require('path');
const {Gateway, Wallets} = require('fabric-network');
const org1 = require('../Api/src/profiles/org1.json')

/** 
 * Connect to a Hyperledger peer.
 */
async function connect() {
    // Wallet path.
    const walletPath = path.join(os.homedir(), '.fabric-vscode', 'v2', 'environments', 'blockchain', 'wallets', 'Org1');

    // Create new wallet.
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Initialize a new gateway.
    const gateway = new Gateway();

    // Gateway options
    const options = {
        discovery: {
            asLocalhost: true,
            enabled: true,
        },
        identity: 'Org1 Admin',
        wallet,
    };

    // Conect to gateway
    await gateway.connect(org1, options);

    return gateway;
} 

/** 
 * Insert n amount of records
 */
async function insertRecords(amount) {  
    // Connect to gateway 
    const gateway = await connect();
    
    try {
        // Get channel "mychannel".
        const network = await gateway.getNetwork('mychannel');

        // Get shipment contract.
        const shipmentContract = network.getContract('blockchain-backend');

        console.log("STATUS > INSERTING SHIPMENT");

        // Add a shipment with id 1.
        await shipmentContract.submitTransaction('addShipment', `1`);

        console.log("STATUS > ADDING SHIPMENT");

        // Register sensor with id 1 to shipment with id 1.
        await shipmentContract.submitTransaction('registerSensor', `1`, `1`);

        console.log("STATUS > UPDATING MEASUREMENT");

        // Get measurment contract.
        const measurementContract = network.getContract('blockchain-backend', 'MeasurementContract');

        // Insert n amount of records.
        for (let i = 0; i < amount; i++) {
            // Create random value between -28 and -4.
            let value = Math.round(Math.random() * (-24 - -5) + -5);

            // Insert measurement.
            await measurementContract.submitTransaction('addMeasurement', '1', '1', `${value}`, `${new Date()}`);
        }

        console.log(`STATUS > COMPLETED! INSERTED ${amount} RECORDS`);

        // Exit script.
        process.exit();
    }
    catch (error) {
        console.log(error);

        // Exit script.
        process.exit(1);
    } finally {
        // Close gateway.
       gateway.disconnect();
    }
}

insertRecords(10000);