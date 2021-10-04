

# set up network and deploy smart contracts into channel 

- Before executing all the codes below, make sure that you are currently in the folder test-network

- Initialize network with the configuration of couchDB and CA (certificate authorities)

```shell
./network.sh up createChannel -s couchdb -ca
```

- Deploy chaincode into the network 

```shell
./network.sh deployCC -ccn ledger -ccp ../asset-transfer-ledger-queries/chaincode-org1 -ccl javascript 
```

- note:
  - -ccn: declare name for the chaincode
  - -ccp: declare the path to the chaincode
  - -ccl: declare the language of the written chaincode 

- To update the current chain code 

```shell
./network.sh deployCC -ccn ledger -ccp ../asset-transfer-ledger-queries/chaincode-org1 -ccl javascript -ccs 2 -ccv 2.0
```

- note:
  - -ccs: increase by 1 everytime that you need to update 
  - -ccv: declare the version of the chaincode

- Before run the application app, you need to erase the wallet

```shell
rm -r ../asset-transfer-ledger-queries/application-javascript/wallet
```

- To open the couchDB webpage 
  - link: http://localhost:5984/_utils
  - login
    - username = admin 
    - password = adminpw
