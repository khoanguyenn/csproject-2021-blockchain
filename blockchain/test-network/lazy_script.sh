echo "running initialization script"
./network.sh up createChannel -s couchdb -ca
./network.sh deployCC -ccn ledger -ccp ../asset-transfer-ledger-queries/chaincode-javascript -ccl javascript 
