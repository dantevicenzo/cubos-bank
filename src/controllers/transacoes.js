const { obterContaPeloNumero, registrarDeposito, registrarSaque, registrarTransferencia } = require("../servico")

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "Não é permitido fazer depósito com valores negativos ou zerados." })
    }

    let conta = obterContaPeloNumero(Number(numero_conta))

    if (!conta) {
        return res.status(400).json({ mensagem: "A conta informada não existe!" })
    }

    conta.saldo += Number(valor)

    registrarDeposito(numero_conta, valor)

    return res.status(204).send()
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "Não é permitido fazer saque com valores negativos ou zerados." })
    }

    let conta = obterContaPeloNumero(Number(numero_conta))

    if (!conta) {
        return res.status(400).json({ mensagem: "A conta informada não existe!" })
    }

    const senhaEhValida = conta.usuario.senha === senha

    if (!senhaEhValida) {
        return res.status(400).json({ mensagem: "Senha inválida!" })
    }

    const saldoEhSuficiente = conta.saldo >= Number(valor)

    if (!saldoEhSuficiente) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" })
    }

    conta.saldo -= Number(valor)

    registrarSaque(numero_conta, valor)

    return res.status(204).send()
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "Não é permitido fazer transferência com valores negativos ou zerados." })
    }

    let contaOrigem = obterContaPeloNumero(Number(numero_conta_origem))
    let contaDestino = obterContaPeloNumero(Number(numero_conta_destino))

    if (!contaOrigem) {
        return res.status(400).json({ mensagem: "A conta de origem informada não existe!" })
    }

    if (!contaDestino) {
        return res.status(400).json({ mensagem: "A conta de destino informada não existe!" })
    }

    const senhaEhValida = contaOrigem.usuario.senha === senha

    if (!senhaEhValida) {
        return res.status(400).json({ mensagem: "Senha inválida!" })
    }

    const saldoEhSuficiente = contaOrigem.saldo >= Number(valor)

    if (!saldoEhSuficiente) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" })
    }

    contaOrigem.saldo -= Number(valor)
    contaDestino.saldo += Number(valor)

    registrarTransferencia(numero_conta_origem, numero_conta_destino, valor)

    return res.status(204).send()
}

module.exports = {
    depositar,
    sacar,
    transferir
}