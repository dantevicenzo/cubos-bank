const bancoDeDados = require('../bancodedados')

const listar = (req, res) => {
    const { senha_banco } = req.query

    if (!senha_banco) {
        return res.status(400).json({ mensagem: "Informe a senha do banco." })
    }

    const senhaEhValida = senha_banco === bancoDeDados.banco.senha

    if (!senhaEhValida) {
        return res.status(400).json({ mensagem: "Senha incorreta." })
    }

    const contasBancarias = bancoDeDados.contas


    return res.status(200).json(contasBancarias)
}

module.exports = {
    listar
}