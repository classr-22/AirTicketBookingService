const { StatusCodes } = require('http-status-codes');
const {BookingService} = require('../services/index');

const bookingService = new BookingService();

const create = async(req,res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        console.log("from booking controller",response);
        return res.status(StatusCodes.OK).json({
            data: response,
            success: true,
            message: "successfully completed booking",
            err: {}
        })
    } catch (error) {
        console.log("from booking controller",error);
        return res.status(error.statusCodes).json({
            data: {},
            success: false,
            message: error.message,
            err: error.explaination
        });
    }
}

module.exports = {
    create
}