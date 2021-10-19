const loginPage = (req, res) => {
    res.render('login', {
        isLoginPage: true
    })
}

const userPage = (req, res) => {
    res.render('user', {
        isUserPage: true
    })
}

const manufacturerPage = (req, res) => {
    res.render('manufacturer');
}

const manufacturerDeliveryPage = (req, res) => {
    res.render('manufacturerDelivery')
}

const medicalUnitPage = (req, res) => {
    res.render('medicalunit')
}

const medicalUnitDeliveryPage = (req, res) => {
    res.render('medicalunitDelivery');
}

const getInfo = (req, res) => {
    const body = req.body;
    console.log(body);
}

module.exports = {
    loginPage,
    getInfo,
    userPage,
    manufacturerPage,
    manufacturerDeliveryPage,
    medicalUnitPage,
    medicalUnitDeliveryPage,
}