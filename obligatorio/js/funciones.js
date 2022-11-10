window.addEventListener("load", inicio)
const sistema = new Sistema();

function inicio(){
	document.getElementById("altaEmpresa").addEventListener("submit", altaEmpresa);
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
		alert("Una empresa con ese nombre ya existe");
	} else {
		const nuevaEmpresa = new Empresa(nombre.value, direccion.value, telefono.value, origen.value);
		sistema.agregarEmpresa(nuevaEmpresa);
		actualizarEmpresasSelect();
		nombre.value = "";
		direccion.value = "";
		telefono.value = "";
	}
}

function actualizarEmpresasSelect (nombre) {
	const empresasSelect = document.getElementById("altaPresentacionEmpresa");
	empresasSelect.innerHTML = "";
	
	for(const empresa of sistema.listarEmpresas()) {
		const optionEmpresa = document.createElement("option");
		optionEmpresa.value =  empresa.nombre;
		optionEmpresa.text = empresa.nombre;
		empresasSelect.add(optionEmpresa, null);
	}
}