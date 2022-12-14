window.addEventListener("load", inicio)
const sistema = new Sistema();

const maxMinutosPorDia = 480;

function inicio(){
	document.getElementById("altaEmpresa").addEventListener("submit", altaEmpresa);
	document.getElementById("altaPresentacion").addEventListener("submit", altaPresentacion);
	document.getElementById("busquedaPresentaciones").addEventListener("submit", buscarPresetaciones);
	
	actualizarPantalla()
}

function actualizarPantalla() {
	actualizarTabla();
	const empresas = sistema.listarEmpresas();
	
	if(empresas.length > 0) {
		actualizarEmpresasSelect();
		const ulEmpresasReg = document.getElementById("empresasRegistradas");
		ulEmpresasReg.innerHTML = "";
		
		for(const empresa of empresas) {
			const li = document.createElement("li");
			li.innerHTML = "<strong>Nombre: </strong>"  + empresa.nombre + "<strong> Dirección:</strong> "  + empresa.direccion + "<strong> Teléfono:</strong> " + empresa.telefono + "<strong> Origen: </strong>"  + empresa.origen;
			ulEmpresasReg.appendChild(li);
		}
		
		const presentaciones = sistema.listarPresentaciones();
		if(presentaciones.length > 0){
			const pDurPromedio = document.getElementById("duracionPromedio");
			
			let max = 0;
			for(const presentacion of presentaciones) {
				max += presentacion.duracion;
			}
			pDurPromedio.innerText = Math.trunc(max / (presentaciones.length)) + " minutos";
			
			const ulEmpresaMaxCant = document.getElementById("empresaMaxCant");
			ulEmpresaMaxCant.innerHTML = "";
			let contador = 0;
			for(let i = 0; i < empresas.length; i++) {
				for (let j = 0; j < presentaciones.length; j++) {
					if(presentaciones[j].empresa === empresas[i].nombre) {
						contador++;
					}
				}
				
				const li = document.createElement("li");
				li.innerHTML = empresas[i].nombre + " - " + contador;
				ulEmpresaMaxCant.appendChild(li);
				contador = 0;
			}
			
			const ulTotalPorTipo = document.getElementById("totalPorTipo");
			ulTotalPorTipo.innerHTML = "";
			const temas = ["Inteligencia Artificial", "Big Data", "Mobile", "Redes", "Seguridad", "Hardware"];
			for(let i = 0; i < temas.length; i++) {
				for (let j = 0; j < presentaciones.length; j++) {
					if(presentaciones[j].tema === temas[i]) {
						contador++;
					}
				}
				
				const li = document.createElement("li");
				li.innerHTML = temas[i] + " - " + contador;
				ulTotalPorTipo.appendChild(li);
				contador = 0;
			}
		} 
	}
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
		actualizarPantalla();
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
	const empresa = document.getElementById("altaPresentacionEmpresa");
	const titulo = document.getElementById("altaPresentacionTitulo");
	const descripcion = document.getElementById("altaPresentacionDireccion");
	const tema = document.getElementById("altaPresentacionTema");
	const dia = document.getElementById("altaPresentacionDia");
	const duracion = document.getElementById("altaPresentacionDuracion");
	
	const exsitePresentacion = sistema.econtrarPresentacionPorTitulo(titulo.value);
	if(exsitePresentacion) {
		alert("Ya existe una presentacion con ese titulo.");
	} else {
		
		if(sistema.listarEmpresas().length > 0) {
			const presentacionesDelMismoDia = sistema.listarPresentacionesPorDia(parseInt(dia.value));
			let cantidadMinutosReservados = 0;
			for(const presentacion of presentacionesDelMismoDia) {
				cantidadMinutosReservados += presentacion.duracion;
			}
			
			if((cantidadMinutosReservados + parseInt(duracion.value)) <= maxMinutosPorDia) {
				sistema.agregarPresentacion(new Presentacion(empresa.value, titulo.value, descripcion.value, tema.value, parseInt(dia.value), parseInt(duracion.value)));
				actualizarPantalla();
				titulo.value = "";
				descripcion.value = "";
			} else {
				alert("No queda disponibilidad el dia " + dia.value + " para la duracion " + duracion.value);
			}
		} else {
			alert("Debe asignar una empresa para crear una presentacion.");
		}
	}
}

function actualizarTabla() {
	const presentaciones = sistema.listarPresentaciones();
	const tbl = document.getElementById("tbl");
	tbl.innerHTML = "";
	
	const rowTitulo = tbl.insertRow();
	let celda = rowTitulo.insertCell();
	
	if(presentaciones.length === 0) {
		celda.innerText = "No hay presentaciones registradas";
		return;
	}
	
	celda.innerText = "Día y hora";
	celda.style.width = "150px"
	celda = rowTitulo.insertCell();
	celda.innerText = "Presentación";
	
	
	const ordenadosPorTema = presentaciones.sort(function (a, b) {
		return a.titulo.localeCompare(b.titulo);
	});
		
	const ordenadosPorDia = ordenadosPorTema.sort(function (a, b) {
		return a.dia-b.dia;
	});
		
	let hora = 8;
	let minutos = 0;
	let tituloActual = ordenadosPorDia[0].titulo;
	let diaActual = ordenadosPorDia[0].dia;
	for(const presentacion of ordenadosPorDia) {
		if(diaActual !== presentacion.dia) {
			hora = 8;
			minutos = 0;
			diaActual = presentacion.dia;
		} else if(tituloActual !== presentacion.titulo) {
			minutos += 15;
			if(minutos === 60){
				minutos = 0;
				hora++;
			}
			tituloActual = presentacion.titulo;
		}
		
		const pres = tbl.insertRow();
		pres.classList.add("dia" + presentacion.dia);
			
		const diaHora = pres.insertCell();
		if(minutos === 0) {
			diaHora.innerText = presentacion.dia + " - " + hora + ":" + minutos + "0";
		} else {
			diaHora.innerText = presentacion.dia + " - " + hora + ":" + minutos;
		}
		
		const tema = pres.insertCell();
		tema.innerText =  presentacion.titulo + " " + " Descripcion: " + presentacion.descripcion + " Tema: " +  presentacion.tema + " Dia: " + presentacion.dia + " Empresa: " + presentacion.empresa;
		tema.rowSpan = presentacion.duracion / 15;
		
		for(let i = 1; i < (presentacion.duracion / 15); i++) {
			minutos = minutos + 15;
			if(minutos >= 60) {
				hora++;
				minutos = 0;
			}

			const rowx = tbl.insertRow();
			rowx.classList.add("dia" + presentacion.dia);
			const celdax = rowx.insertCell();
			
			if(minutos === 0) {
				celdax.innerText = presentacion.dia + " - " + hora + ":" + minutos + "0";
			} else {
				celdax.innerText = presentacion.dia + " - " + hora + ":" + minutos;
			}
		}
	}
}

function buscarPresetaciones(event) {
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
				if((presentacion.descripcion.toLowerCase()).includes(palabra)) {
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
			return a.titulo.localeCompare(b.titulo);
		});
		const ordenadosPorDia = ordenadosPorTema.sort(function (a, b) {
			return a.dia-b.dia;
		});
		
		for(const presentacion of ordenadosPorDia){ 
			const li = document.createElement("li");
			li.innerHTML = `<strong>Titulo:</strong> ${presentacion.titulo} - <strong>Descripcion:</strong> ${presentacion.descripcion} - <strong>Tema:</strong> ${presentacion.tema} - <strong>Dia:</strong> ${presentacion.dia} - <strong>Empresa:</strong> ${presentacion.empresa}`;
			ul.appendChild(li);
		}
	} else {
		const li = document.createElement("li");
		li.innerHTML = "Sin resultados.";
		ul.appendChild(li);
	}
}
