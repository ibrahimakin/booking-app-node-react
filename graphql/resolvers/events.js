const Event = require('../../models/event');
const { transformEvent } = require('./merge');

const eventResolver = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (error) {
            throw error;
        }
        //return events;
    },
    createEvent: async (args) => {
        //     const event = {
        //         _id: Math.random().toString(),
        //         title: args.eventInput.title,
        //         description: args.eventInput.description,
        //         price: +args.eventInput.price,
        //         date: args.eventInput.date
        //     };
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5f92f0ff827ff80d8c333ed2'
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);
            const creator = await User.findById('5f92f0ff827ff80d8c333ed2');
            if (!creator) {
                throw new Error('User not found.');
            }
            creator.createdEvents.push(event);
            await creator.save();
            //console.log(result);
            return createdEvent; //{ ...result._doc, _id: result._doc._id.toString() };

        } catch (error) {
            console.log(err);
            throw err;
        }
    },
};

module.exports = eventResolver;
