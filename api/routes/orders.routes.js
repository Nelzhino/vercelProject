const { Router } = require('express');
const { Orders } = require('../models');
const { isAuthenticated, hasRoles } = require('../auth');
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

router.post('/', isAuthenticated, (request, response) => {
    const { _id } = request.user
    Orders.create({...request.body, user_id: _id })
        .then(data => response.status(201).send(data));
});

router.put('/:id', isAuthenticated, hasRoles(['admin', 'user']), (request, response) => {
    Orders.findByIdAndUpdate(request.params.id, request.body)
        .then(() => response.sendStatus(204));
});

router.delete('/:id', isAuthenticated, (request, response) => {
    Orders.findByIdAndDelete(request.params.id)
        .exec()
        .then(() => response.sendStatus(204));
});


module.exports = router;