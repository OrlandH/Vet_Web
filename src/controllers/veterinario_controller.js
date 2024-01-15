import Veterinario from "../models/Veterinario.js";
import {
  sendMailToUser,
  sendMailToRecoveryPassword
} from "../config/nodemailer.js";

import generarJWT from "../helpers/crearJWT.js";

// Metodo para el login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (Object.values(req.body).includes(""))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  const veterinarioBDD = await Veterinario.findOne({ email });
  if (veterinarioBDD?.confirmEmail === false)
    return res
      .status(403)
      .json({ msg: "Lo sentimos, debe verificar su cuenta" });
  if (!veterinarioBDD)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
  const verificarPassword = await veterinarioBDD.matchPassword(password);
  if (!verificarPassword)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el password no es el correcto" });

  const token = generarJWT(veterinarioBDD._id, "veterinario");
  const { nombre, apellido, direccion, telefono, _id } = veterinarioBDD;
  res.status(200).json({
    token,
    nombre,
    apellido,
    direccion,
    telefono,
    _id,
    email: veterinarioBDD.email,
  });
};
// Metodo para el perfil
const perfil = (req, res) => {
  res.status(200).json({ res: "perfil del veterinario" });
};
// Metodo para el registro
const registro = async (req, res) => {
  const { email, password } = req.body;
  if (Object.values(req.body).includes(""))
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  const verificarEmailBDD = await Veterinario.findOne({ email });
  if (verificarEmailBDD)
    return res
      .status(400)
      .json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
  const nuevoVeterinario = new Veterinario(req.body);
  nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password);

  const token = nuevoVeterinario.crearToken();
  await sendMailToUser(email, token);
  await nuevoVeterinario.save();
  res
    .status(200)
    .json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });
};
// Confirmar el token
const confirmEmail = async (req, res) => {
  if (!req.params.token)
    return res
      .status(400)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  const veterinarioBDD = await Veterinario.findOne({ token: req.params.token });
  if (!veterinarioBDD?.token)
    return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" });
  veterinarioBDD.token = null;
  veterinarioBDD.confirmEmail = true;
  await veterinarioBDD.save();
  res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" });
};
// Listar veterinarios
const listarVeterinarios = (req, res) => {
  res.status(200).json({ res: "lista de veterinarios registrados" });
};
// Metodo detalle de un veterinario
const detalleVeterinario = (req, res) => {
  res.status(200).json({ res: "detalle de un eterinario registrado" });
};
// Metodo para actulizar el perfil
const actualizarPerfil = (req, res) => {
  res
    .status(200)
    .json({ res: "actualizar perfil de un veterinario registrado" });
};
// Metodo para actulizar el password
const actualizarPassword = (req, res) => {
  res
    .status(200)
    .json({ res: "actualizar password de un veterinario registrado" });
};
// Metodo para recuperar el password
const recuperarPassword = async (req, res) => {
  const { email } = req.body;
  if (Object.values(req.body).includes(""))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  const veterinarioBDD = await Veterinario.findOne({ email });
  if (!veterinarioBDD)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
  const token = veterinarioBDD.crearToken();
  veterinarioBDD.token = token;
  await sendMailToRecoveryPassword(email, token);
  await veterinarioBDD.save();
  res
    .status(200)
    .json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
};
// Metodo para comprobar el Token
const comprobarTokenPasword = async (req, res) => {
  if (!req.params.token)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  const veterinarioBDD = await Veterinario.findOne({ token: req.params.token });
  if (veterinarioBDD?.token !== req.params.token)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  await veterinarioBDD.save();
  res
    .status(200)
    .json({ msg: "Token confirmado, ya puedes crear tu nuevo password" });
};
// Metodo para crear el nuevo password
const nuevoPassword = async (req, res) => {
  const { password, confirmpassword } = req.body;
  if (Object.values(req.body).includes(""))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  if (password != confirmpassword)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, los passwords no coinciden" });
  const veterinarioBDD = await Veterinario.findOne({ token: req.params.token });
  if (veterinarioBDD?.token !== req.params.token)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  veterinarioBDD.token = null;
  veterinarioBDD.password = await veterinarioBDD.encrypPassword(password);
  await veterinarioBDD.save();
  res
    .status(200)
    .json({
      msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password",
    });
};

// Exportar cada uno de los metodos
export {
  login,
  perfil,
  registro,
  confirmEmail,
  listarVeterinarios,
  detalleVeterinario,
  actualizarPerfil,
  actualizarPassword,
  recuperarPassword,
  comprobarTokenPasword,
  nuevoPassword,
};