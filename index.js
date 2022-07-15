require('dotenv/config');
// Config del servidor
const express = require('express');
const app = express();
const apiRouter = require('./src/RouterApi');
const apiRouterProds = require('./src/RouterProducts');
const path = require('path');
const PORT = process.env.PORT || 8080;
const handlebars = require('express-handlebars')
const {engine} = handlebars;

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const controladorMensajes = require('./src/modules/controladorMensajes');
const tools = require('./src/modules/normalizerTools');


function refreshIoTableProds(){
    apiRouter.Controlador.getProductos()
    .then((prods)=>{
        if(!Array.isArray(prods)){
            prods = false; 
        }else{
            io.sockets.emit('refreshProductos', prods);
        }
    })
}

function loadFaker(){
    let prods = apiRouterProds.getRandom();
    io.sockets.emit('loadFaker', prods);
}

function refreshMensajeria(){
    controladorMensajes.getAll()
    .then((chat)=>{
        io.sockets.emit('refreshMessages', tools.normalizar(chat));
    })
    .catch((error)=>{error.message});
}

app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "layout.hbs",
    })
);

app.set("views", "./src/views");
app.set("view engine", "hbs");

app.use("/api/", apiRouterProds.routerProds);
app.use('/', apiRouter.router);
app.use('/', apiRouter.errorHandler);

app.use(express.static(path.join(__dirname ,'public')));

io.on('connection', (socket) => {
    refreshIoTableProds();
    refreshMensajeria();
    loadFaker();
    socket.on('new-product', (item) => {
        const prod = apiRouter.Controlador.saveProducto(item);
        if(prod){
            refreshIoTableProds();
        }else{
            console.log('error');
        }
    });

    socket.on('new-message', (msg, author) => {
        const msj = {...author};
        msj.text = msg;
        msj.time = new Date().toLocaleString();
        controladorMensajes.save(msj)
        .then((res)=>{
            (res != null)?refreshMensajeria():false;
        })
        .catch((error)=>{error.message});
    });

});

server.listen(PORT, () => {
    console.log('Servidor iniciado.');
})

server.on("error", error => console.log(`Error en servidor ${error}`));