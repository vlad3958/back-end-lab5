const express = require('express');
const router = express.Router();
const Car = require('../models/car');

router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.render('index', { cars });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/add', async (req, res) => {
    const { brand, model, year, ownerName, ownerAge } = req.body;
    const car = new Car({
        brand,
        model,
        year,
        owner: { name: ownerName, age: ownerAge },
    });

    try {
        await car.save();
        res.redirect('/cars');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/edit/:id', async (req, res) => {
    const { brand, model, year, ownerName, ownerAge } = req.body;

    try {
        await Car.findByIdAndUpdate(req.params.id, {
            brand,
            model,
            year,
            owner: { name: ownerName, age: ownerAge },
        });
        res.redirect('/cars');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.redirect('/cars');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/json', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;