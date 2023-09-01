const validaCamposObrigatorios = (campos) => {
    const valida = (req, res, next) => {
        let camposInvalidos = []

        campos.body && campos.body.forEach((campo) => {
            if (req.body[campo] === undefined) {
                camposInvalidos.push(campo)
            }
        })

        campos.query && campos.query.forEach((campo) => {
            if (req.query[campo] === undefined) {
                camposInvalidos.push(campo)
            }
        })

        if (camposInvalidos.length > 0) {
            return res.status(400).json({ mensagem: `É obrigatório preencher os campos: ${camposInvalidos.join(", ")}` })
        } else {
            return next()
        }
    }

    return valida
}

module.exports = { validaCamposObrigatorios }