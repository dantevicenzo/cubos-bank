const contasShema = {
    listar: {
        obrigatorio: { query: ["senha_banco"] }
    },
    criar: {
        obrigatorio: { body: ["nome", "cpf", "data_nascimento", "telefone", "email", "senha"] }
    },
    atualizarUsuario: {
        obrigatorio: { body: ["nome", "cpf", "data_nascimento", "telefone", "email", "senha"] },
        contaExiste: { params: ["numeroConta"] }
    },
    saldo: {
        obrigatorio: { query: ["numero_conta", "senha"] },
        contaExiste: { query: ["numero_conta"] }
    },
    extrato: {
        obrigatorio: { query: ["numero_conta", "senha"] },
        contaExiste: { query: ["numero_conta"] }
    },
    remover: {
        contaExiste: { params: ["numeroConta"] }
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
        contaExiste: { body: ["numero_conta"] }
    },
    transferir: {
        obrigatorio: { body: ["numero_conta_origem", "numero_conta_destino", "valor", "senha"] },
        valorMaiorQueZero: { body: "valor", operacao: "transferência" },
        contaExiste: { body: ["numero_conta_origem", "numero_conta_destino"] }
    }
}

module.exports = {
    contasShema,
    transacoesShema
}