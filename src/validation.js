const { obterContaPeloNumero } = require("./servico")

const validaCampos = (schema) => {
    const valida = (req, res, next) => {
        let obrigatorios = []
        let maiorQueZero = undefined
        let contaExistencias = []

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

        if (obrigatorios.length > 0) {
            return res.status(400).json({ mensagem: `É obrigatório preencher os campos: ${obrigatorios.join(", ")}` })
        } else if (maiorQueZero) {
            return res.status(400).json({ mensagem: `Não é permitido fazer ${maiorQueZero.operacao} com valores negativos ou zerados.` })
        } else if (contaExistencias.length > 0) {
            return res.status(400).json({ mensagem: `Não existe conta número ${contaExistencias.join(" e ")}!` })
        }
        else {
            return next()
        }
    }

    return valida
}

module.exports = { validaCampos }