class Sistema {
	constructor(){
		this.empresas = [];
		this.presentaciones = [];
	}
	
	// empresas
	
	agregarEmpresa(empresa){
		this.empresas.push(empresa);
	}
	
	listarEmpresas() {
		return this.empresas;
	}
	
	econtrarEmpresaPorNombre(nombre) {
		for(const empresa of this.empresas) {
			if(empresa.nombre.toLowerCase() === nombre.toLowerCase()) {
				return empresa;
			}
		}
	}
	
	
	// presentaciones
	
	agregarPresentacion(presentacion){
		this.presentaciones.push(presentacion);
	}
	
	listarPresentaciones() {
		return this.presentaciones;
	}
	
	econtrarPresentacionPorTitulo(titulo) {
		for(const presentacion of this.presentaciones) {
			if(presentacion.titulo.toLowerCase() === titulo.toLowerCase()) {
				return presentacion;
			}
		}
	}
	
	listarPresentacionesPorDia(dia) {
		const presentaciones = [];
		for(const presentacion of this.presentaciones){
			if(presentacion.dia === dia) {
				presentaciones.push(presentacion);
			}
		}
		return presentaciones;
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
	constructor(empresa, titulo, descripcion, tema, dia, duracion) {
		this.empresa = empresa;
		this.titulo = titulo;
		this.descripcion = descripcion;
		this.tema =  tema;
		this.dia = dia;
		this.duracion = duracion;
	}
}