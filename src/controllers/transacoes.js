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
    console.log(data)

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

    const saldoEhSuficiente = conta.saldo <= Number(valor)

    if (!saldoEhSuficiente) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" })
    }

    conta.saldo -= Number(saldo)

    bancoDeDados.saques.push({
        data,
        numero_conta,
        valor
    })

    return res.status(204).send()
}

const transferir = (req, res) => {
    res.json({ mensagem: "Rota de transferência" })
}

module.exports = {
    depositar,
    sacar,
    transferir
}