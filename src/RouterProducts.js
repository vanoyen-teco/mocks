const express = require('express');
const routerProds = express.Router();
const { faker } = require('@faker-js/faker');

routerProds.use(express.raw());
routerProds.use(express.json());
routerProds.use(express.urlencoded({extended:true})); 

routerProds.get('/productos-test',(req, res)=>{
    res.render("homeTest", {
        pageTitle: "Entregable Nº 8 - Api",
        scripts : [{ script: '/socket.io/socket.io.js'}, { script: '/handlebars.js'}, { script: '/homeTest.js'}],
        isApi: true
    });
});

function getRandom(num = 5){
    let productos = [];
    for (let index = 1; index <= num; index++) {
        let prod = {};
        prod.id = faker.database.mongodbObjectId();
        prod.titulo = faker.commerce.productName();
        prod.precio = faker.commerce.price(100, 2000, 0);
        prod.thumbnail = faker.image.technics(200, 200, true);
        productos.push(prod);
    }
    return productos;
}


module.exports = {
    routerProds,
    getRandom 
};