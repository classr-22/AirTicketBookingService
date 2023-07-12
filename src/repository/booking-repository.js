
const {Booking} = require('../models/index');
const { StatusCodes } = require('http-status-codes');
const {AppError ,ValidationError } = require('../utils/errors/index');

class BookingRepository{
    async create(data){
        try {
            const book = await Booking.create(data);
            return book;
        } catch (error) {
            if(error.name == 'SequelizeValidationError'){
                throw new ValidationError(error)
            }

            throw new AppError(
                'RepositoryError',
                'Cannot create booking',
                'There was some issue creating the booking , please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(bookingId,data){
        try {
            const booking = await Booking.findByPk(bookingId);
            if(data.status){
                booking.status = data.status;
            }
            await booking.save();
            return booking;
        } catch (error) {
            throw new AppError(
                'RepositoryError',
                'Cannot update booking',
                'There was some issue updating the booking , please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    
}

module.exports = BookingRepository;