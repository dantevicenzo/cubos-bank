const contasShema = {
    required: {
        listar: { query: ["senha_banco"] },
        criar: { body: ["nome", "cpf", "data_nascimento", "telefone", "email", "senha"] },
        atualizarUsuario: { body: ["nome", "cpf", "data_nascimento", "telefone", "email", "senha"] },
        saldo: { query: ["numero_conta", "senha"] },
        extrato: { query: ["numero_conta", "senha"] },
    }
}

const transacoesShema = {
    required: {
        depositar: { body: ["numero_conta", "valor"] },
        sacar: { body: ["numero_conta", "valor", "senha"] },
        transferir: { body: ["numero_conta_origem", "numero_conta_destino", "valor", "senha"] },
    }
}

module.exports = {
    contasShema,
    transacoesShema
}