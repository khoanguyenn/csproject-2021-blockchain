# Tasks
__Goal__: implement basic version of Hyperledger Fabric blockchain vaccine network, show a demo for the sprint retrospective

| Task          | Assignee | Details |
| ------------- | -------- | ------- |
| Create javascript chaincode | Xuan Huy, Minh Huy, Quoc Thai |
| Express webserver | Minh Khoi |
| Chaincode testing | Quoc Thai |
| User authentication | Nhut Anh |
| Network Devops | Dang Khoa | 

# Task details

### Create javascript chaincode
* To be continue

### User authentication
* Create a register/login authentication API endpoint for user
  * ```/register```: to register a new user, by hashing citizen's ID with password to create a unique user's ID
  * ```/login```: to login with citizen's ID with password
__Assignee:__ Nhut Anh
__Deadline:__ 1:00 PM, Thurday, 07/10/2021

### API endpoint
* For ```/vaccine``` route - vaccine information, transfer
  * POST ```/vaccine/manufacturer``` - create a new vaccine
  * PUT ```/vaccine/manufacturer``` - transfer vaccine fomr manufacturer to distributor
  * GET ```/vaccine/distributor``` - get a vaccine with given ID

* For ```/logs``` route - get all of the logs
  * GET ```/logs/manufacturer``` - get all transfered vaccine information
  * GET ```/logs/distributor``` - return all retrive vaccine information from wholesaler

* For ```vaccinate``` route - interact between vaccine and userID
  * PUT ```/vaccinate``` - vaccinate the given userID
  * GET ```/vaccinate``` - return vaccine state of given userID
