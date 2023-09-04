const contasShema = {
    listar: {
        senhaBanco: { query: "senha_banco" },
        obrigatorio: { query: ["senha_banco"] }
    },
    criar: {
        obrigatorio: { body: ["nome", "cpf", "data_nascimento", "telefone", "email", "senha"] },
        cpfUnico: { body: "cpf" },
        emailUnico: { body: "email" }
    },
    atualizarUsuario: {
        obrigatorio: { body: ["nome", "cpf", "data_nascimento", "telefone", "email", "senha"] },
        contaExiste: { params: ["numeroConta"] },
        cpfDiferenteUnico: { cpf: { source: "body", key: "cpf" }, numeroConta: { source: "params", key: "numeroConta" } },
        emailDiferenteUnico: { email: { source: "body", key: "email" }, numeroConta: { source: "params", key: "numeroConta" } }
    },
    saldo: {
        senhaUsuario: { senha: { source: "query", key: "senha" }, numeroConta: { source: "query", key: "numero_conta" } },
        obrigatorio: { query: ["numero_conta", "senha"] },
        contaExiste: { query: ["numero_conta"] }
    },
    extrato: {
        senhaUsuario: { senha: { source: "query", key: "senha" }, numeroConta: { source: "query", key: "numero_conta" } },
        obrigatorio: { query: ["numero_conta", "senha"] },
        contaExiste: { query: ["numero_conta"] }
    },
    remover: {
        contaExiste: { params: ["numeroConta"] },
        saldoZero: { params: "numeroConta" }
    }
}

const transacoesShema = {
    depositar: {
        obrigatorio: { body: ["numero_conta", "valor"] },
        valorMaiorQueZero: { body: "valor", operacao: "depósito" },
        contaExiste: { body: ["numero_conta"] }
    },
    sacar: {
        obrigatorio: { body: ["numero_conta", "valor", "senha"] },
        valorMaiorQueZero: { body: "valor", operacao: "saque" },
        contaExiste: { body: ["numero_conta"] },
        senhaUsuario: { senha: { source: "body", key: "senha" }, numeroConta: { source: "body", key: "numero_conta" } },
        saldoSuficiente: { numeroConta: { source: "body", key: "numero_conta" }, valor: { source: "body", key: "valor" } }
    },
    transferir: {
        obrigatorio: { body: ["numero_conta_origem", "numero_conta_destino", "valor", "senha"] },
        valorMaiorQueZero: { body: "valor", operacao: "transferência" },
        contaExiste: { body: ["numero_conta_origem", "numero_conta_destino"] },
        senhaUsuario: { senha: { source: "body", key: "senha" }, numeroConta: { source: "body", key: "numero_conta_origem" } },
        saldoSuficiente: { numeroConta: { source: "body", key: "numero_conta_origem" }, valor: { source: "body", key: "valor" } }
    }
}

module.exports = {
    contasShema,
    transacoesShema
}