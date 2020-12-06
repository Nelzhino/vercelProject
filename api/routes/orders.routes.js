const { Router } = require('express');
const { Orders } = require('../models');
const router = Router();

router.get('/', (request, response) => {
    Orders.find()
        .exec()
        .then(data => response.status(200).send(data));
});

router.get('/:id', (request, response) => {
    Orders.findById(request.params.id)
        .exec()
        .then(data => response.status(200).send(data));
});

router.post('/', (request, response) => {
    console.log('Hola!!!!!! ', request.body);
    Orders.create(request.body)
        .then(data => response.status(201).send(data));
});

router.put('/:id', (request, response) => {
    Orders.findByIdAndUpdate(request.params.id, request.body)
        .then(() => response.sendStatus(204));
});

router.delete('/:id', (request, response) => {
    Orders.findByIdAndDelete(request.params.id)
        .exec()
        .then(() => response.sendStatus(204));
});


module.exports = router;