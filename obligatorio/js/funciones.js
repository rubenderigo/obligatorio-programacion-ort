window.addEventListener("load", inicio)
const sistema = new Sistema();

const maxMinutosPorDia = 480;

function inicio(){
	sistema.agregarEmpresa(new Empresa("Globant", "Av. Italia 22", "092 231 123", "extranjera"));
	sistema.agregarPresentacion(new Presentacion("Globant", "p5", "tema", "1era presentacion del dia 1 de 30 minutos", 1, 30));
	//sistema.agregarPresentacion(new Presentacion("Globant", "p4", "press primero", "b", "2", "15"));
	//sistema.agregarPresentacion(new Presentacion("Globant", "p3", "press primero", "a", "2", "15"));
	//sistema.agregarPresentacion(new Presentacion("Globant", "p2", "press segunda segunda", "a", "3", "15"));
	actualizarEmpresasSelect();
	actualizarTabla();
	
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

function altaPresentacion (event) {
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
		
		console.log(cantidadMinutosReservados, parseInt(duracion.value))
		if((cantidadMinutosReservados + parseInt(duracion.value)) <= maxMinutosPorDia) {
			sistema.agregarPresentacion(new Presentacion(empresa.value, titulo.value, descripcion.value, tema.value, parseInt(dia.value), parseInt(duracion.value)));
			titulo.value = "";
			descripcion.value = "";
			
			actualizarTabla();
		} else {
			alert("No queda disponibilidad el dia " + dia.value + " para la duracion " + duracion.value);
		}
	}
}

function actualizarTabla() {
	const presentaciones = sistema.listarPresentaciones();
	
	if(presentaciones.length > 0) {
		const presentacionesOrdenadasPorDia = presentaciones.sort(function(a, b) {
			return a.dia-b.dia;
		});
		const tbl = document.getElementById("tbl");
		tbl.innerHTML = "";
		const rowTitulos = document.createElement('tr');
		
		const celda = document.createElement('td');
		celda.appendChild(document.createTextNode("Día y hora"));
		rowTitulos.appendChild(celda);
		
		const celda2 = document.createElement('td');
		celda2.appendChild(document.createTextNode("Presentación"));
		rowTitulos.appendChild(celda2);
		
		tbl.appendChild(rowTitulos);
		
		let hora = 8;
		let minutos = 0;
		for(const presentacion of presentacionesOrdenadasPorDia) {
			
			const row2 = document.createElement('tr');
			
			const celdaDia = document.createElement('td');
			celdaDia.appendChild(document.createTextNode(`${presentacion.dia} - ${hora}:${minutos}`));
			row2.appendChild(celdaDia);
			
			const celdaTema = document.createElement('td');
			celdaTema.appendChild(document.createTextNode(presentacion.titulo));
			celdaTema.rowSpan = presentacion.duracion / 15;
			row2.appendChild(celdaTema);
			tbl.appendChild(row2);
			
			for(let i = 1; i < (presentacion.duracion / 15); i++) {
				minutos = minutos + (i * 15);
				const rowx = document.createElement('tr');
				const celdax = document.createElement('td');
				celdax.appendChild(document.createTextNode(`${presentacion.dia} - ${hora}:${minutos}`));
				rowx.appendChild(celdax);
				tbl.appendChild(rowx);
			}
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
