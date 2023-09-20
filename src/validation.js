const { obterContaPeloNumero, obterSenhaUsuarioPeloNumeroConta, obterContaPeloCpf, obterContaDiferentePeloCpf, obterContaPeloEmail, obterContaDiferentePeloEmail, obterSenhaBanco } = require("./servico")

const validaCampos = (schema) => {
    const valida = (req, res, next) => {
        let erros = {
            400: [],
            401: [],
            404: [],
            409: [],
        }

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

        for (const codigo in erros) {
            const errosPorCodigo = erros[codigo]
            if (errosPorCodigo.length > 0) {
                return res.status(Number(codigo)).json(errosPorCodigo)
            }
        }

        return next()
    }

    return valida
}

const validaCamposObrigatorios = (req, schemaObrigatorio, erros) => {
    for (const source in schemaObrigatorio) {
        schemaObrigatorio[source].forEach((campo) => {
            req[source][campo] === undefined && registrarErro(400, "Campo obrigatório", `É obrigatório preencher o campo: ${campo}`, erros)
        })
    }
}

const validaValorMaiorQueZero = (req, schemaValorMaiorQueZero, erros) => {
    const valorSource = schemaValorMaiorQueZero.valor.source
    const valorKey = schemaValorMaiorQueZero.valor.key
    const valor = Number(req[valorSource][valorKey])
    valor <= 0 && registrarErro(400, "Valor inválido", `Não é permitido fazer ${schemaValorMaiorQueZero.operacao} com valores negativos ou zerados`, erros)
}

const validaContaExistencias = (req, schemaContaExiste, erros) => {
    for (const source in schemaContaExiste) {
        schemaContaExiste[source].forEach((campo) => {
            const numeroConta = req[source][campo]
            numeroConta && !obterContaPeloNumero(Number(numeroConta)) && registrarErro(404, "Conta não encontrada", `Não existe conta número ${numeroConta}`, erros)
        })
    }
}

const validaSenhaBanco = (req, schemaSenhaBanco, erros) => {
    const source = Object.keys(schemaSenhaBanco)[0]
    const senha = req[source][schemaSenhaBanco[source]]
    const senhaBancoEhValida = senha === obterSenhaBanco()
    senha && !senhaBancoEhValida && registrarErro(401, "Senha incorreta", "A senha informada está incorreta.", erros)
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
    senha && !senhaUsuarioEhValida && registrarErro(401, "Senha incorreta", "A senha informada está incorreta.", erros)
}

const validaCpfUnico = (req, schemaCpfUnico, erros) => {
    const source = Object.keys(schemaCpfUnico)[0]
    const cpf = req[source][schemaCpfUnico[source]]
    const cpfEhUnico = !obterContaPeloCpf(cpf)
    !cpfEhUnico && registrarErro(409, "Cpf já existe", "Já existe uma conta cadastrada com o cpf informado!", erros)
}

const validaCpfDiferenteUnico = (req, schemaCpfDiferenteUnico, erros) => {
    const cpfSource = schemaCpfDiferenteUnico.cpf.source
    const cpfKey = schemaCpfDiferenteUnico.cpf.key
    const numeroContaSource = schemaCpfDiferenteUnico.numeroConta.source
    const numeroContaKey = schemaCpfDiferenteUnico.numeroConta.key
    const numeroConta = Number(req[numeroContaSource][numeroContaKey])
    const cpf = req[cpfSource][cpfKey]
    const numeroContaEhValido = obterContaPeloNumero(numeroConta)
    const cpfDiferenteEhUnico = !obterContaDiferentePeloCpf(numeroConta, cpf)
    numeroContaEhValido && !cpfDiferenteEhUnico && registrarErro(409, "Cpf já existe", "Já existe uma conta com o cpf informado!", erros)
}

const validaEmailUnico = (req, schemaEmailUnico, erros) => {
    const source = Object.keys(schemaEmailUnico)[0]
    const email = req[source][schemaEmailUnico[source]]
    const emailEhUnico = !obterContaPeloEmail(email)
    !emailEhUnico && registrarErro(409, "Email já existe", "Já existe uma conta com o email informado!", erros)
}

const validaEmailDiferenteUnico = (req, schemaEmailDiferenteUnico, erros) => {
    const emailSource = schemaEmailDiferenteUnico.email.source
    const emailKey = schemaEmailDiferenteUnico.email.key
    const numeroContaSource = schemaEmailDiferenteUnico.numeroConta.source
    const numeroContaKey = schemaEmailDiferenteUnico.numeroConta.key
    const email = req[emailSource][emailKey]
    const numeroConta = Number(req[numeroContaSource][numeroContaKey])
    const numeroContaEhValido = obterContaPeloNumero(numeroConta)
    const emailDiferenteEhUnico = !obterContaDiferentePeloEmail(numeroConta, email)
    numeroContaEhValido && !emailDiferenteEhUnico && registrarErro(409, "Email já existe", "Já existe uma conta com o email informado!", erros)
}

const validaSaldoSuficiente = (req, schemaSaldoSuficiente, erros) => {
    const numeroContaSource = schemaSaldoSuficiente.numeroConta.source
    const numeroContaKey = schemaSaldoSuficiente.numeroConta.key
    const numeroConta = Number(req[numeroContaSource][numeroContaKey])
    const valorSource = schemaSaldoSuficiente.valor.source
    const valorKey = schemaSaldoSuficiente.valor.key
    const valor = Number(req[valorSource][valorKey])
    const conta = obterContaPeloNumero(numeroConta)
    const autorizado = erros["401"].length === 0
    autorizado && conta && conta.saldo < valor && registrarErro(400, "Saldo insuficiente", "O valor solicitado é maior do que o saldo disponível na conta. Certifique-se de que o valor seja igual ou menor que o saldo da conta.", erros)
}

const validaSaldoZero = (req, schemaSaldoZero, erros) => {
    const source = Object.keys(schemaSaldoZero)[0]
    const key = schemaSaldoZero[source]
    const numeroConta = Number(req[source][key])
    let conta = obterContaPeloNumero(numeroConta)
    conta && conta.saldo !== 0 && registrarErro(409, "Saldo diferente de zero", "A conta só pode ser removida se o saldo for zero!", erros)
}

const registrarErro = (codigo, tipo, mensagem, listaErros) => {
    listaErros[codigo].push({ erro: tipo, mensagem })
}

module.exports = { validaCampos }