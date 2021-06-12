const mongoose = require('mongoose');
const validator = require('validator');

// Constructor para empresa
const EmpresaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    endereco: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: ''},
    cnpj: { type: String, required: false, default: ''},
    codigo: { type: String, required: false, default: ''},
    criadoEm: { type: Date, default: Date.now}
});

const EmpresaModel = mongoose.model('Empresa', EmpresaSchema);

function Empresa(body) {
    this.body = body;
    this.errors = [];
    this.empresa = null;
}

// Registro de empresa
Empresa.prototype.register = async function() {
    this.valida();
    if(this.errors.length > 0) return;
    this.empresa = await EmpresaModel.create(this.body);
}

// Validação do formulario
Empresa.prototype.valida = function() {
    this.cleanUp();

    if (this.body.codigo == '') this.errors.push('Código é um campo obrigatório')

    if (this.body.cnpj == '') {
        this.errors.push('CNPJ é um campo obrigatório')
    } else if (this.body.cnpj.length < 18 ||  this.body.cnpj.length > 18) this.errors.push('CNPJ deve conter 14 números')

    if (!this.body.nome) this.errors.push('Nome é um campo obrigatório')

    if (!this.body.email) {
        this.errors.push('Email é um campo obrigatório')
    } else if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email inválido')

    if (!this.body.telefone) {
        this.errors.push('Telefone é um campo obrigatório')
    } else if (this.body.telefone.length < 14 ||  this.body.telefone.length > 15) this.errors.push('Telefone inválido')
    
    if (!this.body.endereco) {
        this.errors.push('Endereço é um campo obrigatório')
    } else if (this.body.endereco.length < 7 ) this.errors.push('Endereço inválido')
}

Empresa.prototype.cleanUp = function() {
    for(const key in this.body) {
        if(typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
    nome: this.body.nome,
    cnpj: this.body.cnpj,
    codigo: this.body.codigo,
    endereco: this.body.endereco,
    email: this.body.email,
    telefone: this.body.telefone,
    };
};

// Edição da empresa
Empresa.prototype.edit = async function(id) {
    if(typeof id !== 'string') return;
    this.valida();
    if(this.errors.length > 0) return;
    this.empresa = await EmpresaModel.findByIdAndUpdate(id, this.body, {new: true });
};

// Métodos estáticos

// Buscar empresa pelo ID
Empresa.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    const empresa = await EmpresaModel.findById(id);
    return empresa;
};

// Empresas registradas
Empresa.buscaEmpresas = async function() {
    const empresas = await EmpresaModel.find()
        .sort({ criadoEm: -1 });
    return empresas;
};

// Excluir empresa
Empresa.delete = async function(id) {
    if(typeof id !== 'string') return;
    const empresa = await EmpresaModel.findOneAndDelete({_id: id});
    return empresa;
};

// Procura se existe uma empresa com o mesmo nome
Empresa.filtraEmpresasPorNome = async function(empresas, nome) {
    const empresacomnome = []
    function filtraEmpresa(empresas, empresacomnome) {
        empresas.forEach(empresa => {
            if (empresa.nome.toUpperCase() == nome.toUpperCase()) {
                empresacomnome.push(empresa)
            };
        });
    };
    filtraEmpresa(empresas, empresacomnome)
    return empresacomnome;
};

// Procura se existe uma empresa com o mesmo cnpj
Empresa.filtraEmpresasPorCnpj = async function(empresas, cnpj) {
    const empresacomcnpj = []
    function filtraEmpresa(empresas, empresacomcnpj) {
        empresas.forEach(empresa => {
            if (empresa.cnpj == cnpj) {
                empresacomcnpj.push(empresa)
            };
        });
    };
    filtraEmpresa(empresas, empresacomcnpj)
    return empresacomcnpj;
};

// Procura se existe uma empresa com o mesmo email
Empresa.filtraEmpresasPorEmail = async function(empresas, email) {
    const empresacomemail = []
    function filtraEmpresa(empresas, empresacomemail) {
        empresas.forEach(empresa => {
            if (empresa.email == email) {
                empresacomemail.push(empresa)
            };
        });
    };
    filtraEmpresa(empresas, empresacomemail)
    return empresacomemail;
};

// Procura se existe uma empresa com o mesmo codigo
Empresa.filtraEmpresasPorCodigo = async function(empresas, codigo) {
    const empresacomcodigo = []
    function filtraEmpresa(empresas, empresacomcodigo) {
        empresas.forEach(empresa => {
            if (empresa.codigo == codigo) {
                empresacomcodigo.push(empresa)
            };
        });
    };
    filtraEmpresa(empresas, empresacomcodigo)
    return empresacomcodigo;
};

module.exports = Empresa;