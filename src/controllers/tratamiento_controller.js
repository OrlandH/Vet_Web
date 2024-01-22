import Tratamiento from "../models/Tratamiento.js"
import mongoose from "mongoose";
const detalleTratamiento = (req,res)=>{
    res.send("Detalle del tratamiento")
}
const registrarTratamiento = async (req,res)=>{
    const {paciente} = req.body
    if( !mongoose.Types.ObjectId.isValid(paciente) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    const tratamiento = await Tratamiento.create(req.body)
    res.status(200).json({msg:`Registro exitoso del tratamiento ${tratamiento._id}`,tratamiento})
}
const actualizarTratamiento = (req,res)=>{
    res.send("Actualizar tratamiento")
}
const eliminarTratamiento = (req,res)=>{
    res.send("Eliminar tratamiento")
}
const cambiarEstado = (req,res)=>{
    res.send("Cambiar estado del tratamiento")
}

export {
    detalleTratamiento,
    registrarTratamiento,
    actualizarTratamiento,
    eliminarTratamiento,
    cambiarEstado
}