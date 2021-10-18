# :zap: Vaccine management with blockchain integration 
This project, aims to integrate Hyperledger Fabric blockchain technology, by establishing a private blockchain network, solving untrusted vaccine distribution information between parties while joining private network.\
In addition, this project is establised to fullfil the requirement for "Project" module in VGU. All infomation reserves the teammember as following:
* Nguyen Dang Khoa - Teamleader
* Ngo Quoc Thai
* Ha Xuan Huy
* Pham Minh Huy
* Vo Thanh Minh Khoi
* Huynh Nhut Anh

## :fire: Getting started with the project
Before getting started with the project, please carefully check out the following folder for your purpose
* ```server``` - an ExpressJS backend-server, serve CRUD API endpoint for vaccines, template engine for web user-interface
* ```blockchain``` - blockchain core including the network and its components setup
* ```docs``` - documentation folder, consists of guide, backlog, meeting note, presentation,...

## :dizzy: Current state
- [x] Basic folder structure
- [x] Hyperledger Fabric blockchain network
- [x] CouchDB database schema
- [x] System workflow

## ⛓️ Chaincode function

Development functions
* ```InitVacccines```, create a set of default vaccines

Manufacturer functions
* ```CreateVaccineLot(ctx, manufacturer, name, quantity, dateOfManufacture)``` - create a new vaccine with name and ID
* ```DeliverToDistributor(ctx, lotNo, toDistributor)``` - transfers vaccine from vaccine manufacturer to distributor
* ```GetAllManufacturerLots(ctx)``` - get all a vaccine lot by manufacturer
* ```GetManufacturerLot(ctx, lotNo)``` - get a vaccine lot of manufacturer
* ```UpdateManufacturerLot(ctx, lotNo, name, quantity, dateOfManufacture)``` - update new infomation of the lot
* ```DeleteManufacturerLot(ctx, lotNo)``` - delete the given lot's number
* ```GetManufacturerLogs(ctx, lotNo)``` - get all manufacturer logs 

Distributor functions
* ```DeliverToMedicalUnit(ctx, lotNo, toMedicalUnit)``` - vaccinate the given citizen's ID, same as giving a userID a vaccine
* ```GetDistributorLots(ctx)``` - get a lot of vaccine of distributor by lot number
* ```GetDistributorLot(ctx, lotNo)``` - get a vaccine lot of distributor
* ```UpdateDistributorLot(ctx, lotNo, name, quantity, dateOfManufacture)``` - update new infomation of the lot
* ```DeleteDistributorLot(ctx, lotNo)``` - delete the given lot's number
* ```GetDistributorLogs(ctx, lotNot)``` - get all distributor logs

MedicalUnit functions
* ```CheckVaccinateState(ctx, userID)``` - return array of vaccine of a specific user has taken
* ```IsFullyVaccinated(ctx, userID)``` - return true/false if the user is fully vaccinated
* ```DivideVaccineLot(ctx, lotNo)``` - create number of vaccine doses by vaccine's quantity in the lot, should look up all lot, then divide lot and commit to ledger
* ```VaccinateCitizen(ctx, userID, vaccineID)``` - vaccinate a user's ID (update the owner field)

Ultility functions
* ```GetAllLotsOf(ctx, owner)``` - get all available vaccine lot of a owner
* ```GetALotOf(ctx, owner, lotNo)``` - get a specific vaccin lot of a owner
* ```GetDeliveryLogsOf(ctx, lotNo, owner)``` - get all of transfered vaccine information
* ```VaccineExists(ctx, id)``` - returns true when vaccine with given ID exists in worldstate
* ```GetAllVaccinesOf(ctx, owner)``` - get all vacine information of a specific owner
* ```GetAllVaccines(ctx)``` - return all of the available vaccine in worldstate

## 📖 Database schema
The vaccine transfer between ```Manufacturer```, ```Distributor```, ```MedicalUnit``` is in a lot. 
For example, ```lotNo: M345``` from manufacturer ```owner: manufacturer``` to distributor ```owner: distributor``` and finally send to medical unit ```owner: medicalunit```.
Vaccine lot hit the final destination ```owner: medicalunit``` then each vaccine being indexed by unique vaccineID
* From ```Manufacturer```, ```Distributor```, ```MedicalUnit``` 

  * ```vaccineLot``` - a unique vaccine lot's number
  * ```vaccineManufacturer``` - vaccine's manufacturer
  * ```vaccineName``` - vaccine's name, stated by manufacturer
  * ```vaccineQuantity``` - number of vaccines available in a lot
  * ```dateOfManufacture``` - vaccine's date of manufacture 
  * ```owner``` - owner of the vaccine, could either manufacturer, distributor, medical unit or citizens

* From ```MedicalUnit```

  * ```vaccineId``` - a unique vaccineID
  * ```vaccineManufacturer``` - vaccine's manufacturer
  * ```vaccineName``` - vaccine's name, stated by manufacturer
  * ```dateOfManufacture``` - vaccine's date of manufacture 
  * ```owner``` - current owner of the vaccine, could either a medical unit or user's ID


## 📖 API endpoints

* For ```/manufacturer``` route - vaccine information, transfer
  * GET ```manufacturer/vaccines``` - get all vaccine lot of manufacturer
  * GET ```manufacturer/vaccines/:vaccineID``` - get a vaccine lot of manufacturer
  * POST ```manufacturer/vaccines``` - create a new vaccine lot
  * PUT ```manufacturer/vaccines``` - update new vaccine lot's information
  * DELETE ```manufacturer/vaccines``` - delete the vaccine lot
  * PUT ```manufacturer/delivery``` - update new owner, transfer vaccine from manufacturer to distributor
  * GET ```manfacturer/logs``` get all manufacturer's delivery logs

* For ```distributor``` route - get all of the logs
  * GET ```distributor/vaccines``` - get all vaccine lot of distributor
  * GET ```distributor/vaccines/:vaccineID``` - get a vaccine lot of distributor
  * PUT ```distributor/vaccines``` - update new vaccine lot's information
  * DELETE ```distributor/vaccines``` - delete the vaccine lot
  * PUT ```distributor/delivery``` - update new owner, transfer vaccine from distributor to medical unit
  * GET ```distributor/logs``` get all distributor's delivery logs

* For ```/medical-unit``` route - get all of the logs
  * POST ```/vaccinate``` - create number of vaccine does by available vaccine's lot
  * PUT ```/vaccinate``` - vaccinate the given userID
  * GET ```/vaccinate``` - return array of vaccine of a specific user has taken
  * GET ```/vaccines``` - return of the vaccines with vaccine's ID
  * GET ```/users``` - return all of the user in the network
