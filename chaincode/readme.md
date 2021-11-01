# Chaincode
Hyperledger Fabric chaincode with two smart contracts for storing shipments and measurement within the blockchain.

## Getting Started
The steps below will help you setup a working copy of this repository running locally on your machine for development and testing purpose.

### Prerequisites
- Docker (desktop);
- Node;
- NPM or Yarn;
- IBM Blockchain Platform Extension for VS Code;

### Installing the chaincode (IBM Blockchain Extension) 
Installing a chaincode is pretty easy with the IBM Blockchain Platform Extension for VS Code.

install the dependencies
```
yarn
```
or
```
npm install
```

Copy the `.env-example` file and rename it to `.env` and fill in the environment to your own values. The values inside the `.env` file will be available in the code through `process.env.{variable_name}`. Registered variables are:
- MAIL_HOST: hostname of the mail server (for example: 127.0.0.1).
- MAIL_PORT: port of the mail server (for example: 2565).
- MAIL_SECURE: if the mail server uses security (such as TLS).
- MAIL_USER: username of the mail server account.
- MAIL_PASSWORD: password of the mail server account.
- MAIL_ADDRESS: mail address of the sender (for example: 'Blockchain' block@test.com).
- MAIL_RECIEVERS: list of addresses that recieve the mail seperated by a comma (for example: test@test.com, test1@test.com)
- MAIL_SUBJECT: subject of the mail.

#### Build the chaincode

**NOTE: we will not guide you to setting up a Fabric Network in this readme.**

Click on the IBM Blockchain Platform icon in the sidebar and go to the section named "SMART CONTRACT". Hover over this section and press on the eclipses on the right, you will see and option called "Package open project". Click on this options to package the chaincode (be sure you haven't already packaged a chaincode with the same name and version).

Building a chaincode will run `tsc` to build and validate your code (you can see the compiled code in the `/dist` folder). After compiling the code you will get a popup asking you which output format you want. Choose the latest version. Which is tar.gz (V2 channel capabilities) at this moment. Congratulations you have build your first chaincode.

#### Install the chaincode
Again click on the IBM Blockchain Platform icon in the sidebar and go to the section named "FABRIC NETWORK". Click on your enviroment/network and on your channel ("mychannel"). Here you will see "Deploy your contract". Press on the option. This will open a new window. Click on "Select smart contract" and select the latest version of the smart contract and press "Next" (right top corner). In the next tab you can change your chaincode name and version, the filled in values should work fine. After you checked this you can again click on "Next". You will see an overview of what is going to happen, you can read this and click on "Next" again. The chaincode is now installing and you will get a lot of notifications. Just wait until you het the message "Sucessfully deployed the contract".

**NOTE: Hyperledger fabric uses chaincode and smart contract interchangeable. However they are not the same. For the installation of this chaincode you can assume they are the same.**

#### Interact with the chaincode
To interact with your installed chaincode you can again go to the IBM Blockchain Platform icon in the sidebar and go to the section named "FABRIC GATEWAY". Click on one of the listed gateways. This will connect you to the a Hyperledger Fabric peer and display all the available queries and transactions in your channels and chaincodes. Click on one of the queries or transactions. This will open a new window. In this window fill in the arguments and press "Submit transaction" to executed it.