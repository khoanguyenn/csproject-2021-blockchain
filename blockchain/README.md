

# Setup network and deploy smart contracts into channel 

- Make sure you have up-to-date version of docker images and fabric binaries -
- note: try to run the command line in another folder different from the current project folder 
```shell
curl -sSL https://bit.ly/2ysbOFE | bash -s
```

## Run the network automatically
By running ```lazyscript.sh```, this will automatically start the network and deploy the current chaincode
```
./lazyscript.sh
```


## Run the network manually

- Before executing all the codes below, make sure that you are currently in the folder test-network
- Initialize network with the configuration of couchDB and CA (certificate authorities)

```shell
./network.sh up createChannel -s couchdb -ca
```

- Deploy chaincode into the network 

```shell
./network.sh deployCC -ccn ledger -ccp ../asset-transfer-ledger-queries/chaincode-javascript -ccl javascript 
```

- note:
  - -ccn: declare name for the chaincode
  - -ccp: declare the path to the chaincode
  - -ccl: declare the language of the written chaincode 

- To update the current chain code 

```shell
./network.sh deployCC -ccn ledger -ccp ../asset-transfer-ledger-queries/chaincode-javascript -ccl javascript -ccs 2 -ccv 2.0
```

- note:
  - -ccs: increase by 1 everytime that you need to update 
  - -ccv: declare the version of the chaincode

- Before run the application app, you need to erase the wallet

```shell
rm -r ../asset-transfer-ledger-queries/application-javascript/wallet
```
## Troubleshooting


- To open the couchDB webpage 
  - link: http://localhost:5984/_utils
  - login
    - username = admin 
    - password = adminpw
