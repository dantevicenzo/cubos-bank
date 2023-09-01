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

module.exports = {
    listar,
    criar
}