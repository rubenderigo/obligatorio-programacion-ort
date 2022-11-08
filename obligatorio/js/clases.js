class Sistema {
	constructor(){
		this.empresas = []
	}
	
	agregarEmpresa(empresa){
		this.empresas.push(empresa);
	}
	
	listarEmpresas() {
		return this.empresas
	}
}

class Empresa {
	constructor(nombre, direccion, telefono, origen){
		this.nombre = nombre;
		this.direccion = direccion;
		this.telefono = telefono;
		this.origen = origen;
	}
}

class Presentacion {
	
}