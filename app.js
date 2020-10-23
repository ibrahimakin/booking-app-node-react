const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

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

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

const myResolver = {
    events: () => {
        return events;
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
            date: new Date(args.eventInput.date)
        });
        return event.save(event).then(result => {
            console.log(result);
            return { ...result._doc };
        }).catch(err => {
            console.log(err);
            throw err;
        });
        return event;
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

