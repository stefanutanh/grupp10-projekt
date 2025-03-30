const router = require("express").Router();
const { where } = require("sequelize");
const db = require('../models');
const validate = require('validate.js');

const constrains = {
    email: {
        length: {
            minimum: 4,
        maximum: 200,
        tooShort: "^Epostadressen måste vara minst %{count} tecken.",
        tooLong : "^Epostadressen får inte vara längre än %{count} tecken."
        },
        email: {
            message: "^Epostadressen är i ett felaktigt format."
        }
    },
    username: { 
        length: {
            minimum: 3,
        maximum: 50,
        tooShort: "^Användarnamnet måste vara minst %{count} tecken.",
        tooLong : "^Användarnamnet får inte vara längre än %{count} tecken."
        }
    },
    imageUrl: {
        url: {
            message: '^Sökvägen är felaktig.'
        }
    }
};

router.get("/", (req, res) => {
    db.user.findAll().then((result) => {
        res.send(result);
    });
});

router.post('/', (req, res) => {
    const user = req.body;
    const invalidData = validate(user, constrains);
    if(invalidData) {
        res.status(400).json(invalidData);
    } else {
        db.user.create(user).then(result => {
            res.send(result);
        });
        }
});

router.put('/', (req, res) => {
    const user = req.body;
    const invalidData = validate(user, constrains);
    const id = user.id;
    if(invalidData || !id) {
        res.status(400).json(invalidData || 'ID är obligatoriskt');
    } else {
        db.user
    .update(user, {
        where: {id: user.id }
    })
    .then((result) => {
        res.send(result);
    });
    }
    
});

router.delete('/', (req, res) => {
    db.user
    .destroy({
        where: {id: req.body.id }
    })
    .then((result) => {
        res.json(`Inlägget raderades ${result}`);
    });
});

module.exports = router;