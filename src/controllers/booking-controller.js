const { StatusCodes } = require('http-status-codes');
const {BookingService} = require('../services/index');
const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('../config/server-config');

const bookingService = new BookingService();

class BookingController {

    

    async sendMessageToQueue (req,res){
        const channel = await createChannel();
        const data = {message: 'Success'}
        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(data));
        return res.status(200).json({
            message: 'Successfully published the event'
        })
    }

    async create (req,res){
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
    
}


module.exports = BookingController