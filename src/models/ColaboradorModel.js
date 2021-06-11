const mongoose = require('mongoose');
const validator = require('validator');

const ColaboradorSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    endereco: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    cpf: { type: String, required: true },
    codigo: { type: String, required: true },
    empresa_id: { type: String, required: true },
    criadoEm: { type: Date, default: Date.now },
});

const ColaboradorModel = mongoose.model('Colaborador', ColaboradorSchema);

function Colaborador(body) {
    this.body = body;
    this.errors = [];
    this.colaborador = null;
}

Colaborador.prototype.register = async function() {
    this.valida();
    if(this.errors.length > 0) return;
    this.colaborador = await ColaboradorModel.create(this.body);
}

Colaborador.prototype.valida = function() {
    this.cleanUp();

    if (this.body.codigo == '') this.errors.push('Código é um campo obrigatório')

    if (this.body.cpf == '') {
        this.errors.push('CPF é um campo obrigatório')
    } else if (this.body.cpf.length < 14 ||  this.body.cpf.length > 14) this.errors.push('CPF deve conter 11 números')
    
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

Colaborador.prototype.cleanUp = function() {
    for(const key in this.body) {
        if(typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
    nome: this.body.nome,
    cpf: this.body.cpf,
    codigo: this.body.codigo,
    endereco: this.body.endereco,
    email: this.body.email,
    telefone: this.body.telefone,
    empresa_id: this.body.empresa_id,
    };
};

Colaborador.prototype.edit = async function(id) {
    if(typeof id !== 'string') return;
    this.valida();
    if(this.errors.length > 0) return;
    this.colaborador = await ColaboradorModel.findByIdAndUpdate(id, this.body, {new: true });
};

// Métodos estáticos
Colaborador.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    const colaborador = await ColaboradorModel.findById(id);
    return colaborador;
};

Colaborador.buscaColaboradores = async function() {
    const colaboradores = await ColaboradorModel.find()
        .sort({ criadoEm: -1 });
    return colaboradores;
};

Colaborador.delete = async function(id) {
    if(typeof id !== 'string') return;
    const colaborador = await ColaboradorModel.findOneAndDelete({_id: id});
    return colaborador;
};

Colaborador.buscaPorEmpresa = async function(id) {
    if(typeof id !== 'string') return;
    const colaborador = await ColaboradorModel.findOne({_id: id})
    const empresa_id = colaborador.empresa_id
    return empresa_id;
};

// Filtra os colaboradores de uma determinada empresa pela empresa
Colaborador.filtraColaboradores = async function(colaboradores, empresa) {
    const colaboradoresFiltrados = []
    function filtraEmpresa(colaboradores, colaboradoresFiltrados) {
        colaboradores.forEach(colaborador => {
            if (colaborador.empresa_id == empresa._id) {
                colaboradoresFiltrados.push(colaborador)
            };
        });
    };
    filtraEmpresa(colaboradores, colaboradoresFiltrados)
    return colaboradoresFiltrados;
};

// Filtra os colaboradores de uma determinada empresa pelo id da empresa
Colaborador.filtraColaboradoresPorID = async function(colaboradores, empresa_id) {
    const colaboradoresFiltrados = []
    function filtraEmpresa(colaboradores, colaboradoresFiltrados) {
        colaboradores.forEach(colaborador => {
            if (colaborador.empresa_id == empresa_id) {
                colaboradoresFiltrados.push(colaborador)
            };
        });
    };
    filtraEmpresa(colaboradores, colaboradoresFiltrados)
    return colaboradoresFiltrados;
};

// Apagar todos os colaboradores de uma determinada empresa
Colaborador.apagarFiltrados = async function(id) {
    const apagado = await ColaboradorModel.remove({empresa_id : id })
    return apagado
}



// Procura se existe uma colaborador com o mesmo cpf
Colaborador.filtraColaboradoresPorCpf = async function(colaboradores, cpf) {
    const colaboradorcomcpf = []
    function filtraColaborador(colaboradores, colaboradorcomcpf) {
        colaboradores.forEach(colaborador => {
            if (colaborador.cpf == cpf) {
                colaboradorcomcpf.push(colaborador)
            };
        });
    };
    filtraColaborador(colaboradores, colaboradorcomcpf)
    return colaboradorcomcpf;
};

// Procura se existe uma colaborador com o mesmo email
Colaborador.filtraColaboradoresPorEmail = async function(colaboradores, email) {
    const colaboradorcomemail = []
    function filtraColaborador(colaboradores, colaboradorcomemail) {
        colaboradores.forEach(colaborador => {
            if (colaborador.email == email) {
                colaboradorcomemail.push(colaborador)
            };
        });
    };
    filtraColaborador(colaboradores, colaboradorcomemail)
    return colaboradorcomemail;
};

// Procura se existe uma empresa com o mesmo codigo
Colaborador.filtraColaboradoresPorCodigo = async function(colaboradores, codigo) {
    const colaboradorcomcodigo = []
    function filtraColaborador(colaboradores, colaboradorcomcodigo) {
        colaboradores.forEach(colaborador => {
            if (colaborador.codigo == codigo) {
                colaboradorcomcodigo.push(colaborador)
            };
        });
    };
    filtraColaborador(colaboradores, colaboradorcomcodigo)
    return colaboradorcomcodigo;
};

module.exports = Colaborador;