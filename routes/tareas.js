const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Obtiene las tareas
// api/tareas
router.get('/',
    auth,
    [
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.obtenerTareas
)

// Crear una tarea
// api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

router.put('/:id',
    auth,
    [
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.actualizarTarea
);

router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router;