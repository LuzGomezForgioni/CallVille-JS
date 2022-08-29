const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

// Eventos
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"));
        pintarCarrito();
    }
});

cards.addEventListener("click", (e) => {
    addCarrito(e);

});
items.addEventListener("click", (e) => {btnAumentarDisminuir(e);});

// Traer productos de JSON
const fetchData = async () => {
    try {
        const res = await fetch("productos.json");
        const data = await res.json();
        pintarCards(data);
    } catch (error) {
        console.log(error);
    }
};

// Pintar productos
const pintarCards = (data) => {
    data.forEach((producto) => {
        templateCard.querySelector("h5").textContent = producto.nombreProducto;
        templateCard.querySelector("p").textContent = producto.precio;
        templateCard.querySelector("img").setAttribute("src", producto.imagen);
        templateCard.querySelector(".btn-dark").dataset.id = producto.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
};

// Agregar al carrito
const addCarrito = (e) => {
    if (e.target.classList.contains("btn-dark")) {
        setCarrito(e.target.parentElement);
        Toastify({
            text: `✔️ Se agrego correctamente`,
            duration: 3000,
            gravity: 'bottom',
            position: 'left',
            style: {
                background: 'background-image: radial-gradient(circle at 50% -20.71%, #ffffff 0, #ecfaff 16.67%, #d1edf8 33.33%, #b5def2 50%, #99cfec 66.67%, #7fc1e7 83.33%, #66b3e3 100%);'
            }
        }).showToast();
    }
    e.stopPropagation();
};

const setCarrito = (item) => {
    const producto = {
        nombreProducto: item.querySelector("h5").textContent,
        precio: item.querySelector("p").textContent,
        id: item.querySelector(".btn-dark").dataset.id,
        cantidad: 1,
    };
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    carrito[producto.id] = { ...producto };
    pintarCarrito();
};

const pintarCarrito = () => {
    items.innerHTML = "";

    Object.values(carrito).forEach((producto) => {
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelectorAll("td")[0].textContent = producto.nombreProducto;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        templateCarrito.querySelector("span").textContent =
            producto.precio * producto.cantidad;

        //Botones
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);

    pintarFooter();

    localStorage.setItem("carrito", JSON.stringify(carrito));
};

const pintarFooter = () => {
    footer.innerHTML = "";

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - Comience a comprar!</th>
        `;
        return;
    }

    //Sumar cantidad y totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0);

    templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);

    footer.appendChild(fragment);

    const boton = document.querySelector("#vaciar-carrito");
    boton.addEventListener("click", () => {
        Toastify({
            text: `Carrito vaciado`,
            duration: 3000,
            gravity: 'bottom',
            position: 'left',
            style: {
                background: 'background-image: radial-gradient(circle at 50% -20.71%, #ffffff 0, #ecfaff 16.67%, #d1edf8 33.33%, #b5def2 50%, #99cfec 66.67%, #7fc1e7 83.33%, #66b3e3 100%);'
            }
        }).showToast();
        carrito = {};
        pintarCarrito();
    });

    const comprar = document.querySelector("#comprar");
    comprar.addEventListener("click", () => {
        Toastify({
            text: `Compra exitosa! 🤩`,
            duration: 3000,
            gravity: 'bottom',
            position: 'left',
            style: {
                background: 'background-image: radial-gradient(circle at 50% -20.71%, #ffffff 0, #ecfaff 16.67%, #d1edf8 33.33%, #b5def2 50%, #99cfec 66.67%, #7fc1e7 83.33%, #66b3e3 100%);'
            }
        }).showToast();
        carrito = {};
        pintarCarrito();
    });
};

const btnAumentarDisminuir = (e) => {
    if (e.target.classList.contains("btn-info")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = { ...producto };
        pintarCarrito();
    }

    if (e.target.classList.contains("btn-danger")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        } else {
            carrito[e.target.dataset.id] = { ...producto };
        }
        pintarCarrito();
    }
    e.stopPropagation();
};