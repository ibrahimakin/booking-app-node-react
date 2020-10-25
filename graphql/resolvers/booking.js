const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformEvent, transformBooking } = require('./merge');



const bookingResolver = {

    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (error) {
            throw error;
        }
    },
    bookEvent: async (args) => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            event: fetchedEvent,
            user: '5f92f0ff827ff80d8c333ed2',
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);

            await booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = bookingResolver;