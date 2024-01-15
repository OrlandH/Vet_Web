// Importar mongoose
import mongoose from "mongoose";
// Permitir que solo los campos del esquema sean almacenados en la base de datos
mongoose.set("strictQuery", true);
// Crear una funcion llamada conecxion
const connection = async () => {
  try {
    // Establecer la concexion con la base de datos
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);
    // Presentar la conexcion en consola
    console.log(
      `Database is connected on ${connection.host} - ${connection.port}`
    );
  } catch (error) {
    console.log(error);
  }
};
// Exportar la funcion
export default connection;
