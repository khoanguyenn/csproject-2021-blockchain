process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();

chai.use(chaiHttp);

describe('manufacturer', () => {
    beforeEach((done) => {
        done();
    });
  
    describe('/GET manufacturer/vaccines', () => {
        it('it should GET all the vaccines that are under MANUFACTURER', (done) => {
            chai.request('http://localhost:3000/')
                .get('/manufacturer/vaccines')
                .end((err, res) => {
                    res.should.have.status(200);
                });
            done()
        });
    });

    describe('/GET manufacturer/vaccines/:vaccineID', () => {
        it('it should GET get a vaccine lot of manufacturer', (done) => {
            let dummy="orgpfi"
            chai.request('http://localhost:3000/')
                .get('/manufacturer/vaccines/'+dummy)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object")
                    res.body.should.have.property('pet');
                    res.body.pet.should.have.property('owner').eql("manufacturer");
                    res.body.pet.should.have.property('vaccineLot').eql(dummmy);
                    res.body.pet.should.have.property('dateOfManufacturer');
                    res.body.pet.should.have.property('vaccineManufacturer')
                    res.body.pet.should.have.property('vaccineName')
                    res.body.pet.should.have.property('vaccineQuantity')
                });
            done()
        });
    });

    describe('/GET manfacturer/logs', () => {
        it('get all manufacturer\'s delivery logs', (done) => {

            chai.request('http://localhost:3000/')
                .get('/manufacturer/logs/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(0)
                });
            done()
        });
    });

    describe('/POST manufacturer/vaccines', () => {
        it('create a new vaccine lot', (done) => {
            let dummy={
                "manufacturer":"Lanna",
                "name":"zad",
                "quantity":"12",
                "dateOfManufacture":"12/12/2333"
            }
            chai.request('http://localhost:3000/')
                .post('/manufacturer/vaccines/')
                .send(dummy)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(0)
                });
            done()
        });
    });

    
    describe('/PUT manufacturer/vaccines', () => {
        it('update new vaccine lot\'s information', (done) => {
            let dummy={
                "vaccineLot":"orgpfi",
                "name":"pfizer",
                "quantity":"12",
                "dateOfManufacture":"12/12/2333"
            }
            chai.request('http://localhost:3000/')
                .put('/manufacturer/vaccines/')
                .send(dummy)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(0)
                });
            done()
        });
    });

    describe('/PUT manufacturer/delivery', () => {
        it('transfer vaccine from manufacturer to distributor', (done) => {
            let dummy={
                "vaccineLot":"orgpfi"
            }
            chai.request('http://localhost:3000/')
                .put('/manufacturer/vaccines/')
                .send(dummy)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(0)
                });
            done()
        });
    });

    describe('/DELETE manufacturer/vaccines', () => {
        it('delete specified vaccine lot', (done) => {
            let dummy={
                "vaccineLot":"orgpfi"
            }
            chai.request('http://localhost:3000/')
                .delete('/manufacturer/vaccines/')
                .send(dummy)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(0)
                });
            done()
        });
    });
});


describe('distributor', () => {
    beforeEach((done) => {
        done();
    });
  
    describe('/GET distributor/vaccines', () => {
        it('it should GET all the vaccines that are under DISTRIBUTOR', (done) => {
            chai.request('http://localhost:3000/')
                .get('/distributor/vaccines')
                .end((err, res) => {
                    res.should.have.status(200);
                });
            done()
        });
    });

    describe('/GET distributor/vaccines/:vaccineID', () => {
        it('get a vaccine lot of distributor', (done) => {
            let dummy="orgpfi"
            chai.request('http://localhost:3000/')
                .get('/distributor/vaccines/'+dummy)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object")
                    res.body.should.have.property('pet');
                    res.body.pet.should.have.property('owner').eql("distributor");
                    res.body.pet.should.have.property('vaccineLot').eql(dummmy);
                    res.body.pet.should.have.property('dateOfManufacturer');
                    res.body.pet.should.have.property('vaccineManufacturer')
                    res.body.pet.should.have.property('vaccineName')
                    res.body.pet.should.have.property('vaccineQuantity')
                });
            done()
        });
    });

    describe('/GET distributor/logs', () => {
        it('get all distriobutor\'s delivery logs', (done) => {

            chai.request('http://localhost:3000/')
                .get('/distributor/logs/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(0)
                });
            done()
        });
    });

    
    describe('/PUT distributor/vaccines', () => {
        it('update information of a vaccine lot under DISTRIBUTOR', (done) => {
            let dummy={
                "vaccineLot":"orgpfi",
                "name":"pfizer",
                "quantity":"12",
                "dateOfManufacture":"12/12/2333"
            }
            chai.request('http://localhost:3000/')
                .put('/distributor/vaccines/')
                .send(dummy)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(0)
                });
            done()
        });
    });

    describe('/PUT distributor/delivery', () => {
        it('pdate new owner, transfer vaccine from distributor to medical unit', (done) => {
            let dummy={
                "vaccineLot":"orgpfi"
            }
            chai.request('http://localhost:3000/')
                .put('/distributor/vaccines/')
                .send(dummy)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(0)
                });
            done()
        });
    });
    
    describe('/DELETE distributor/vaccines', () => {
        it('delete specified vaccine lot', (done) => {
            let dummy={
                "vaccineLot":"orgpfi"
            }
            chai.request('http://localhost:3000/')
                .delete('/distributor/vaccines/')
                .send(dummy)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(0)
                });
            done()
        });
    });
});

describe('medicalunit', () => {
    beforeEach((done) => {
        done();
    });
    
    describe('/GET medical-unit/vaccinate', () => {
        it('it should return array of vaccine of a specific user has taken', (done) => {
            let dummy = {"userID":"12312"}
            chai.request('http://localhost:3000/')
                .get('/medical-unit/vaccinate')
                .end((err, res) => {
                    res.should.have.status(200);
                });
            done()
        });
    });

       
    describe('/PUT medical-unit/vaccinate', () => {
        it('it should vaccinate 1 person', (done) => {
            let dummy = {"userID":"12312"}
            chai.request('http://localhost:3000/')
                .put('/medical-unit/vaccinate')
                .end((err, res) => {
                    res.should.have.status(200);
                });
            done()
        });
    });

          
    describe('/POST medical-unit/vaccinate', () => {
        it('it should seperate 1 vaccinelot into multiple doses', (done) => {
            let dummy = {"userID":"12312"}
            chai.request('http://localhost:3000/')
                .post('/medical-unit/vaccinate')
                .end((err, res) => {
                    res.should.have.status(200);
                });
            done()
        });
    }); 


});