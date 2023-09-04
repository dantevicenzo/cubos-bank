const { listarContas, obterContaPeloNumero, adicionarConta, removerConta, obterSaldoPeloNumeroConta, obterExtratoPeloNumeroConta, atualizarDadosUsuario } = require('../servico')

const listar = (req, res) => {
    const contasBancarias = listarContas()

    return res.status(200).json(contasBancarias)
}

const criar = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    adicionarConta(nome, cpf, data_nascimento, telefone, email, senha)

    res.status(204).send()
}

const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    atualizarDadosUsuario(Number(numeroConta), nome, cpf, data_nascimento, telefone, email, senha)

    res.status(204).send()
}

const remover = (req, res) => {
    const { numeroConta } = req.params

    removerConta(numeroConta)

    res.status(204).send()
}

const saldo = (req, res) => {
    const { numero_conta } = req.query

    let saldo = obterSaldoPeloNumeroConta(Number(numero_conta))

    res.status(200).json({ saldo })
}

const extrato = (req, res) => {
    const { numero_conta } = req.query

    const extrato = obterExtratoPeloNumeroConta(Number(numero_conta))

    res.json(extrato)
}

module.exports = {
    listar,
    criar,
    atualizarUsuario,
    remover,
    saldo,
    extrato
}