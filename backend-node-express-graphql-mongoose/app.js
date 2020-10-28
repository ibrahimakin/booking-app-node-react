const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const mySchema = require('./graphql/schema');
const myResolver = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

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

app.listen(8000);