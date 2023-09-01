const bancoDeDados = require("../bancodedados")
const format = require("date-fns/format")

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body

    if (numero_conta === undefined || valor === undefined) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" })
    }

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "Não é permitido fazer depósitos com valores negativos ou zerados." })
    }

    const conta = bancoDeDados.contas.find((conta) => conta.numero === Number(numero_conta))

    if (!conta) {
        return res.status(400).json({ mensagem: "A conta informada não existe!" })
    }

    conta.saldo += Number(valor)

    const data = format(new Date(), "yyyy-MM-dd HH:mm:ss")

    bancoDeDados.depositos.push({
        data,
        numero_conta,
        valor
    })

    return res.status(204).send()
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body

    if (numero_conta === undefined || valor === undefined) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "Informe a senha da conta!" })
    }

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "Não é permitido fazer saques com valores negativos ou zerados." })
    }

    const conta = bancoDeDados.contas.find((conta) => conta.numero === Number(numero_conta))

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

    const data = format(new Date(), "yyyy-MM-dd HH:mm:ss")

    bancoDeDados.saques.push({
        data,
        numero_conta,
        valor
    })

    return res.status(204).send()
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    if (numero_conta_origem === undefined || numero_conta_destino === undefined || valor === undefined) {
        return res.status(400).json({ mensagem: "É obrigatório informar o número da conta de origem, número da conta de destino e o valor!" })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "Informe a senha da conta de origem!" })
    }

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "Não é permitido fazer transferência com valores negativos ou zerados." })
    }

    let contaOrigem = bancoDeDados.contas.find((conta) => conta.numero === Number(numero_conta_origem))
    let contaDestino = bancoDeDados.contas.find((conta) => conta.numero === Number(numero_conta_destino))

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

    console.log(contaOrigem)

    const saldoEhSuficiente = contaOrigem.saldo >= Number(valor)

    if (!saldoEhSuficiente) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" })
    }

    contaOrigem.saldo -= Number(valor)
    contaDestino.saldo += Number(valor)

    const data = format(new Date(), "yyyy-MM-dd HH:mm:ss")

    bancoDeDados.transferencias.push({
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor
    })

    return res.status(204).send()
}

module.exports = {
    depositar,
    sacar,
    transferir
}