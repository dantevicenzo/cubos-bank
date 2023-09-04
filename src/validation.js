const { obterContaPeloNumero, obterSenhaUsuarioPeloNumeroConta, obterContaPeloCpf, obterContaDiferentePeloCpf, obterContaPeloEmail, obterContaDiferentePeloEmail, obterSenhaBanco } = require("./servico")

const validaCampos = (schema) => {
    const valida = (req, res, next) => {
        let erros = []

        schema.obrigatorio && validaCamposObrigatorios(req, schema.obrigatorio, erros)
        schema.valorMaiorQueZero && validaValorMaiorQueZero(req, schema.valorMaiorQueZero, erros)
        schema.contaExiste && validaContaExistencias(req, schema.contaExiste, erros)
        schema.senhaBanco && validaSenhaBanco(req, schema.senhaBanco, erros)
        schema.senhaUsuario && validaSenhaUsuario(req, schema.senhaUsuario, erros)
        schema.cpfUnico && validaCpfUnico(req, schema.cpfUnico, erros)
        schema.cpfDiferenteUnico && validaCpfDiferenteUnico(req, schema.cpfDiferenteUnico, erros)
        schema.emailUnico && validaEmailUnico(req, schema.emailUnico, erros)
        schema.emailDiferenteUnico && validaEmailDiferenteUnico(req, schema.emailDiferenteUnico, erros)
        schema.saldoSuficiente && validaSaldoSuficiente(req, schema.saldoSuficiente, erros)
        schema.saldoZero && validaSaldoZero(req, schema.saldoZero, erros)

        if (erros.length > 0) {
            return res.status(400).json(erros)
        } else {
            return next()
        }
    }

    return valida
}

const validaCamposObrigatorios = (req, schemaObrigatorio, erros) => {
    for (const source in schemaObrigatorio) {
        schemaObrigatorio[source].forEach((campo) => {
            if (req[source][campo] === undefined) {
                erros.push({ erro: "Campo obrigatório", mensagem: `É obrigatório preencher o campo: ${campo}` })
            }
        })
    }
}

const validaValorMaiorQueZero = (req, schemaValorMaiorQueZero, erros) => {
    const valorSource = schemaValorMaiorQueZero.valor.source
    const valorKey = schemaValorMaiorQueZero.valor.key
    const valor = Number(req[valorSource][valorKey])

    if (valor <= 0) {
        erros.push({ erro: "Valor inválido", mensagem: `Não é permitido fazer ${schemaValorMaiorQueZero.operacao} com valores negativos ou zerados` })
    }
}

const validaContaExistencias = (req, schemaContaExiste, erros) => {
    for (const source in schemaContaExiste) {
        schemaContaExiste[source].forEach((campo) => {
            const numeroConta = Number(req[source][campo])
            !obterContaPeloNumero(numeroConta) && erros.push({ erro: "Conta inexistente", mensagem: `Não existe conta número ${numeroConta}` })
        })
    }
}

const validaSenhaBanco = (req, schemaSenhaBanco, erros) => {
    const source = Object.keys(schemaSenhaBanco)[0]
    const senha = req[source][schemaSenhaBanco[source]]
    const senhaBancoEhValida = senha === obterSenhaBanco()

    !senhaBancoEhValida && erros.push({ erro: "Senha incorreta", mensagem: "A senha informada está incorreta." })
}

const validaSenhaUsuario = (req, schemaSenhaUsuario, erros) => {
    const numeroContaSource = schemaSenhaUsuario.numeroConta.source
    const numeroContaKey = schemaSenhaUsuario.numeroConta.key
    const senhaSource = schemaSenhaUsuario.senha.source
    const senhaKey = schemaSenhaUsuario.senha.key
    const numeroConta = req[numeroContaSource][numeroContaKey]
    const senha = req[senhaSource][senhaKey]
    const senhaUsuario = obterSenhaUsuarioPeloNumeroConta(numeroConta, senha)

    const senhaUsuarioEhValida = senha === senhaUsuario

    !senhaUsuarioEhValida && erros.push({ erro: "Senha incorreta", mensagem: "A senha informada está incorreta." })
}

const validaCpfUnico = (req, schemaCpfUnico, erros) => {
    const source = Object.keys(schemaCpfUnico)[0]
    const cpf = req[source][schemaCpfUnico[source]]
    const cpfEhUnico = !obterContaPeloCpf(cpf)
    !cpfEhUnico && erros.push({ erro: "Cpf já existe", mensagem: "Já existe uma conta com o cpf informado!" })
}

const validaCpfDiferenteUnico = (req, schemaCpfDiferenteUnico, erros) => {
    const cpfSource = schemaCpfDiferenteUnico.cpf.source
    const cpfKey = schemaCpfDiferenteUnico.cpf.key
    const numeroContaSource = schemaCpfDiferenteUnico.numeroConta.source
    const numeroContaKey = schemaCpfDiferenteUnico.numeroConta.key
    const numeroConta = Number(req[numeroContaSource][numeroContaKey])
    const cpf = req[cpfSource][cpfKey]
    const cpfDiferenteEhUnico = !obterContaDiferentePeloCpf(numeroConta, cpf)
    !cpfDiferenteEhUnico && erros.push({ erro: "Cpf já existe", mensagem: "Já existe uma conta com o cpf informado!" })
}

const validaEmailUnico = (req, schemaEmailUnico, erros) => {
    const source = Object.keys(schemaEmailUnico)[0]
    const email = req[source][schemaEmailUnico[source]]

    const emailEhUnico = !obterContaPeloEmail(email)
    !emailEhUnico && erros.push({ erro: "Email já existe", mensagem: "Já existe uma conta com o email informado!" })
}

const validaEmailDiferenteUnico = (req, schemaEmailDiferenteUnico, erros) => {
    const emailSource = schemaEmailDiferenteUnico.email.source
    const emailKey = schemaEmailDiferenteUnico.email.key
    const numeroContaSource = schemaEmailDiferenteUnico.numeroConta.source
    const numeroContaKey = schemaEmailDiferenteUnico.numeroConta.key
    const email = req[emailSource][emailKey]
    const numeroConta = Number(req[numeroContaSource][numeroContaKey])

    const emailDiferenteEhUnico = !obterContaDiferentePeloEmail(numeroConta, email)

    !emailDiferenteEhUnico && erros.push({ erro: "Email já existe", mensagem: "Já existe uma conta com o email informado!" })
}

const validaSaldoSuficiente = (req, schemaSaldoSuficiente, erros) => {
    const numeroContaSource = schemaSaldoSuficiente.numeroConta.source
    const numeroContaKey = schemaSaldoSuficiente.numeroConta.key
    const numeroConta = Number(req[numeroContaSource][numeroContaKey])

    const valorSource = schemaSaldoSuficiente.valor.source
    const valorKey = schemaSaldoSuficiente.valor.key
    const valor = Number(req[valorSource][valorKey])

    const conta = obterContaPeloNumero(numeroConta)

    const saldoEhSuficiente = conta?.saldo >= valor
    !saldoEhSuficiente && erros.push({ erro: "Saldo insuficiente", mensagem: "Saldo insuficiente!" })
}

const validaSaldoZero = (req, schemaSaldoZero, erros) => {
    const source = Object.keys(schemaSaldoZero)[0]
    const key = schemaSaldoZero[source]
    const numeroConta = Number(req[source][key])

    let conta = obterContaPeloNumero(numeroConta)

    const saldoEhZero = conta?.saldo === 0
    !saldoEhZero && erros.push({ erro: "Saldo diferente de zero", mensagem: "A conta só pode ser removida se o saldo for zero!" })
}

module.exports = { validaCampos }