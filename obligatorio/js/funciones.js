window.addEventListener("load", inicio)
const sistema = new Sistema();

const maxMinutosPorDia = 480;

function inicio(){
	sistema.agregarEmpresa(new Empresa("Globant", "Av. Italia 22", "092 231 123", "extranjera"));
	sistema.agregarPresentacion(new Presentacion("Globant", "p5", "press tercero", "a", "5", "15"));
	sistema.agregarPresentacion(new Presentacion("Globant", "p4", "press primero", "b", "1", "15"));
	sistema.agregarPresentacion(new Presentacion("Globant", "p3", "press primero", "a", "1", "15"));
	sistema.agregarPresentacion(new Presentacion("Globant", "p2", "press segunda segunda", "a", "2", "15"));
	actualizarEmpresasSelect();
	
	document.getElementById("altaEmpresa").addEventListener("submit", altaEmpresa);
	document.getElementById("altaPresentacion").addEventListener("submit", altaPresentacion);
	document.getElementById("busquedaPresentaciones").addEventListener("submit", buscarPresnetaciones);
}

function altaEmpresa(event) {
	event.preventDefault();
	const nombre = document.getElementById("altaNombreEmpresa");
	const direccion = document.getElementById("altaDireccionEmpresa");
	const telefono = document.getElementById("altaTelefonoEmpresa");
	let origen;
	for(const radio of document.getElementsByName("altaOrigenEmpresa")) {
		if(radio.checked){
			origen = radio;
		}
	}
	
	const existeEmpresa = sistema.econtrarEmpresaPorNombre(nombre.value);
	if(existeEmpresa) {
		alert("Una empresa con ese nombre ya existe.");
	} else {
		sistema.agregarEmpresa(new Empresa(nombre.value, direccion.value, telefono.value, origen.value));
		actualizarEmpresasSelect();
		nombre.value = "";
		direccion.value = "";
		telefono.value = "";
	}
}

function actualizarEmpresasSelect() {
	const empresasSelect = document.getElementById("altaPresentacionEmpresa");
	empresasSelect.innerHTML = "";
	
	for(const empresa of sistema.listarEmpresas()) {
		const optionEmpresa = document.createElement("option");
		optionEmpresa.value =  empresa.nombre;
		optionEmpresa.text = empresa.nombre;
		empresasSelect.add(optionEmpresa, null);
	}
}

function altaPresentacion () {
	event.preventDefault();
	const empresa = document.getElementById("altaNombreEmpresa");
	const titulo = document.getElementById("altaPresentacionTitulo");
	const descripcion = document.getElementById("altaPresentacionDireccion");
	const tema = document.getElementById("altaPresentacionTema");
	const dia = document.getElementById("altaPresentacionDia");
	const duracion = document.getElementById("altaPresentacionDuracion");
	
	const exsitePresentacion = sistema.econtrarPresentacionPorTitulo(titulo.value);
	if(exsitePresentacion) {
		alert("Ya existe una presentacion con ese titulo.");
	} else {
		
		const presentacionesDelMismoDia = sistema.listarPresentacionesPorDia(dia.value);
		let cantidadMinutosReservados = 0;
		for(const presentacion of presentacionesDelMismoDia) {
			cantidadMinutosReservados += presentacion.duracion;
		}
		
		if((cantidadMinutosReservados + parseInt(duracion.value)) <= maxMinutosPorDia) {
			sistema.agregarPresentacion(new Presentacion(empresa.value, titulo.value, descripcion.value, tema.value, parseInt(dia.value), parseInt(duracion.value)));
			titulo.value = "";
			descripcion.value = "";
		} else {
			alert("No queda disponibilidad el dia " + dia.value + " para la duracion " + duracion.value);
		}
	}
}

function buscarPresnetaciones(event) {
	event.preventDefault();
	const contieneTodasCheck = document.getElementById("contieneTodasBuscar");
	const palabrasBuscadas = document.getElementById("busquedaEnDescripcion").value.trim().toLowerCase();
	
	const presentacionesEnSistema = sistema.listarPresentaciones();
	const presentaciones = [];
	
	for(const presentacion of presentacionesEnSistema){
		if(contieneTodasCheck.checked){
			const descripcion = presentacion.descripcion.toLowerCase();
			const index = descripcion.indexOf(palabrasBuscadas);
			if(index !== -1){
				if(index === 0 || descripcion.charAt(index -1) === " ") {
					const ultimoIndex = index + palabrasBuscadas.length;
					if((descripcion.length === (ultimoIndex)) || (descripcion.length > ultimoIndex && (descripcion.charAt(ultimoIndex) == " "))) {
							presentaciones.push(presentacion)
					}
				}
			}
		} else {
			const palabras = palabrasBuscadas.split(" ").filter((palabra) => palabra !== ""); 
			for(const palabra of palabras) {
				if(presentacion.descripcion.includes(palabra)) {
					presentaciones.push(presentacion)
					break;
				}
			}
		}
	}
	
	agregarEnLista(presentaciones)
}


function agregarEnLista(presentaciones) {
	// título, descripción, tema, día y empresa
	const ul = document.getElementById("resultadoBusqueda");
	ul.innerHTML = "";
	
	if(presentaciones.length > 0) {
		const ordenadosPorTema = presentaciones.sort(function (a, b) {
			return a.tema.localeCompare(b.tema);
		});
		const ordenadosPorDia = ordenadosPorTema.sort(function (a, b) {
			return a.dia-b.dia;
		});
		
		for(const presentacion of ordenadosPorDia){ 
			const li = document.createElement("li");
			li.innerHTML = ` <strong>Titulo:</strong> ${presentacion.titulo} - <strong>Descripcion:</strong> ${presentacion.descripcion} - <strong>Tema:</strong> ${presentacion.tema} - <strong>Dia:</strong> ${presentacion.dia} - <strong>Empresa:</strong> ${presentacion.empresa}`;
			ul.appendChild(li);
		}
	} else {
		const li = document.createElement("li");
		li.innerHTML = "Sin resultados.";
		ul.appendChild(li);
	}
}
