/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

const { Context } = require('fabric-contract-api');
const { ChaincodeStub } = require('fabric-shim');

// const AssetTransfer = require('../lib/assetTransfer.js');
const AssetTransfer = require('../lib/vaccine_chaincode_v2.js');

let assert = sinon.assert;
chai.use(sinonChai);

describe('Vaccine Transfer Basic Tests', () => {
    let transactionContext, chaincodeStub, asset, vaccineLots, vaccine;
    beforeEach(() => {
        transactionContext = new Context();

        chaincodeStub = sinon.createStubInstance(ChaincodeStub);
        transactionContext.setChaincodeStub(chaincodeStub);

        chaincodeStub.putState.callsFake((key, value) => {
            if (!chaincodeStub.states) {
                chaincodeStub.states = {};
            }
            chaincodeStub.states[key] = value;
        });

        chaincodeStub.getState.callsFake(async (key) => {
            let ret;
            if (chaincodeStub.states) {
                ret = chaincodeStub.states[key];
            }
            return Promise.resolve(ret);
        });

        chaincodeStub.deleteState.callsFake(async (key) => {
            if (chaincodeStub.states) {
                delete chaincodeStub.states[key];
            }
            return Promise.resolve(key);
        });

        chaincodeStub.getStateByRange.callsFake(async () => {
            function* internalGetStateByRange() {
                if (chaincodeStub.states) {
                    // Shallow copy
                    const copied = Object.assign({}, chaincodeStub.states);

                    for (let key in copied) {
                        yield { value: copied[key] };
                    }
                }
            }

            return Promise.resolve(internalGetStateByRange());
        });

        vaccineLots = {
            docType: 'vaccineLot',
            vaccineLot: 'orgast',
            vaccineManufacturer: 'org1',
            owner: 'manufacturer',
            vaccineName: 'astra',
            vaccineQuantity: '3',
            dateOfManufacturer: '12/10/2021',
        };
        vaccine = {
            docType: 'vaccine',
            vaccineID: 'Thai12',
            vaccineName: 'astra',
            vaccineManufacturer: 'org1',
            dateOfManufacturer: '69/69/69',
            owner: 'medicalunit',
        };
    });

    /**
     * @author Ngo Quoc Thai
     */
    describe('Test InitVaccineLot', () => {
        it('should return error on InitVaccineLot', async () => {
            chaincodeStub.putState.rejects('failed inserting key');
            let assetTransfer = new AssetTransfer();
            try {
                await assetTransfer.InitVaccineLot(transactionContext);
                assert.fail('InitVaccineLot should have failed');
            } catch (err) {
                expect(err.name).to.equal('failed inserting key');
            }
        });

        it('should return success on InitVaccineLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.InitVaccineLot(transactionContext);
            let ret = JSON.parse((await chaincodeStub.getState('orgast')).toString());
            expect(ret).to.eql(Object.assign({ docType: 'vaccineLot' }, vaccineLots));
        });
    });

    describe('Test InitVaccine', () => {
        it('should return error on InitVaccine', async () => {
            chaincodeStub.putState.rejects('failed inserting key');
            let assetTransfer = new AssetTransfer();
            try {
                await assetTransfer.InitVaccine(transactionContext);
                assert.fail('InitVaccine should have failed');
            } catch (err) {
                expect(err.name).to.equal('failed inserting key');
            }
        });

        it('should return success on InitVaccine', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.InitVaccine(transactionContext);
            let ret = JSON.parse((await chaincodeStub.getState('Thai12')).toString());
            expect(ret).to.eql(Object.assign({ docType: 'vaccine' }, vaccine));
        });
    });

    /**
     * @author Ngo Quoc Thai
     */
    describe('Test CreateVaccineLot', () => {
        it('should return error on CreateVaccineLot', async () => {
            chaincodeStub.putState.rejects('failed inserting key');

            let assetTransfer = new AssetTransfer();
            try {
                await assetTransfer.CreateVaccineLot(
                    transactionContext,
                    vaccineLots.vaccineManufacturer,
                    vaccineLots.vaccineName,
                    vaccineLots.vaccineQuantity,
                    vaccineLots.dateOfManufacturer
                );
                assert.fail('CreateAsset should have failed');
            } catch (err) {
                expect(err.name).to.equal('failed inserting key');
            }
        });

        it('should return success on CreateVaccineLot', async () => {
            let assetTransfer = new AssetTransfer();

            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            let ret = JSON.parse(
                (await chaincodeStub.getState(vaccineLots.vaccineLot)).toString()
            );
            expect(ret).to.eql(vaccineLots);
        });
    });

    /**
     * @author Ngo Quoc Thai
     */
    describe('Test CreateVaccine', () => {
        it('should return error on CreateVaccine', async () => {
            chaincodeStub.putState.rejects('failed inserting key');

            let assetTransfer = new AssetTransfer();
            try {
                await assetTransfer.CreateVaccine(
                    transactionContext,
                    vaccine.vaccineID,
                    vaccine.vaccineName,
                    vaccine.vaccineManufacturer,
                    vaccine.dateOfManufacturer
                );
                assert.fail('CreateAsset should have failed');
            } catch (err) {
                expect(err.name).to.equal('failed inserting key');
            }
        });

        it('should return success on CreateVaccine', async () => {
            let assetTransfer = new AssetTransfer();

            await assetTransfer.CreateVaccine(
                transactionContext,
                vaccine.vaccineID,
                vaccine.vaccineName,
                vaccine.vaccineManufacturer,
                vaccine.dateOfManufacturer
            );

            let ret = JSON.parse(
                (await chaincodeStub.getState(vaccine.vaccineID)).toString()
            );
            expect(ret).to.eql(vaccine);
        });
    });

    /**
     * @author Ngo Quoc Thai
     */
    describe('Test DeliverToDistributor', () => {
        it('should return error on DeliverToDistributor when inserted not-existent vaccineLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            try {
                await assetTransfer.DeliverToDistributor(transactionContext, 'orgmor');
                assert.fail('DeliverToDistributor should have failed');
            } catch (err) {
                expect(err.message).to.equal('Vaccine lot orgmor does not exist');
            }
        });

        it('should return success on DeliverToDistributor', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            await assetTransfer.DeliverToDistributor(
                transactionContext,
                vaccineLots.vaccineLot
            );
            let ret = JSON.parse(
                await chaincodeStub.getState(vaccineLots.vaccineLot)
            );
            let expected = {
                docType: 'vaccineLot',
                vaccineLot: 'orgast',
                vaccineManufacturer: 'org1',
                owner: 'distributor',
                vaccineName: 'astra',
                vaccineQuantity: '3',
                dateOfManufacturer: '12/10/2021',
            };
            expect(ret).to.eql(expected);
        });
    });

    /**
     * @author Ngo Quoc Thai
     */
    describe('Test GetManufacturerLot', () => {
        it('should return error on GetManufacturerLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            try {
                await assetTransfer.GetManufacturerLot(transactionContext, 'orgmor');
                assert.fail('ReadAsset should have failed');
            } catch (err) {
                expect(err.message).to.equal('Vaccine lot orgmor does not exist');
            }
        });

        it('should return success on GetManufacturerLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            let ret = JSON.parse(
                await chaincodeStub.getState(vaccineLots.vaccineLot)
            );
            expect(ret).to.eql(vaccineLots);
        });
    });

    /**
     * @author Ngo Quoc Thai
     */
    describe('Test DeleteManufacturerLot', () => {
        it('should return error on DeleteManufacturerLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            try {
                await assetTransfer.DeleteManufacturerLot(transactionContext, 'orgmor');
                assert.fail('DeleteManufacturerLot should have failed');
            } catch (err) {
                expect(err.message).to.equal('Vaccine lot orgmor does not exist');
            }
        });

        it('should return success on DeleteAsset', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            await assetTransfer.DeleteManufacturerLot(
                transactionContext,
                vaccineLots.vaccineLot
            );
            let ret = await chaincodeStub.getState(vaccineLots.vaccineLot);
            expect(ret).to.equal(undefined);
        });
    });

    /**
     * @author Ngo Quoc Thai
     */
    describe('Test UpdateManufacturerLot', () => {
        it('should return error on UpdateManufacturerLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            try {
                await assetTransfer.UpdateManufacturerLot(
                    transactionContext,
                    'orgmor',
                    'mordena',
                    '5',
                    '17/10/2021'
                );
                assert.fail('UpdateManufacturerLot should have failed');
            } catch (err) {
                expect(err.message).to.equal('Vaccine lot orgmor does not exist');
            }
        });

        it('should return success on UpdateManufacturerLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            await assetTransfer.UpdateManufacturerLot(
                transactionContext,
                'orgast',
                'astra',
                '10',
                '17/10/2021'
            );
            let ret = JSON.parse(
                await chaincodeStub.getState(vaccineLots.vaccineLot)
            );
            let expected = {
                docType: 'vaccineLot',
                vaccineLot: 'orgast',
                vaccineManufacturer: 'org1',
                owner: 'manufacturer',
                vaccineName: 'astra',
                vaccineQuantity: '10',
                dateOfManufacturer: '17/10/2021',
            };
            expect(ret).to.eql(expected);
        });
    });

    /**
     * @author Ngo Quoc Thai
     */
    describe('Test GetAllManufacturerLots', () => {
        it('should return success on GetAllManufacturerLots', async () => {
            let assetTransfer = new AssetTransfer();

            await assetTransfer.CreateVaccineLot(
                transactionContext,
                'org1',
                'astra',
                '3',
                '17/10/2021'
            );
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                'org1',
                'mordena',
                '5',
                '17/10/2021'
            );

            let ret = await assetTransfer.GetAllManufacturerLots(transactionContext);
            ret = JSON.stringify(JSON.parse(ret.toString()));
            expect(ret.length).to.equal(2);

            let expected = [
                {
                    Record: {
                        vaccineLot: 'orgast',
                        vaccineManufacturer: 'org1',
                        owner: 'manufacturer',
                        vaccineName: 'astra',
                        vaccineQuantity: '3',
                        dateOfManufacturer: '17/10/2021',
                    },
                },
                {
                    Record: {
                        vaccineLot: 'orgmor',
                        vaccineManufacturer: 'org1',
                        owner: 'manufacturer',
                        vaccineName: 'mordena',
                        vaccineQuantity: '5',
                        dateOfManufacturer: '17/10/2021',
                    },
                },
            ];

            expect(ret).to.eql(expected);
        });
    });

    /**
     * @author Ngo Quoc Thai
     */
    describe('Test VaccineLotExist', () => {
        it('should return error on VaccineLotExist', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );
            let ret;
            try {
                ret = await assetTransfer.VaccineLotExist(transactionContext, 'orgmor');
                assert.fail(false);
            } catch (err) {
                expect(ret).to.equal(undefined);
            }
        });

        it('should return success on VaccineLotExist', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            let ret = JSON.parse(await assetTransfer.VaccineLotExist(transactionContext, 'orgast'));
            expect(ret).to.eql(true);
        });
    });

    /**
     * @author Ha Xuan Huy
     */
    describe('Test GetDistributorLot', () => {
        it('should return error on GetDistributorLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            await assetTransfer.DeliverToDistributor(transactionContext, 'orgast');

            try {
                await assetTransfer.GetDistributorLot(transactionContext, 'orgmor');
                assert.fail('GetDistributorLot should have failed');
            } catch (err) {
                expect(err.message).to.equal('Vaccine lot orgmor does not exist');
            }
        });

        it('should return success on GetDistributorLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            await assetTransfer.DeliverToDistributor(transactionContext, 'orgast');

            let ret = JSON.parse(await chaincodeStub.getState(vaccineLots.vaccineLot));
            let expected = {
                docType: 'vaccineLot',
                vaccineLot: 'orgast',
                vaccineManufacturer: 'org1',
                owner: 'distributor',
                vaccineName: 'astra',
                vaccineQuantity: '3',
                dateOfManufacturer: '12/10/2021',
            };
            expect(ret).to.eql(expected);
        });
    });

    /**
     * @author Ha Xuan Huy
     */
    describe('Test DeliverToMedicalUnit', () => {
        it('should return error on DeliverToMedicalUnit', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            await assetTransfer.DeliverToDistributor(transactionContext, 'orgast');
            await assetTransfer.DeliverToMedicalUnit(transactionContext, 'orgast');

            try {
                await assetTransfer.DeliverToMedicalUnit(transactionContext, 'orgmor');
                assert.fail('GetDistributorLot should have failed');
            } catch (err) {
                expect(err.message).to.equal('Vaccine lot orgmor does not exist');
            }
        });

        it('should return success on GetDistributorLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            await assetTransfer.DeliverToDistributor(transactionContext, 'orgast');
            await assetTransfer.DeliverToMedicalUnit(transactionContext, 'orgast');

            let ret = JSON.parse(await chaincodeStub.getState(vaccineLots.vaccineLot));
            let expected = {
                docType: 'vaccineLot',
                vaccineLot: 'orgast',
                vaccineManufacturer: 'org1',
                owner: 'medicalunit',
                vaccineName: 'astra',
                vaccineQuantity: '3',
                dateOfManufacturer: '12/10/2021',
            };
            expect(ret).to.eql(expected);
        });
    });

    /**
     * @author Ha Xuan Huy
     */
    describe('Test UpdateDistributorLot', () => {
        it('should return error on UpdateDistributorLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            await assetTransfer.DeliverToDistributor(transactionContext, 'orgast');

            try {
                await assetTransfer.UpdateDistributorLot(
                    transactionContext,
                    'orgmor',
                    'mordena',
                    '5',
                    '18/10/2021'
                );
                assert.fail('UpdateAsset should have failed');
            } catch (err) {
                expect(err.message).to.equal('Vaccine lot orgmor does not exist');
            }
        });

        it('should return success on UpdateDistributorLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            await assetTransfer.DeliverToDistributor(transactionContext, 'orgast');

            await assetTransfer.UpdateDistributorLot(
                transactionContext,
                'orgast',
                'astra',
                '5',
                '18/10/2021'
            );
            let ret = JSON.parse(await chaincodeStub.getState(vaccineLots.vaccineLot));
            let expected = {
                docType: 'vaccineLot',
                vaccineLot: 'orgast',
                vaccineManufacturer: 'org1',
                owner: 'distributor',
                vaccineName: 'astra',
                vaccineQuantity: '5',
                dateOfManufacturer: '18/10/2021',
            };
            expect(ret).to.eql(expected);
        });
    });

    /**
     * @author Ha Xuan Huy
     */
    describe('Test DeleteDistributorLot', () => {
        it('should return error on DeleteDistributorLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            await assetTransfer.DeliverToDistributor(transactionContext, 'orgast');
            try {
                await assetTransfer.DeleteDistributorLot(transactionContext, 'orgmor');
                assert.fail('DeleteDistributorLot should have failed');
            } catch (err) {
                expect(err.message).to.equal('Vaccine lot orgmor does not exist');
            }
        });

        it('should return success on DeleteDistributorLot', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccineLot(
                transactionContext,
                vaccineLots.vaccineManufacturer,
                vaccineLots.vaccineName,
                vaccineLots.vaccineQuantity,
                vaccineLots.dateOfManufacturer
            );

            await assetTransfer.DeliverToDistributor(transactionContext, 'orgast');

            await assetTransfer.DeleteDistributorLot(transactionContext, 'orgast');
            let ret = await chaincodeStub.getState(asset.ID);
            expect(ret).to.equal(undefined);
        });
    });

    /**
     * @author Ngo Quoc Thai
     */
    describe('Test VaccinateCitizen', () => {
        it('should return error on VaccinateCitizen', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccine(
                transactionContext,
                vaccine.vaccineID,
                vaccine.vaccineName,
                vaccine.vaccineManufacturer,
                vaccine.dateOfManufacturer
            );

            try {
                await assetTransfer.VaccinateCitizen(
                    transactionContext,
                    'notexist',
                    'thai'
                );
                assert.fail('VaccinateCitizen should have failed');
            } catch (err) {
                expect(err.message).to.equal('Vaccine notexist does not exist');
            }
        });

        it('should return success on VaccinateCitizen', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccine(
                transactionContext,
                vaccine.vaccineID,
                vaccine.vaccineName,
                vaccine.vaccineManufacturer,
                vaccine.dateOfManufacturer
            );

            await assetTransfer.VaccinateCitizen(
                transactionContext,
                'Thai12',
                'thai'
            );
            let ret = JSON.parse(await chaincodeStub.getState(vaccine.vaccineID));
            let expected = {
                docType: 'vaccine',
                vaccineID: 'Thai12',
                vaccineName: 'astra',
                vaccineManufacturer: 'org1',
                dateOfManufacturer: '69/69/69',
                owner: 'thai',
            };
            expect(ret).to.eql(expected);
        });
    });

    /**
     * @author Ngo Quoc Thai
     */
    describe('Test IsFullyVaccinated', () => {
        it('should return error on IsFullyVaccinated', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccine(
                transactionContext,
                vaccine.vaccineID,
                vaccine.vaccineName,
                vaccine.vaccineManufacturer,
                vaccine.dateOfManufacturer
            );

            await assetTransfer.VaccinateCitizen(
                transactionContext,
                'Thai12',
                'thai'
            );

            let ret;
            try {
                ret = await assetTransfer.IsFullyVaccinated(transactionContext, 'thai');
                assert.fail(false);
            } catch (err) {
                expect(ret).to.equal(undefined);
            }
        });

        it('should return success on IsFullyVaccinated', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.CreateVaccine(
                transactionContext,
                vaccine.vaccineID,
                vaccine.vaccineName,
                vaccine.vaccineManufacturer,
                vaccine.dateOfManufacturer
            );

            await assetTransfer.CreateVaccine(
                transactionContext,
                'Huy012',
                'astra',
                'org1',
                '18/10/2021'
            );

            await assetTransfer.VaccinateCitizen(
                transactionContext,
                'Thai12',
                'thai'
            );
            await assetTransfer.VaccinateCitizen(
                transactionContext,
                'Huy012',
                'thai'
            );

            let ret = JSON.parse(await assetTransfer.IsFullyVaccinated(transactionContext, 'thai'));
            expect(ret).to.eql(true);
        });
    });
});
