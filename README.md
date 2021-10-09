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
- [ ] Hyperledger Fabric blockchain network
- [ ] CouchDB database schema
- [ ] System workflow

## ⛓️ Chaincode function

Development functions
* ```InitVacccines```, create a set of default vaccines

Wholesale functions
* ```CreateVaccine(ctx, name, vaccineID)``` - create a new vaccine with name and ID
* ```DispatchVaccine(ctx, vaccineID, newOwner)``` - transfers vaccine from vaccine manufacturer to distributor
* ```GetDispatchLogs(ctx)``` - get all of transfered vaccine information 

Distributor functions
* ```GetVaccine(ctx, vaccineID)``` - get a vaccine with given ID
* ```VaccinateCitizen(ctx, vaccineID, userID)``` - vaccinate the given citizen's ID, same as giving a userID a vaccine
* ```GetDeliveryLogs(ctx)``` - return all retrive vaccine information from wholesaler
* ```CheckVaccinateState(ctx, userID)``` - return vaccine state of a specific user

Ultility functions
* ```VaccineExists(ctx, id)``` - returns true when vaccine with given ID exists in worldstate
* ```GetAllVaccinesOf(ctx, owner)``` - get all vacine information of a specific owner
* ```GetAllVaccines(ctx)``` - return all of the available vaccine in worldstate

## 📖 Database schema
The vaccine transfer between ```Manufacturer```, ```Distributor```, ```MedicalUnit``` is in a lot. 
For example, ```lotNo: M345``` from manufacturer ```owner: Moderna``` to distributor ```owner: KMedicine``` and finally send to medical unit ```owner: MedicHCMC```.
Vaccine lot hit the final destination ```owner: MedicHCMC``` then each vaccine being indexed by unique vaccineID
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

* ```/register```
* ```/login```
