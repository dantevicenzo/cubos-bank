const { listarContas, obterContaPeloCpf, obterContaPeloEmail, obterContaPeloNumero, listarDepositos, listarSaques, listarTransferenciasEnviadas, listarTransferenciasRecebidas, validaSenhaBanco, adicionarConta, removerConta, obterContaDiferentePeloCpf, obterContaDiferentePeloEmail } = require('../servico')

const listar = (req, res) => {
    const { senha_banco } = req.query

    const senhaEhValida = validaSenhaBanco(senha_banco)

    if (!senhaEhValida) {
        return res.status(400).json({ mensagem: "Senha incorreta." })
    }

    const contasBancarias = listarContas()

    return res.status(200).json(contasBancarias)
}

const criar = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    const cpfEhUnico = !obterContaPeloCpf(Number(cpf))
    const emailEhUnico = !obterContaPeloEmail(email)

    if (!cpfEhUnico || !emailEhUnico) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" })
    }

    adicionarConta(nome, cpf, data_nascimento, telefone, email, senha)

    res.status(204).send()
}

const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    let usuario = obterContaPeloNumero(Number(numeroConta)).usuario

    if (!usuario) {
        return res.status(400).json({ mensagem: "A conta não existe." })
    }

    const novoCpfEhUnico = !obterContaDiferentePeloCpf(Number(cpf))
    const novoEmailEhUnico = !obterContaDiferentePeloEmail(email)

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

    let conta = obterContaPeloNumero(Number(numeroConta))

    if (!conta) {
        return res.status(400).json({ mensagem: "A conta não existe." })
    }

    if (conta.saldo !== 0) {
        return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
    }

    removerConta(conta)

    res.status(204).send()
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query

    let conta = obterContaPeloNumero(Number(numero_conta))

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

    let conta = obterContaPeloNumero(Number(numero_conta))

    if (!conta) {
        return res.status(400).json({ mensagem: "A conta informada não existe!" })
    }

    const senhaEhValida = conta.usuario.senha === senha

    if (!senhaEhValida) {
        return res.status(400).json({ mensagem: "Senha inválida!" })
    }

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