import {Gateway, Wallets} from 'fabric-network';
import * as os from 'os';
import * as path from 'path';
import org1 from '../profiles/org1.json';

export async function connect() {
    const walletPath: string = path.join(os.homedir(), '.fabric-vscode', 'v2', 'environments', 'blockchain', 'wallets', 'Org1');

    // Create new wallet
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

    // Connect to peer
    await gateway.connect(org1, options);

    return gateway;
}