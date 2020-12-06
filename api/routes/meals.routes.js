const { Router } = require('express');
const { Meals } = require('../models');

const router = Router();

router.get('/', (request, response) => {
    Meals.find()
        .exec()
        .then(data => response.status(200).send(data));
});

router.get('/:id', (request, response) => {
    Meals.findById(request.params.id)
        .exec()
        .then(data => response.status(200).send(data));
});

router.post('/', (request, response) => {
    Meals.create(request.body)
        .then(data => response.status(201).send(data));
});

router.put('/:id', (request, response) => {
    Meals.findByIdAndUpdate(request.params.id, request.body)
        .then(() => response.sendStatus(204));
});

router.delete('/:id', (request, response) => {
    Meals.findByIdAndDelete(request.params.id)
        .exec()
        .then(() => response.sendStatus(204));
});


module.exports = router;