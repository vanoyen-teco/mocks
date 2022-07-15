const Container = require("./ContenedorMongoDb");
async function getAll(){
    const allMsgs = Container.getAll();
    return allMsgs;
}

async function save(msj){
    const updated = await Container.save(msj);
    return updated;
}


module.exports = {
    getAll,
    save,
};