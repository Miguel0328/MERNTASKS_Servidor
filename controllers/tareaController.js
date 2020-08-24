const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.obtenerTareas = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() });
    }

    // Extraer rl proyecto y comprobar si existe
    const { proyecto } = req.query;

    try {
        // Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto: proyecto });
        res.json({ tareas });
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error en el servidor' });
    }
}

exports.crearTarea = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() });
    }

    // Extraer rl proyecto y comprobar si existe
    const { proyecto } = req.body;

    try {
        const proyectoActual = await Proyecto.findById( proyecto );

        if(!proyectoActual){
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto pertenece al usuario autenticado
        if(proyectoActual.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // Revisar si ya existe una tarea con el mismo nombre
        const { nombre } = req.body;
        let nombreExiste = await Tarea.findOne({ nombre, proyecto });
        if(nombreExiste){
            return res.status(400).json({ msg: 'La tarea ya existe' });
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea, msg: 'Tarea creada' });
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error en el servidor' });
    }
}

exports.actualizarTarea = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() });
    }

    // Extraer rl proyecto y comprobar si existe
    const { proyecto, nombre, estado } = req.body;

    try {
        // Revisar si la tarea existe
        let tareaActual = await Tarea.findById(req.params.id);
        if(!tareaActual){
            return res.status(404).json({ msg: 'La tarea no existe' });
        }

        if(tareaActual.proyecto.toString() !== proyecto){
            return res.status(400).json({ msg: 'La tarea no pertenece al proyecto' });
        }

        const proyectoActual = await Proyecto.findById(proyecto);
        if(proyectoActual.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // Revisar si ya existe una tarea con el mismo nombre
        let nombreExiste = await Tarea.findOne({ nombre, proyecto, _id: { $ne: req.params.id } });
        if(nombreExiste){
            return res.status(400).json({ msg: 'La tarea ya existe' });
        }

        // Crear un objeto con la nueva informacion
        const nuevaTarea = {};

        if(nombre) nuevaTarea.nombre = nombre;
        if(estado !== null || estado !== undefined) nuevaTarea.estado = estado;

        // Guardar la tarea
        tareaActual = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        return res.json({ tareaActual, msg: 'Tarea actualizada' });
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error en el servidor' });
    }
}

exports.eliminarTarea = async (req, res) => {
    try {
        // Revisar si la tarea existe
        const tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({ msg: 'La tarea no existe' });
        }

        const proyecto = await Proyecto.findById(tarea.proyecto);
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // Eliminar tarea
        await Tarea.findOneAndRemove({ _id: req.params.id });
        return res.json({ msg: "Tarea eliminada" })
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error en el servidor' });
    }
}