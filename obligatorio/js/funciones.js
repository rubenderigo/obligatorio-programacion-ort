window.addEventListener("load", inicio)
const sistema = new Sistema();

function inicio(){
	document.getElementById("altaEmpresa").addEventListener("submit", altaEmpresa);
}

function altaEmpresa(event) {
	event.preventDefault();
	const nombre = document.getElementById("altaNombreEmpresa").value;
	const direccion = document.getElementById("altaDireccionEmpresa").value;
	const telefono = document.getElementById("altaTelefonoEmpresa").value;
	let origen;
	for(const radio of document.getElementsByName("altaOrigenEmpresa")) {
		if(radio.checked){
			origen = radio.value;
		}
	}
	
	const nuevaEmpresa = new Empresa(nombre, direccion, telefono, origen);
	sistema.agregarEmpresa(nuevaEmpresa);
}