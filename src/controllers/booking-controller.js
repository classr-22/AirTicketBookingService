const { StatusCodes } = require('http-status-codes');
const {BookingService} = require('../services/index');
const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('../config/server-config');

const bookingService = new BookingService();

class BookingController {

    

    async sendMessageToQueue (req,res){
        const channel = await createChannel();
        const payload = {
            data:{
                subject: 'this is noti from queue',
                content: 'some queue will subscribe this',
                recepientEmail: 'notificationsumitraut@gmail.com',
                notificationTime: '2018-03-29T08:04:00'
            },
            service: 'CREATE_TICKET'
        }
        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(payload));
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