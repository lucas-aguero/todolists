const helpers = {};
const bcryptjs = require("bcryptjs")

helpers.encryptPassword = async(password) => {
    const pattern = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password,pattern);
    return hash;
};

helpers.matchPassword = async(password,savedPassword) => {
    try {
        return await bcryptjs.compare(password,savedPassword);
    } catch (error) {
        console.log(error)       
    }
};


module.exports = helpers;
