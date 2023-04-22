//variables que seleccionamos del documento
const carrito = document.querySelector(`.submenu`);
const listaproductos = document.querySelector(`.contenedorproductos`);
const vaciar = document.querySelector(`#vaciar`);
const contenidocarrito = document.querySelector(`tbody`);
// este arreglo siempre va a tener los items del carrito
let articuloscarrito = [];
const totalhtml = document.querySelector(`.total`);
//obtenemos el total del local storage y si está vacio pues almacenamos 0
let total = Number.parseInt(localStorage.getItem("total")) || 0;
//funciones
//funcion agregarCarrito para registrar cuando damos click en agregar al carrito y guardar el contendor al cual le dimos click en producto seleccionado
listaproductos.addEventListener(`click`, agregarCarrito);
// Añadimos localstorage para que el usaurio no pierda su carrito al actualizar o salir de pagina
document.addEventListener("DOMContentLoaded", localFuncion);
function localFuncion() {
  articuloscarrito = JSON.parse(localStorage.getItem("Carrito")) || [];
  carritoHtml();
  totalhtml.innerHTML = `
  <span class="total">${total}</span>
  `;
}

function agregarCarrito(e) {
  // de esta forma ejecutamos el codigo solo si damos click en "agregar carrito"
  if (e.target.classList.contains(`agregar`)) {
    //lo siguiente que hacemos es seleccionar todo el contenedor del item fué agregado al carrito y lo enviamos a la siguiente funcion
    const productoseleccionado = e.target.parentElement;
    objetoProductoActual(productoseleccionado);
  }
}
//funcion objetoProductoActual para armar un objeto con imagen, nombre y precio de el producto que agregamos al carrito
function objetoProductoActual(producto) {
  const infoProducto = {
    imagen: producto.querySelector(`img`).src,
    nombre: producto.querySelector(`h4`).textContent,
    precio: producto.querySelector(`.precio`).textContent,
    cantidad: 1,
  };
  //Le damos valor al total para que cada vez que se de click  en agregar el carrito verifique y actualice que valor tiene, ya que entre los tres botones funcionales se enreda
  total = Number.parseInt(
    document.querySelector(`.submenucontent .total`).textContent
  );
  // para acumular el precio de todo lo que se va sumando al carrito el parsint recordemos es solamente para cambiar de tipo string a numero
  total += Number.parseInt(infoProducto.precio);

  //totalhtml representa el total en el html, y de esta manera insertamos dinamicamente el total
  totalhtml.innerHTML = `
  <span class="total">${total}</span>
  `;
  //antes agregar al carrito debemos verificar si ya estaba previameamente en la lista, si ya lo está solamente se debe sumar uno a la cantidad, sino pues agregarlo normalmente.some es la forma de iterar en un arreglo para buscar si este contiene un elemento
  const existe = articuloscarrito.some(
    (producto) => producto.imagen === infoProducto.imagen
  );
  //si existe es true entonces que simplemente le agrege 1 a la cantidad, si no lo es pues que elimine el carrito y lo cree nuevamente agregando el item seleccionado
  if (existe) {
    // se utiliza .map en este caso porque con este iterador de arreglos se obtiene un NUEVO arreglo el cual podemos modificarle la cantidad.
    articuloscarrito.map((producto) => {
      //utilizamos el condicional para cambiarle la cantidad al item correcto, sino se le cambiria la cantidad a todos y no es lo que busca
      if (producto.imagen === infoProducto.imagen) {
        producto.cantidad++;
        return producto;
      } else {
        return producto;
      }
    });
  } else {
    //este objeto se lo vamos a insertar al arreglo para que vaya mostrando los elementos en el carrito, los tres puntos son para copiar el arreglo anterior y asi almacenar cada click sin borrar el contenido anterior
    articuloscarrito = [...articuloscarrito, infoProducto];
  }
  //Se debe llamar la funcion carritoHtml desde aqui porque cada vez que agrego se debe modificar el carrito
  carritoHtml();
}
//la funcion carritoHTML se va a encargar de insertar el codigo HTML al carrito
function carritoHtml() {
  //se debe llamar la funcion limpiarHtml desde para que limpie la tabla antes de generarla nuevamente
  limpiarHtml();
  //se utiliza foreach como iterador del arreglo que lo que hace es recorrer todo el arreglo y por cada "objeto" que esta dentro arreglo el creara una fila nueva y colocará ese objeto alli
  articuloscarrito.forEach((producto) => {
    const row = document.createElement(`tr`);
    row.innerHTML = `
    <td><img src ="${producto.imagen}" width="80"></td>
    <td>${producto.nombre}</td>
    <td>  <p>$ <span class="precio">${producto.precio}</span></p></td>
    <td>${producto.cantidad}</td>
    <td><button class="botonx" >X</button></td>
    `;
    //agrega el html al tbody de la tabla del carrito
    contenidocarrito.appendChild(row);
  });
  //cadavez que interactuemos con el boton agregar modificamos el local storage
  localStorage.setItem("total", total);
  localStorage.setItem("Carrito", JSON.stringify(articuloscarrito));
}
//la funcion limpiarHtml se encarga de limpiar el carrito por cada click que se para que este no se vaya acumulando
function limpiarHtml() {
  //forma optima mejor performance: la forma en que funciona es que mientras haya un firstchild el iterador seguira funcionando y dentro de él removemos todos los child 1 a 1 hasta que ya no quede ninguno.
  while (contenidocarrito.firstChild) {
    contenidocarrito.removeChild(contenidocarrito.firstChild);
  }
}
// para registrar cuando doy click en la X y eliminar un elemento del carrito
carrito.addEventListener(`click`, eliminarUnElemento);
function eliminarUnElemento(e) {
  //colocamos la condicion para que se active solamente si le damos click a un boton "x"
  if (e.target.classList.contains(`botonx`)) {
    // creamos una variable y vamos al parent dos veces para llegar a la fila del boton que queremos remover
    const filaseleccionada = e.target.parentElement.parentElement;
    const itemaeliminar = filaseleccionada.children[1].textContent;
    const precioitemeliminado =
      filaseleccionada.querySelector(`.precio`).textContent;
    // nuevamente reiniciamos al total a lo que haya  en el HTML, es nuestra forma de comunicar los tres botones.
    total = Number.parseInt(
      document.querySelector(`.submenucontent .total`).textContent
    );
    //para restarle al total al carrito debemos tomar en cuenta la cantidad.
    const cantidad = Number.parseInt(filaseleccionada.children[3].textContent);
    total -= cantidad * precioitemeliminado;

    totalhtml.innerHTML = `
  <span class="total">${total} </span>  
  `;
    //debemos eliminar tambien del arreglo el objeto del item correspondiente para que no se coloque de nuevo cuando agreguemos otro item, podemos iterar con filter sobre cada elemento del arreglo hasta encontrar el correcto y eliminarlo del arreglo
    // utilizamos .trim porque por alguna razon la variable estaba tomando el string con espacios y asi se los eliminamos
    articuloscarrito = articuloscarrito.filter(
      (producto) => producto.nombre != itemaeliminar.trim()
    );
    //si eliminamos un item tambien debemos modificar el local storage
    localStorage.setItem("Carrito", JSON.stringify(articuloscarrito));
    localStorage.setItem("total", total);
    //generamos nuevamente el while que es la forma mas optima para eliminar html de esa fila seleccionada del html
    while (filaseleccionada.firstChild) {
      filaseleccionada.removeChild(filaseleccionada.firstChild);
    }
  }
}
//funcion vaciarCarrito para registrar cuando doy click en vaciar el carrito
vaciar.addEventListener(`click`, vaciarCarrito);
function vaciarCarrito() {
  //debemos resetear el arreglo para que despues de vaciar el carrito le den click a otro item no se coloquen todos los previos que ya existian en el arreglo
  articuloscarrito = [];
  //debemos resetear el acumulador del precio total del carrito
  total = 0;
  //Si vaciamos el carrito pues tambien actualizamos el local storage
  localStorage.setItem("Carrito", JSON.stringify(articuloscarrito));
  localStorage.setItem("total", total);
  totalhtml.innerHTML = `
  <span class="total">0</span>  
  `;
  //nuevamente el while optimo para limpiar html
  while (contenidocarrito.firstChild) {
    contenidocarrito.removeChild(contenidocarrito.firstChild);
  }
}
