const { obterContaPeloNumero, validaSenhaBanco, validaSenhaUsuario, obterContaPeloCpf, obterContaDiferentePeloCpf, obterContaPeloEmail, obterContaDiferentePeloEmail } = require("./servico")

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

        schema.obrigatorio?.body && schema.obrigatorio.body.forEach((campo) => {
            if (req.body[campo] === undefined) {
                obrigatorios.push(campo)
            }
        })

        schema.obrigatorio?.query && schema.obrigatorio.query.forEach((campo) => {
            if (req.query[campo] === undefined) {
                obrigatorios.push(campo)
            }
        })

        if (schema.valorMaiorQueZero?.body && (Number(req.body[schema.valorMaiorQueZero.body]) <= 0)) maiorQueZero = schema.valorMaiorQueZero

        schema.contaExiste?.body && schema.contaExiste.body.forEach((campo) => {
            !obterContaPeloNumero(Number(req.body[campo])) && contaExistencias.push(Number(req.body[campo]))
        })

        schema.contaExiste?.query && schema.contaExiste.query.forEach((campo) => {
            !obterContaPeloNumero(Number(req.query[campo])) && contaExistencias.push(Number(req.query[campo]))
        })

        schema.contaExiste?.params && schema.contaExiste.params.forEach((campo) => {
            !obterContaPeloNumero(Number(req.params[campo])) && contaExistencias.push(Number(req.params[campo]))
        })

        if (schema.senhaBanco) {
            const source = Object.keys(schema.senhaBanco)[0]
            senhaBancoValida = validaSenhaBanco(req[source][schema.senhaBanco[source]])
        }

        if (schema.senhaUsuario) {
            const numeroContaSource = schema.senhaUsuario.numeroConta.source
            const numeroContaKey = schema.senhaUsuario.numeroConta.key
            const senhaSource = schema.senhaUsuario.senha.source
            const senhaKey = schema.senhaUsuario.senha.key
            const numeroConta = req[numeroContaSource][numeroContaKey]
            const senha = req[senhaSource][senhaKey]

            senhaUsuarioValida = validaSenhaUsuario(numeroConta, senha)
        }

        if (schema.cpfUnico) {
            const source = Object.keys(schema.cpfUnico)[0]
            const cpf = req[source][schema.cpfUnico[source]]
            cpfUnico = !obterContaPeloCpf(cpf)
        }

        if (schema.cpfDiferenteUnico) {
            const cpfSource = schema.cpfDiferenteUnico.cpf.source
            const cpfKey = schema.cpfDiferenteUnico.cpf.key
            const numeroContaSource = schema.cpfDiferenteUnico.numeroConta.source
            const numeroContaKey = schema.cpfDiferenteUnico.numeroConta.key
            const numeroConta = Number(req[numeroContaSource][numeroContaKey])
            const cpf = req[cpfSource][cpfKey]

            cpfDiferenteUnico = !obterContaDiferentePeloCpf(numeroConta, cpf)
        }

        if (schema.emailUnico) {
            const source = Object.keys(schema.emailUnico)[0]
            const email = req[source][schema.emailUnico[source]]

            emailUnico = !obterContaPeloEmail(email)
        }

        if (schema.emailDiferenteUnico) {
            const emailSource = schema.emailDiferenteUnico.email.source
            const emailKey = schema.emailDiferenteUnico.email.key
            const numeroContaSource = schema.emailDiferenteUnico.numeroConta.source
            const numeroContaKey = schema.emailDiferenteUnico.numeroConta.key

            emailDiferenteUnico = !obterContaDiferentePeloEmail(Number(req[numeroContaSource][numeroContaKey]), req[emailSource][emailKey])
        }

        if (schema.saldoSuficiente) {
            const numeroContaSource = schema.saldoSuficiente.numeroConta.source
            const numeroContaKey = schema.saldoSuficiente.numeroConta.key
            const numeroConta = Number(req[numeroContaSource][numeroContaKey])

            const valorSource = schema.saldoSuficiente.valor.source
            const valorKey = schema.saldoSuficiente.valor.key
            const valor = Number(req[valorSource][valorKey])

            const conta = obterContaPeloNumero(numeroConta)

            saldoEhSuficiente = conta?.saldo >= valor
        }

        if (schema.saldoZero) {
            const source = Object.keys(schema.saldoZero)[0]
            const key = schema.saldoZero[source]
            const numeroConta = Number(req[source][key])

            let conta = obterContaPeloNumero(numeroConta)

            saldoZero = conta?.saldo === 0

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
        }
        else {
            return next()
        }
    }

    return valida
}

module.exports = { validaCampos }