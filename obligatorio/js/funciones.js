window.addEventListener("load", inicio)
const sistema = new Sistema();

const maxMinutosPorDia = 480;

function inicio(){
	sistema.agregarEmpresa(new Empresa("Globant", "Av. Italia 22", "092 231 123", "extranjera"));
	actualizarEmpresasSelect();
	
	document.getElementById("altaEmpresa").addEventListener("submit", altaEmpresa);
	document.getElementById("altaPresentacion").addEventListener("submit", altaPresentacion);
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
		sistema.agregarPresentacion(new Presentacion(empresa.value, titulo.value, descripcion.value, tema.value, dia.value, duracion.value));
		titulo.value = "";
		descripcion.value = "";
	}
}