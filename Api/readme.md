## Api
This repository contains a Rest Api developed build with Express.js, which can be deployed on its own server.

## Getting Started
The steps below will help you setup a working copy of this repository running locally on your machine for development and testing purpose.

### Prerequisites
- Node;
- NPM or Yarn;
- Executed Chaincode

### Installing the Api 
Installing and running Api is pretty easy when following the following steps:

install the dependencies
```
yarn
```
or
```
npm install
```
Copy the `.env-example` file and rename it to `.env` and fill in the variables to your own values. The values inside the `.env` file will be available in the code through `process.env.{variable_name}`. Registered variables are:
- PORT: port of the server (exp: 8080).
- ORIGIN: location of the frontend (exp: http://localhost:3000).
- CHANNELNAME: Hyperledger Fabric channel name (exp: mychannel).
- IDENTITY: identity name of the user (exp: 'Org1 Admin').
- WALLET: wallet path (exp: './wallet')

### Running the Api
If all of the above requirements and step are followed it is possible to run the Api:

Run the following command:
```
yarn start
```
or
```
npm run start
```
### Interact with the Api

Interaction with the Api is possible through the postman application
