const router = require('express').Router();
const sendMessage = require('./message');

router.post(
    '/send',
    [],
    sendMessage
);


module.exports = router;