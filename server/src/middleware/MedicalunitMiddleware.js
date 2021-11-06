const express = require("express");
const { Wallets } = require("fabric-network");
const path = require('path');
const { buildWallet } = require("../helpers/AppUtil");
const { serverRoot } = require("../helpers/pathUtil");
const {createContract, disconnetGateway} = require ('../helpers/web_util')
const RenderMiddleware = require('../middleware/RenderMiddleware');
const securityModule=require("../helpers/secur_util")

/**
 * @author Nguyen Dang Khoa
 * @description returns all of the available users of the medical unit
 * @returns all users with status code = 200
 */
const getAllUsers = async (req, res) => {
    const walletPath = path.resolve(serverRoot, 'walletMedic');
    const wallet = await buildWallet(Wallets, walletPath);
    const userList = await wallet.list();
    //Filter out the admin identity 
    const result = userList.filter(user => user != 'admin');
    res.status(200).json(result);

}

/**
 * @author Nguyen Dang Khoa
 * @description returns all of the available vaccines of medical unit
 * @returns result with status code = 200
 */
const getAllVaccines = async function (req, res) {
    try {
        const contract = await createContract();
        const vaccineList = await contract.evaluateTransaction('GetAllVaccinesOf', 'medicalunit');
        res.status(200).json(JSON.parse(vaccineList.toString()))
    }
    catch(err) {
        console.log("[ERROR]: " + err);
    } finally {
        disconnetGateway();
    }
}

/**
 * @author Nguyen Dang Khoa
 * @description returns all the of the available vaccine lots of the medical unit 
 * @return all medical unit's vaccine lots with status code = 200 
 */
const getVaccine = async (req, res) => {
    try {
        const contract = await createContract();
        const vaccineLotList = await contract.evaluateTransaction('GetAllLotsOf', 'medicalunit');
        res.status(200).json(JSON.parse(vaccineLotList.toString()));
    } catch(err) {
        console.log("[ERROR]: " + err);
    } finally {
        disconnetGateway();
    }
}
/**
 * @author Ngo Quoc Thai
 * @description divide the vaccine lot into ready-to-use vaccines
 * @returns status code
 */
const divideVaccineLot = async function (req, res){
    let vaccineLotID = String(req.body.vaccineLot)
    var format1= ["vaccineLot"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            const contract = await createContract();
            await contract.submitTransaction('DivideVaccineLot', vaccineLotID);
            res.sendStatus(200)
        } catch (error) {
            console.log('error: ' + error);
            res.send(404);
        } finally {
            disconnetGateway();
        }
    }
    else return res.send("wrong format")
}

/**
 * @author Ngo Quoc Thai
 * @description transfer owner of the vaccine to user 
 * @returns status code
 */
const vaccinateUser = async function (req, res){
    var format1= ["vaccineID","userID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        let vaccineID = String(req.body.vaccineID);
        let userID = String(req.body.userID);
        try {
            const contract = await createContract();
            await contract.submitTransaction('VaccinateCitizen', vaccineID, userID);
            res.sendStatus(200);
        } catch (error) {
            console.log('error: ' + error);
            res.send(404);
        } finally {
            disconnetGateway();
        }
    }
    else return res.send("wrong format")
    
}
/**
 * @author Ngo Quoc Thai
 * @description get used vaccines of specific userID
 * @returns JSON array
 */
const getVaccineState = async function (req, res) {
    let userID = req.query.userID;
        try {
            const contract = await createContract();
            let result = await contract.evaluateTransaction('CheckVaccinateState', userID);
            res.json(JSON.parse(result.toString()));
        } catch (error) {
            console.log('error: ' + error);
            res.send(404);
        } finally {
            disconnetGateway();
        }
}

module.exports = {
    getAllUsers,
    getAllVaccines,
    getVaccine,
    divideVaccineLot,
    vaccinateUser,
    getVaccineState,
}