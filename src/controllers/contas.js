let bancoDeDados = require('../bancodedados')

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

const criar = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos devem ser informados." })
    }

    const cpfEhUnico = !bancoDeDados.contas.find((conta) => conta.usuario.cpf === Number(cpf))
    const emailEhUnico = !bancoDeDados.contas.find((conta) => conta.usuario.email === email)

    if (!cpfEhUnico || !emailEhUnico) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" })
    }

    const novaConta = {
        numero: bancoDeDados.contasId++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    bancoDeDados.contas.push(novaConta)

    res.status(204).send()
}

const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos devem ser informados." })
    }

    let usuario = bancoDeDados.contas.find((conta) => conta.numero === Number(numeroConta)).usuario

    if (!usuario) {
        return res.status(400).json({ mensagem: "A conta não existe." })
    }

    const novoCpfEhUnico = !bancoDeDados.contas.find((conta) => conta.numero !== Number(numeroConta) && conta.usuario.cpf === Number(cpf))
    const novoEmailEhUnico = !bancoDeDados.contas.find((conta) => conta.numero !== Number(numeroConta) && conta.usuario.email === email)

    if (!novoCpfEhUnico) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf informado!" })
    }

    if (!novoEmailEhUnico) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o e-mail informado!" })
    }

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

    let conta = bancoDeDados.contas.find((conta) => conta.numero === Number(numeroConta))

    if (!conta) {
        return res.status(400).json({ mensagem: "A conta não existe." })
    }

    if (conta.saldo !== 0) {
        return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
    }

    const indexConta = bancoDeDados.contas.indexOf(conta)
    bancoDeDados.contas.splice(indexConta, 1)

    res.status(204).send()
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query

    if (numero_conta === undefined || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e senha são obrigatórios!" })
    }

    let conta = bancoDeDados.contas.find((conta) => conta.numero === Number(numero_conta))

    if (!conta) {
        return res.status(400).json({ mensagem: "A conta informada não existe!" })
    }

    const senhaEhValida = conta.usuario.senha === senha

    if (!senhaEhValida) {
        return res.status(400).json({ mensagem: "Senha inválida!" })
    }

    res.status(200).json({ saldo: conta.saldo })
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query

    if (numero_conta === undefined || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e senha são obrigatórios!" })
    }

    let conta = bancoDeDados.contas.find((conta) => conta.numero === Number(numero_conta))

    if (!conta) {
        return res.status(400).json({ mensagem: "A conta informada não existe!" })
    }

    const senhaEhValida = conta.usuario.senha === senha

    if (!senhaEhValida) {
        return res.status(400).json({ mensagem: "Senha inválida!" })
    }

    const depositos = bancoDeDados.depositos.filter((deposito) => deposito.numero_conta === Number(numero_conta))
    const saques = bancoDeDados.saques.filter((saque) => saque.numero_conta === Number(numero_conta))
    const transferenciasEnviadas = bancoDeDados.transferencias.filter((transferencia) => transferencia.numero_conta_origem === Number(numero_conta))
    const transferenciasRecebidas = bancoDeDados.transferencias.filter((transferencia) => transferencia.numero_conta_destino === Number(numero_conta))

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