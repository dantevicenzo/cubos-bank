let bancoDeDados = require('./bancodedados')
const { formataData } = require('./formatter')

const listarContas = () => {
    return bancoDeDados.contas
}

const listarDepositos = (numeroConta) => {
    return bancoDeDados.depositos.filter((deposito) => deposito.numero_conta === numeroConta)
}

const listarSaques = (numeroConta) => {
    return bancoDeDados.saques.filter((saque) => saque.numero_conta === numeroConta)
}

const listarTransferenciasEnviadas = (numeroContaOrigem) => {
    return bancoDeDados.transferencias.filter((transferencia) => transferencia.numero_conta_origem === numeroContaOrigem)
}

const listarTransferenciasRecebidas = (numeroContaDestino) => {
    return bancoDeDados.transferencias.filter((transferencia) => transferencia.numero_conta_destino === numeroContaDestino)
}

const obterSenhaBanco = () => {
    return bancoDeDados.banco.senha
}

const obterSenhaUsuarioPeloNumeroConta = (numeroConta) => {
    let conta = obterContaPeloNumero(Number(numeroConta))
    return conta?.usuario.senha
}

const obterContaPeloCpf = (cpf) => {
    return bancoDeDados.contas.find((conta) => conta.usuario.cpf === cpf)
}

const obterContaPeloEmail = (email) => {
    return bancoDeDados.contas.find((conta) => conta.usuario.email === email)
}

const obterContaDiferentePeloCpf = (numeroConta, cpf) => {
    return bancoDeDados.contas.find((conta) => conta.numero !== numeroConta && conta.usuario.cpf === cpf)
}

const obterContaDiferentePeloEmail = (numeroConta, email) => {
    return bancoDeDados.contas.find((conta) => conta.numero !== numeroConta && conta.usuario.email === email)
}

const obterContaPeloNumero = (numeroConta) => {
    return bancoDeDados.contas.find((conta) => conta.numero === numeroConta)
}

const obterSaldoPeloNumeroConta = (numeroConta) => {
    return bancoDeDados.contas.find((conta) => conta.numero === numeroConta).saldo
}

const obterExtratoPeloNumeroConta = (numeroConta) => {
    const depositos = listarDepositos(numeroConta)
    const saques = listarSaques(numeroConta)
    const transferenciasEnviadas = listarTransferenciasEnviadas(numeroConta)
    const transferenciasRecebidas = listarTransferenciasRecebidas(numeroConta)

    const extrato = { depositos, saques, transferenciasEnviadas, transferenciasRecebidas }

    return extrato
}

const adicionarConta = (nome, cpf, dataNascimento, telefone, email, senha) => {
    const conta = {
        numero: bancoDeDados.contasId++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            dataNascimento,
            telefone,
            email,
            senha
        }
    }

    bancoDeDados.contas.push(conta)
}

const atualizarDadosUsuario = (numeroConta, nome, cpf, data_nascimento, telefone, email, senha) => {
    let usuario = obterContaPeloNumero(numeroConta).usuario

    usuario.nome = nome
    usuario.cpf = cpf
    usuario.data_nascimento = data_nascimento
    usuario.telefone = telefone
    usuario.email = email
    usuario.senha = senha
}

const removerConta = (numeroConta) => {
    const conta = obterContaPeloNumero(numeroConta)
    const indexConta = bancoDeDados.contas.indexOf(conta)

    bancoDeDados.contas.splice(indexConta, 1)
}

const registrarDeposito = (numeroConta, valor) => {
    let conta = obterContaPeloNumero(Number(numeroConta))

    conta.saldo += Number(valor)

    bancoDeDados.depositos.push({ data: formataData(new Date()), numero_conta: numeroConta, valor })
}

const registrarSaque = (numeroConta, valor) => {
    let conta = obterContaPeloNumero(numeroConta)

    conta.saldo -= Number(valor)

    bancoDeDados.saques.push({ data: formataData(new Date()), numero_conta: numeroConta, valor })
}

const registrarTransferencia = (numeroContaOrigem, numeroContaDestino, valor) => {
    let contaOrigem = obterContaPeloNumero(numeroContaOrigem)
    let contaDestino = obterContaPeloNumero(numeroContaDestino)

    contaOrigem.saldo -= Number(valor)
    contaDestino.saldo += Number(valor)

    bancoDeDados.transferencias.push({ data: formataData(new Date()), numero_conta_origem: numeroContaOrigem, numero_conta_destino: numeroContaDestino, valor })
}

module.exports = {
    listarContas,
    listarDepositos,
    listarSaques,
    listarTransferenciasEnviadas,
    listarTransferenciasRecebidas,
    obterContaPeloCpf,
    obterContaPeloEmail,
    obterContaPeloNumero,
    obterContaDiferentePeloCpf,
    obterContaDiferentePeloEmail,
    obterSaldoPeloNumeroConta,
    obterExtratoPeloNumeroConta,
    obterSenhaBanco,
    obterSenhaUsuarioPeloNumeroConta,
    adicionarConta,
    atualizarDadosUsuario,
    removerConta,
    registrarDeposito,
    registrarSaque,
    registrarTransferencia
}