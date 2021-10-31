const logginMiddleware = (req, res, next) => {
    console.log("User access on " + req.originalUrl);
    next();
}

module.exports = logginMiddleware;