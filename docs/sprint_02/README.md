# Tasks

This is the tasklist for the second sprint, specify the tasks and the assignee of the task

### Goals

During this second sprint, the following goals must be achieved 
* New version of blockchain architecture v2.0, more peers for manufacturer, distributor.
* Web-server user-friendly interface.
* Chaincode update, more functions are added to the network.
* User authentication feature, ultilizes JWT, wallet identities.

| Tasks | Assignee | Description |
| ----- | -------- | ----------- |
| Architecture blockchain v2.0 | Dang Khoa, Minh Huy | Update the current v1.0 architecture, adding more peers, orgs |
| Web-server interface | Minh Khoi, Dang Khoa | Apply a simple user interface by template engine |
| Chaincode update | Quoc Thai, Xuan Huy | Overall review after testing, more chaincode functionality |
| APIs endpoint | Xuan Huy, Minh Huy | Testing done endpoint, adding more endpoint |
| User authentication feature | Nhut Anh, Quoc Thai | Authentication route for user |
| Database schema change | Quoc Thai, Dang Khoa | Change the current database schema |

# Tasks details 

### Architecture blockchain v2.0
* Make sure the current netowrk is running
* Adds 1 more peer to organization ```Manufacturer``` and ```Distributor```.
* Adds ```MedicalUnit``` organization with 2 peers to the network.

### Web-server interface
* User interface: 
  * Login form
  * Register form
  * Vaccine history record
* Distributor interface:
  * Get all of the available vaccines, show a list, with search bar
  * Create new vaccine
* Manufacturer interface:
  * Create new vaccine lot
  * Transfer vaccine lot to ```Distributor```, show a list, with search bar, maybe export feature
  * Get vaccine information, when click on the list's item
* MedicalUnit interface:
  * Show a list of available vaccine in the store, vaccine id, type and current owner state
  * List of given vaccine, and vaccine's owners
  
### Chaincode update
* ```VaccineRecord(ctx, lotNo, vaccineID)``` - takes vaccine lot's number and vaccine's ID, returns all vaccines has 
* ```IsFullyVaccinated(ctx, userID)``` - to check if a user's ID has taken enough vaccine doses (2 doses)

### API endpoints
* ```/vaccine/user/:userId``` - get vaccine's information of given user's ID

### User authentication


### Database schema 
* From ```Manufacturer``` to ```Distributor```
  * ```vaccineLot``` - a unique vaccine lot's number
  * ```vaccineName``` - vaccine's name
  * ```vaccineManufacturer``` - vaccine's manufacturer
  * ```owner``` - owner of the vaccine, could either manufacturer, distributor or citizens
  * ```deliverTo``` - current state of the owner ('org1', 'org2', 'user')
* From ```Distributor``` to ```MedicalUnit```
  * ```vaccineID``` - a unique ID of the vaccine
  * ```vaccineName``` - vaccine's name
  * ```vaccineManufacturer``` - vaccine's manufacturer
  * ```owner``` - owner of the vaccine, could either manufacturer, distributor or citizens
  * ```deliverTo``` - current state of the owner ('org1', 'org2', 'user')
