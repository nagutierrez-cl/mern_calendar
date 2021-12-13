/*
    Rutas de Eventos
    host + /api/events
*/

const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// Todas tienen que pasar por la validacion del JWT (middleware aplicado de forma global)
router.use( validarJWT );

// Obtener eventos
router.get('/',

    getEvents
);

// Crear un nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha inicial es obligatoria').custom( isDate ),
        check('end', 'Fecha final es obligatoria').custom( isDate ),
        validarCampos
    ],
    createEvent
);

// Actualizar evento
router.put('/:id', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha inicial es obligatoria').custom( isDate ),
        check('end', 'Fecha final es obligatoria').custom( isDate ),
        validarCampos
    ],
    updateEvent
);

// Borrar evento
router.delete('/:id', deleteEvent);

module.exports = router;