const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const carsRoutes = require('./routes/cars');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://berezinv7930:emLZyWCTMMFKcEXD@cluster0.dxvvlnp.mongodb.net/?retryWrites=true&w=majority', {
    dbName: 'carsDB', 
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

app.use('/cars', carsRoutes);

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.get('/', (req, res) => {
    res.redirect('/cars');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});