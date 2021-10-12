const login = (req, res) => {
    res.render('login', {
        isLoginPage: true
    })
}

const userPage = (req, res) => {
    res.render('user', {
        isUserPage: true
    })
}

const getInfo = (req, res) => {
    const body = req.body;
    console.log(body);
}

module.exports = {
    login,
    getInfo,
    userPage
}