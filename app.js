const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();


app.use(bodyParser.json());

const mySchema = buildSchema(`

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type User{
        _id:ID!
        email: String!
        password: String
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput {
        email:String!
        password:String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

const myResolver = {
    events: () => {
        return Event.find().then(events => {
            return events.map(event => {
                return { ...event._doc, _id: event.id };
            });
        }).catch(err => {

        });
        //return events;
    },
    createEvent: (args) => {
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
            creator: '5f92cf5a020c073914caf7d4'
        });
        let createdEvent;
        return event
            .save()
            .then(result => {
                createdEvent = { ...result._doc, _id: result._doc._id.toString() };
                return User.findById('5f92cf5a020c073914caf7d4');
            })
            .then((user) => {
                if (!user) {
                    throw new Error('User not found.');
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then((result) => {
                //console.log(result);
                return createdEvent; //{ ...result._doc, _id: result._doc._id.toString() };
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    },
    createUser: (args) => {
        return User.findOne({ email: args.userInput.email }).then(user => {
            if (user) {
                throw new Error('User exists already');
            }
            return bcrypt.hash(args.userInput.password, 12);// return because bcrypt hash is an async task, we want graphql or express graphql to wait for us
        })
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save();
            })
            .then(result => {
                return { ...result, password: null, _id: result.id };
            })
            .catch(err => {
                throw err;
            });
    }
};

app.use('/graphql', graphqlHttp.graphqlHTTP({
    schema: mySchema,
    rootValue: myResolver,
    graphiql: true
}));

// app.get('/', (req, res, next) => {
//     res.send('Hello World!');
// });
// console.log(process.env.MONGO_USER, process.env.MONGO_PASSWORD);
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.sv0s4.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then((params) => {
        console.log('MongoDB Atlas connection: Success', /*params*/);
    }).catch(err => {
        console.log(err);
    });

app.listen(3000);

