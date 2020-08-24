const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Obtener todos los proyectos
// api/proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

// Crea proyectos
// api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

// Actualiza proyecto
// api/proyectos/id
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
)

// Eliminar proyecto
// api/
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
)

module.exports = router;