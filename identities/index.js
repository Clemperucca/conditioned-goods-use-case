const fs = require("fs");
const {Wallets} = require('fabric-network');

/** 
 * Generate identity for user.
 */
async function createIdentity(name, mspId, ) {
    // Wallet path.
    const walletPath = './wallet';

    // Create new wallet.
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const cert = fs.readFileSync("./info/client.crt");
    const key = fs.readFileSync("./info/client.key");

    const identity = {
        credentials: {
            certificate: cert.toString(),
            privateKey: key.toString(),
        },
        mspId: mspId,
        type: 'X.509',
    };

    await wallet.put(name, identity);
}

createIdentity('Admin', 'Org1MSP');