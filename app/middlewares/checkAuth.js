const User = require("../models/usermodel")


const { verifyJwtToken } = require("../utils/token.util")




module.exports = async (req, res, next) => {
    try {
        // check for auth header from client 
        const header = req.headers.authorization
     
        if (!header) {
            next({ status: 403 })
         return;
           
        }

        // verify  auth token
        const token = header.split("Bearer ")[1]

        if (!token) {
            next({ status: 403, message: 'token is missing' })
            return
        }

        const userId = verifyJwtToken(token,next)

        if (!userId) {
            next({ status: 403, message: 'incorrect userid' })
            return
        }

        const user = await User.findById(userId)

        if (!user) {
            next({status: 404, message: 'user not found' })
            return
        }

        res.locals.user = user

        next()
    } catch (err) {
        next(err)
    }
}