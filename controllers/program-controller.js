const Program = require("../models/program");
const handleError = (res, err) => {
    console.log(err)
    res.status(500).json({error: err})
}

const getAllPrograms = async(req,res) => {
    try {
        Program
            .find()
            .then((items) => {
                res
                    .status(200)
                    .json(items);
            })
    } catch (err) {
        handleError(res, err)
    }
}

module.exports = {getAllPrograms}