class Sistema {
	constructor(){
		this.empresas = []
	}
	
	agregarEmpresa(empresa){
		this.empresas.push(empresa);
	}
	
	listarEmpresas() {
		return this.empresas;
	}
	
	econtrarEmpresaPorNombre(nombre) {
		for(const empresa of this.empresas) {
			if(empresa.nombre === nombre) {
				return empresa;
			}
		}
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