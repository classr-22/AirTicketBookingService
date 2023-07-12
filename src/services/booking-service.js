const { default: axios } = require('axios');
const {BookingRepository} = require('../repository/index');
const {FLIGHT_SERVICE_PATH} = require('../config/server-config');
const { ServiceError } = require('../utils/errors');

class BookingService {
    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data){
        try {
            const flightId = data.flightId;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`; 
            const flightData = await axios.get(getFlightRequestURL);
            const response = flightData.data.data;   
            let priceOfTheFlight = response.price;
            if(data.noOfSeats > response.totalSeats){
                throw new ServiceError('Something went wrong in booking process','Insufficient seats in the flight');
            }
            const totalCost = priceOfTheFlight*data.noOfSeats;
            const bookingPayload = {...data,totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            console.log(updateFlightRequestUrl);
            await axios.patch(updateFlightRequestUrl,{totalSeats: response.totalSeats - booking.noOfSeats});
            const finalBokking = await this.bookingRepository.update(booking.id,{status: "Booked"});
            return finalBokking;

        } catch (error) {
            if(error.name == 'RepositoryError' || error.name == 'ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }

    }
}

module.exports = BookingService;