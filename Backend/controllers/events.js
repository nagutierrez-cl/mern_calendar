const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async(req, res = response) => {

    const eventos = await Event.find({})
                               .populate('user', 'name');

    res.status(200).json({
        ok: true,
        eventos
    })

}
const createEvent = async(req, res = response) => {

    const event = new Event( req.body );

    try {

        event.user = req.uid;
        const eventdb = await event.save();

        res.status(200).json({
            ok: true,
            eventdb
        })

    } catch (error) {

        console.log(err);
        res.status(500).json({
            ok: false,
            errors: [{msg: 'Por favor hable con el administrador'}]
        });

    }

}
const updateEvent = async(req, res = response ) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        
        const evento = await Event.findById( eventId );
        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                errors: [{msg: 'Evento no encontrado'}]
            })
        }

        // Solo el usuario que creo la nota la puede editar
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                errors: [{msg: 'No tiene privilegio para editar el evento'}]
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        // eventUpdated retorna el elemento antes de actualizarlo. Por eso se usa new: true
        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.status(200).json({
            ok: true,
            eventUpdated
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            errors: [{msg: 'Por favor hable con el administrador'}]
        });
    }

}
const deleteEvent = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        
        const evento = await Event.findById( eventId );
        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                errors: [{msg: 'Evento no encontrado'}]
            })
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                errors: [{msg: 'No tiene privilegios para eliminar el evento'}]
            });
        }

        await Event.findByIdAndDelete( eventId );

        res.status(200).json({ ok: true })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            errors: [{msg: 'Por favor hable con el administrador'}]
        });
    }

}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}