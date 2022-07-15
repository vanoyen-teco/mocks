const socket = io();
let user;
let author;
function $ (selector){
    return document.querySelector(selector);
}
function getFormProd(){
    const prod = {};
    prod.titulo = $("input[name='titulo']").value;
    prod.precio = $("input[name='precio']").value;
    prod.thumbnail = $("input[name='thumbnail']").value;
    return prod;
}

(function () {
'use strict'
let forms = document.querySelectorAll('.needs-validation');
Array.prototype.slice.call(forms)
    .forEach(function (form) {
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');
        }else{
            event.preventDefault();
            event.stopPropagation();
            
            if(event.target.id == 'altaProducto'){
                socket.emit('new-product', getFormProd());
            }else if(event.target.id == 'formUser'){
                if($("#inp_user").value != ''){
                    user = $("#inp_user").value;
                    author = {
                        id: user,
                        nombre:  $("#inp_nombre").value,
                        apellido: $("#inp_apellido").value,
                        edad: $("#inp_edad").value,
                        alias: $("#inp_alias").value,
                        avatar: $("#inp_avatar").value
                    }
                    $("#userSetted").innerHTML = user;
                    $(".badge-user").classList.remove('d-none');
                    $("#inp_user").blur();
                    $("#formUser").classList.remove('was-validated');
                    $("#formMsg").classList.remove('d-none');
                    $("#formMsg").scrollIntoView();
                    $("#formUser").reset();
                    
                }
            }else if(event.target.id == 'formMsg'){
                let msg = $("#inp_msj").value;
                socket.emit('new-message', msg, author);
            }
        }        
    }, false)
    })
})();

function desnormalizar(messages){
    const authorSchema = new normalizr.schema.Entity('authors')
    const messageSchema = new normalizr.schema.Entity('mensajes', {
        author: authorSchema,
    },{idAttribute:'email'})
    const allMessages = new normalizr.schema.Entity('global', {
        messages: [messageSchema],
    })    
    
    return normalizr.denormalize(messages.result,allMessages,messages.entities);
}

document.querySelectorAll(".btnScrollTo").forEach(btn => {
    btn.addEventListener('click', function handleClick(e) {
        e.preventDefault();
        document.getElementById(this.getAttribute("href")).scrollIntoView();
    });
});

async function refreshProductos (productos){
    const tpl = await fetch('/hbs/items.hbs');
    const baseItems = await tpl.text();
    let fillProds = Handlebars.compile(baseItems);
    $(".productsContainer").innerHTML = fillProds({ productos: productos });
    $("#altaProducto").classList.remove('was-validated');
    $("#altaProducto").reset();
}
async function refreshMessages (messages){
    const datos = desnormalizar(messages);
    const tpl = await fetch('/hbs/message.hbs');
    const baseMsgs = await tpl.text();
    let fillMsgs = Handlebars.compile(baseMsgs);
    const calc = Math.ceil(((JSON.stringify(messages).length * 100) / JSON.stringify(datos).length));
    let msjs = datos.messages.map(function(msj) {
        return {user: msj.author.id, time: msj.time, message: msj.message};
    });
    $("#chatContainer").innerHTML = fillMsgs({ mensajes: msjs });
    $("#formMsg").classList.remove('was-validated');
    $("#formMsg").reset();
    $(".red_num").innerHTML = calc;
}


socket.on('refreshProductos', refreshProductos);

socket.on('refreshMessages', refreshMessages);