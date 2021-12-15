const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response ) => {
    
    const { email, password } = req.body;

    try {

        // Validacion si hay un usuario con el correo recibido
        let user = await User.findOne({ email });
        if ( user ) {
            return res.status(400).json({
                ok: false,
                errors: [{msg: 'Un usuario ya existe con ese correo'}]
            });
        }

        // Modelo
        user = new User( req.body );

        // Encriptacion contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        // Grabacion
        await user.save();

        // Generar Json Web Token
        const token = await generateJWT( user.id, user.name );
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })  

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            errors: [{msg: 'Por favor hable con el administrador'}]
        });

    }

}

const loginUser = async(req, res = response) => {
    
    const { email, password } = req.body;

    try {
        
        let user = await User.findOne({ email });

        // Confirmar usuario
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                errors: [{msg: 'El usuario no existe'}]
            });
        }

        // Confirmar password
        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                errors: [{msg: 'Contraseña incorrecta'}]
            })
        }

        // Generar Json Web Token
        const token = await generateJWT( user.id, user.name );

        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            ok: false,
            errors: [{msg: 'Por favor hable con el administrador'}]
        });

    }
    
}

const renewToken = async (req, res = response ) => {
    
    const { uid, name } = req;

    const token = await generateJWT( uid, name );

    res.json({
        ok: true,
        token,
        uid,
        name
    })

}

module.exports = {
    createUser,
    renewToken,
    loginUser,
}