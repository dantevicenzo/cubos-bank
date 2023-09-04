const { listarContas, obterContaPeloNumero, listarDepositos, listarSaques, listarTransferenciasEnviadas, listarTransferenciasRecebidas, adicionarConta, removerConta } = require('../servico')

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

    let usuario = obterContaPeloNumero(Number(numeroConta)).usuario

    usuario.nome = nome
    usuario.cpf = cpf
    usuario.data_nascimento = data_nascimento
    usuario.telefone = telefone
    usuario.email = email
    usuario.senha = senha

    res.status(204).send()
}

const remover = (req, res) => {
    const { numeroConta } = req.params

    let conta = obterContaPeloNumero(Number(numeroConta))

    removerConta(conta)

    res.status(204).send()
}

const saldo = (req, res) => {
    const { numero_conta } = req.query

    let conta = obterContaPeloNumero(Number(numero_conta))

    res.status(200).json({ saldo: conta.saldo })
}

const extrato = (req, res) => {
    const { numero_conta } = req.query

    const depositos = listarDepositos(Number(numero_conta))
    const saques = listarSaques(Number(numero_conta))
    const transferenciasEnviadas = listarTransferenciasEnviadas(Number(numero_conta))
    const transferenciasRecebidas = listarTransferenciasRecebidas(Number(numero_conta))

    res.json({ depositos, saques, transferenciasEnviadas, transferenciasRecebidas })
}

module.exports = {
    listar,
    criar,
    atualizarUsuario,
    remover,
    saldo,
    extrato
}