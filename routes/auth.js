// Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Iniciar sesion
// api/auth
router.post('/', 
    [
        check('email', 'Agrega un email valido').isEmail()
    ],
    authController.autenticarUsuario
);

router.get('/',
    auth,
    authController.authenticatedUser
)

module.exports = router;