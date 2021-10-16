# Tasks

This is the tasklist for the third sprint (also the final sprint), specify the tasks and the assignee of the task.
This week mainly focus on testing the current feature, building UI for users.

### 🥇 Goals
During the third sprint, the followings goals must be achieved:
* Finalize the current sourcecode by the end of Wednesday.
* Testing the current chaincode, API endpoints.
* Maintainence the current blockchain network.
* Building the complete UI version for end users (either ```Manufacturer```, ```Distributor```, ```MedicalUnit```)
* __Note:__ By the end of this Wednesday, all of the source code shouldn't be changed. The last 2 days dedicated for product presentation, and UI checking.

| Tasks | Assignee | Description |
| ----- | -------- | ----------- |
| Testing chaincode | Quoc Thai, Xuan Huy, Nhut Anh | Testing the current chaincode, and fix any arising issue |
| Testing API endpoints | Minh Huy | Validation testing, and response checking |
| Web-server interface completion | Minh Khoi, Dang Khoa | Building the complete set of UI for end users |
| Network maintenance | Dang Khoa | Testing done endpoint, adding more endpoint |

# Tasks details 

### 🗒️ Testing chaincode
* Utilizes the ```Mocha``` testing library to write unit test for all of the function in chaincode.
* Make sure the current chaincode working as planned.
* __Deadline:__ Monday, 11/10/2021

### 🗒️ Testing API endpoints
* Write validation for all of the current middleware, make sure no malicious codes being committed to the blockchain.
* Write unit test by Mocha/Chai to test the current API endpoints, assert all of the API endpoints are working.
* __Deadline:__ Monday, 11/10/2021

### 🔖 Web-server interface
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
 
**Figma:** [Link to UI design](https://www.figma.com/file/PVXHyekYD6Oxn2XmmPJXgU/Blockchain-network)

### 🕸️ Network maintenance
* All of the team member must have a runnable version of project in their environment.
* 
