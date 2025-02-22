import { check, validationResult } from 'express-validator';
import Veterinary from "../models/Veterinary.js";

const createVeterinary = async (req, res) => {
    await check('clee').notEmpty().withMessage('El clee es obligatorio').run(req);
    await check('name').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('El email no es válido').run(req);
    await check('street').notEmpty().withMessage('La calle es obligatoria').run(req);
    await check('colony').notEmpty().withMessage('La colonia es obligatoria').run(req);
    await check('code_postal').isLength({ min: 5, max: 5 }).withMessage('El código postal debe ser igual a 5 digitos').run(req);
    await check('ubication').notEmpty().withMessage('La ubicación es obligatoria').run(req);
    await check('phone_number').isLength({ min: 10 }).withMessage('El número telefonico debe ser igual a 10 dígitos').run(req);
    await check('longitude').notEmpty().withMessage('La longitud es obligatoria').run(req);
    await check('latitude').notEmpty().withMessage('La latitud es obligatoria').run(req);

    let result = validationResult(req);
    let errors = {};
    result.array().map(resulState => {
        const { param, msg } = resulState;
        if (param == 'clee') {
            errors = { ...errors, clee: msg };
        }
        if (param == 'name') {
            errors = { ...errors, name: msg };
        }
        if (param == 'email') {
            errors = { ...errors, email: msg };
        }
        if (param == 'street') {
            errors = { ...errors, street: msg };
        }
        if (param == 'colony') {
            errors = { ...errors, colony: msg };
        }
        if (param == 'code_postal') {
            errors = { ...errors, code_postal: msg };
        }
        if (param == 'ubication') {
            errors = { ...errors, ubication: msg };
        }
        if (param == 'phone_number') {
            errors = { ...errors, phone_number: msg };
        }
        if (param == 'longitude') {
            errors = { ...errors, longitude: msg };
        }
        if (param == 'latitude') {
            errors = { ...errors, latitude: msg };
        }
    });
    if (!result.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors
        })
    }

    const { clee, name, business_name, class_activity, email, street, no_ext, no_int, colony, code_postal, ubication, phone_number, website, longitude, latitude, store_number } = req.body;

    const existVeterinary = await Veterinary.findOne({ where: { clee } })
    if (existVeterinary) {
        return res.status(403).json({
            status: 403,
            msg: 'La veterinaria seleccionada ya está registrada'
        });
    }

    const { id } = req.user;
    const veterinary = await Veterinary.create({
        clee: clee,
        name: name,
        business_name: business_name,
        class_activity: class_activity,
        email: email,
        street: street,
        no_ext: no_ext,
        no_int: no_int,
        colony: colony,
        code_postal: code_postal,
        ubication: ubication,
        phone_number: phone_number,
        website: website,
        longitude: longitude,
        latitude: latitude,
        store_number: store_number,
        idUser: id
    })

    return res.json({
        status: 201,
        msg: "¡Veterinaria Registrada Correctamente"
    })
}

const findVeterinary = async (req, res) => {
    const { id } = req.params;

    const numberId = parseInt(id);
    if (isNaN(numberId)) {
        return res.status(400).json({
            status: 400,
            msg: 'El id de la veterinaria es inválido'
        });
    }
    const veterinary = await Veterinary.findOne({ where: { id } });

    if (!veterinary) {
        return res.status(404).json({
            status: 404,
            msg: 'La veterinaria seleccionada no existe'
        })
    }

    return res.status(200).json({
        status: 200,
        veterinary
    });
}

const editVeterinary = async (req, res) => {
    const { id } = req.params;
    
    const numberId = parseInt(id);
    if (isNaN(numberId)) {
        return res.status(400).json({
            status: 400,
            msg: 'El id de la veterinaria es inválido'
        });
    }

    const veterinary = await Veterinary.findOne({where: {id}});

    if(!veterinary){
        return res.status(404).json({
            status: 404,
            msg: 'La veterinaria seleccionada no existe'
        })
    }

    veterinary.clee = req.body.clee || veterinary.clee;
    veterinary.name = req.body.name || veterinary.name;
    veterinary.business_name = req.body.business_name || veterinary.business_name;
    veterinary.class_activity = req.body.class_activity || veterinary.class_activity;
    veterinary.email = req.body.email || veterinary.email;
    veterinary.street = req.body.street || veterinary.street;
    veterinary.no_ext = req.body.no_ext || veterinary.no_ext;
    veterinary.no_int = req.body.no_int || veterinary.no_int;
    veterinary.colony = req.body.colony || veterinary.colony;
    veterinary.code_postal = req.body.code_postal || veterinary.code_postal;
    veterinary.ubication = req.body.ubication || veterinary.ubication;
    veterinary.phone_number = req.body.phone_number || veterinary.phone_number;
    veterinary.website = req.body.website || veterinary.website;
    veterinary.longitude = req.body.longitude || veterinary.longitude;
    veterinary.latitude = req.body.latitude || veterinary.latitude;
    veterinary.store_number = req.body.store_number || veterinary.store_number;

    const veterinaryUpdate = await veterinary.save();

    return res.status(200).json({ 
        status: 200,
        msg: 'Veterinaria Editada Correctamente',
        veterinaryUpdate
    });
};

const deleteVeterinary = async (req, res) => {
    const { id } = req.params;
    const veterinary = await Veterinary.findOne({ where: { id } });
    if (!veterinary) {
        return res.status(404).json({
            status: 400,
            msg: 'Veterinaria no encontrada'
        });
    }

    try {
        await Veterinary.destroy({where: {id}});
        return res.status(200).json({
            status: 200,
            msg: 'Veterinaria eliminada correctamente'
        })
    } catch (error) {
        console.log(error);
    }
}

export { createVeterinary, findVeterinary, editVeterinary, deleteVeterinary };