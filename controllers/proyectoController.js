const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ nombre: 1 });
        res.json({ proyectos });
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error en el servidor' });
    }
}

exports.crearProyecto = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        // Revisar si ya existe un proyecto con el mismo nombre
        const { nombre } = req.body;
        let nombreExiste = await Proyecto.findOne({ nombre });
        if(nombreExiste){
            return res.status(400).json({ msg: 'El proyecto ya existe' });
        }

        // Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        // Guardamos el proyecto
        proyecto.save();
        res.json({proyecto, msg: 'Proyecto creado' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor' });
    }
};

// Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() });
    }   
    
    // Extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // Si el proyecto existe
        if(!proyecto) {
            res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Verificar creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        // Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });
        return res.json({ proyecto, msg: 'Proyecto actualizado' });
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error en el servidor' });
    }
}

// Eliminar un proyecto
exports.eliminarProyecto = async (req, res) => {
    try {
        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // Si el proyecto existe
        if(!proyecto) {
            res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Verificar creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        // Eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        return res.json({ msg: 'Proyecto eliminado' });
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error en el servidor' });
    }
}