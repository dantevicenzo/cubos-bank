const { obterContaPeloNumero, obterSenhaUsuarioPeloNumeroConta, obterContaPeloCpf, obterContaDiferentePeloCpf, obterContaPeloEmail, obterContaDiferentePeloEmail, obterSenhaBanco } = require("./servico")

const validaCampos = (schema) => {
    const valida = (req, res, next) => {
        let obrigatorios = []
        let maiorQueZero = undefined
        let contaExistencias = []
        let senhaBancoValida = true
        let senhaUsuarioValida = true
        let cpfUnico = true
        let emailUnico = true
        let cpfDiferenteUnico = true
        let emailDiferenteUnico = true
        let saldoEhSuficiente = true
        let saldoZero = true

        if (schema.obrigatorio) {
            obrigatorios = validaCamposObrigatorios(req, schema.obrigatorio)
        }

        if (schema.valorMaiorQueZero) {
            maiorQueZero = validaValorMaiorQueZero(req, schema.valorMaiorQueZero)
        }

        if (schema.contaExiste) {
            contaExistencias = validaContaExistencias(req, schema.contaExiste)
        }

        if (schema.senhaBanco) {
            senhaBancoValida = validaSenhaBanco(req, schema.senhaBanco)
        }

        if (schema.senhaUsuario) {
            senhaUsuarioValida = validaSenhaUsuario(req, schema.senhaUsuario)
        }

        if (schema.cpfUnico) {
            cpfUnico = validaCpfUnico(req, schema.cpfUnico)
        }

        if (schema.cpfDiferenteUnico) {
            cpfDiferenteUnico = validaCpfDiferenteUnico(req, schema.cpfDiferenteUnico)
        }

        if (schema.emailUnico) {
            emailUnico = validaEmailUnico(req, schema.emailUnico)
        }

        if (schema.emailDiferenteUnico) {
            emailDiferenteUnico = validaEmailDiferenteUnico(req, schema.emailDiferenteUnico)
        }

        if (schema.saldoSuficiente) {
            saldoEhSuficiente = validaSaldoSuficiente(req, schema.saldoSuficiente)
        }

        if (schema.saldoZero) {
            saldoZero = validaSaldoZero(req, schema.saldoZero)
        }

        if (obrigatorios.length > 0) {
            return res.status(400).json({ mensagem: `É obrigatório preencher os campos: ${obrigatorios.join(", ")}` })
        } else if (maiorQueZero) {
            return res.status(400).json({ mensagem: `Não é permitido fazer ${maiorQueZero.operacao} com valores negativos ou zerados.` })
        } else if (contaExistencias.length > 0) {
            return res.status(400).json({ mensagem: `Não existe conta número ${contaExistencias.join(" e ")}!` })
        } else if (!senhaBancoValida) {
            return res.status(400).json({ mensagem: "Senha do banco incorreta." })
        } else if (!senhaUsuarioValida) {
            return res.status(400).json({ mensagem: "Senha da conta incorreta." })
        } else if (!cpfUnico || !cpfDiferenteUnico) {
            return res.status(400).json({ mensagem: "Já existe uma conta com o cpf informado!" })
        } else if (!emailUnico || !emailDiferenteUnico) {
            return res.status(400).json({ mensagem: "Já existe uma conta com o email informado!" })
        } else if (!saldoEhSuficiente) {
            return res.status(400).json({ mensagem: "Saldo insuficiente!" })
        } else if (!saldoZero) {
            return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
        } else {
            return next()
        }
    }

    return valida
}

const validaCamposObrigatorios = (req, schemaObrigatorio) => {
    let obrigatorios = []
    for (const source in schemaObrigatorio) {
        schemaObrigatorio[source].forEach((campo) => {
            if (req[source][campo] === undefined) {
                obrigatorios.push(campo)
            }
        })
    }
    return obrigatorios
}

const validaValorMaiorQueZero = (req, schemaValorMaiorQueZero) => {
    const valorSource = schemaValorMaiorQueZero.valor.source
    const valorKey = schemaValorMaiorQueZero.valor.key
    const valor = Number(req[valorSource][valorKey])

    if (valor <= 0) {
        return schemaValorMaiorQueZero
    } else {
        return undefined
    }
}

const validaContaExistencias = (req, schemaContaExiste) => {
    let contaExistencias = []
    for (const source in schemaContaExiste) {
        schemaContaExiste[source].forEach((campo) => {
            !obterContaPeloNumero(Number(req[source][campo])) && contaExistencias.push(Number(req[source][campo]))
        })
    }
    return contaExistencias
}

const validaSenhaBanco = (req, schemaSenhaBanco) => {
    const source = Object.keys(schemaSenhaBanco)[0]
    const senha = req[source][schemaSenhaBanco[source]]
    const senhaBancoValida = senha === obterSenhaBanco()
    return senhaBancoValida
}

const validaSenhaUsuario = (req, schemaSenhaUsuario) => {
    const numeroContaSource = schemaSenhaUsuario.numeroConta.source
    const numeroContaKey = schemaSenhaUsuario.numeroConta.key
    const senhaSource = schemaSenhaUsuario.senha.source
    const senhaKey = schemaSenhaUsuario.senha.key
    const numeroConta = req[numeroContaSource][numeroContaKey]
    const senha = req[senhaSource][senhaKey]
    const senhaUsuario = obterSenhaUsuarioPeloNumeroConta(numeroConta, senha)

    return senha === senhaUsuario
}

const validaCpfUnico = (req, schemaCpfUnico) => {
    const source = Object.keys(schemaCpfUnico)[0]
    const cpf = req[source][schemaCpfUnico[source]]
    const cpfUnico = !obterContaPeloCpf(cpf)
    return cpfUnico
}

const validaCpfDiferenteUnico = (req, schemaCpfDiferenteUnico) => {
    const cpfSource = schemaCpfDiferenteUnico.cpf.source
    const cpfKey = schemaCpfDiferenteUnico.cpf.key
    const numeroContaSource = schemaCpfDiferenteUnico.numeroConta.source
    const numeroContaKey = schemaCpfDiferenteUnico.numeroConta.key
    const numeroConta = Number(req[numeroContaSource][numeroContaKey])
    const cpf = req[cpfSource][cpfKey]

    const cpfDiferenteUnico = !obterContaDiferentePeloCpf(numeroConta, cpf)
    return cpfDiferenteUnico
}

const validaEmailUnico = (req, schemaEmailUnico) => {
    const source = Object.keys(schemaEmailUnico)[0]
    const email = req[source][schemaEmailUnico[source]]

    const emailUnico = !obterContaPeloEmail(email)
    return emailUnico
}

const validaEmailDiferenteUnico = (req, schemaEmailDiferenteUnico) => {
    const emailSource = schemaEmailDiferenteUnico.email.source
    const emailKey = schemaEmailDiferenteUnico.email.key
    const numeroContaSource = schemaEmailDiferenteUnico.numeroConta.source
    const numeroContaKey = schemaEmailDiferenteUnico.numeroConta.key
    const email = req[emailSource][emailKey]
    const numeroConta = Number(req[numeroContaSource][numeroContaKey])

    const emailDiferenteUnico = !obterContaDiferentePeloEmail(numeroConta, email)

    return emailDiferenteUnico
}

const validaSaldoSuficiente = (req, schemaSaldoSuficiente) => {
    const numeroContaSource = schemaSaldoSuficiente.numeroConta.source
    const numeroContaKey = schemaSaldoSuficiente.numeroConta.key
    const numeroConta = Number(req[numeroContaSource][numeroContaKey])

    const valorSource = schemaSaldoSuficiente.valor.source
    const valorKey = schemaSaldoSuficiente.valor.key
    const valor = Number(req[valorSource][valorKey])

    const conta = obterContaPeloNumero(numeroConta)

    const saldoEhSuficiente = conta?.saldo >= valor
    return saldoEhSuficiente
}

const validaSaldoZero = (req, schemaSaldoZero) => {
    const source = Object.keys(schemaSaldoZero)[0]
    const key = schemaSaldoZero[source]
    const numeroConta = Number(req[source][key])

    let conta = obterContaPeloNumero(numeroConta)

    const saldoZero = conta?.saldo === 0
    return saldoZero
}

module.exports = { validaCampos }