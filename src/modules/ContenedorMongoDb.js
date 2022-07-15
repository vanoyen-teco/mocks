require('dotenv/config');
const mongoose = require('mongoose');
const url = process.env.MONGO_STRING;

mongoose.connect(url)
.catch( (err) => {
    console.error(`Error connecting to the database. n${err}`);
})

const Schema = mongoose.Schema;
const MsgModelSchema = new Schema({
    author: {
        id: { type: String },
        nombre: { type: String },
        apellido: { type: String },
        edad: { type: Number },
        alias: { type: String },
        avatar: { type: String },
    },
    message: { type: String },
    time: {type: String}
});
const MsgModel = mongoose.model('mensaje', MsgModelSchema );

async function getAll(){
    const all = await MsgModel.find();
    return all;
}

async function save(msj){
    let mensaje = {
        author: {
            id: msj.id,
            nombre: msj.nombre,
            apellido: msj.apellido,
            edad: parseInt(msj.edad),
            alias: msj.alias,
            avatar: msj.avatar,
        },
        message: msj.text,
        time: msj.time
    }
    MsgModel.create(mensaje, function (err, prod) {
        if (err) return handleError(err);
    })
    return true;
}

module.exports = {
    getAll,
    save,
};