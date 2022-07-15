const socket = io();
let user;
function $ (selector){
    return document.querySelector(selector);
}

async function loadFaker (productos){
    const tpl = await fetch('/hbs/items.hbs');
    const baseItems = await tpl.text();
    let fillProds = Handlebars.compile(baseItems);
    $(".productsContainer").innerHTML = fillProds({ productos: productos });
}
socket.on('loadFaker', loadFaker);