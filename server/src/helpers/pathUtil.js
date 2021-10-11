const path = require('path');

module.exports = {
    serverRoot: path.dirname(require.main.filename),
    blockchainRoot: path.resolve(require.main.filename, "..", "..", "blockchain"),
    rootDir: path.resolve(path.dirname(require.main.filename), "..", "..")
}