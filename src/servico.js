let bancoDeDados = require('./bancodedados')
const { formataData } = require('./formatter')

const listarContas = () => {
    return bancoDeDados.contas
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

const validaSenhaBanco = (senha) => {
    return senha === bancoDeDados.banco.senha
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

const removerConta = (conta) => {
    const indexConta = bancoDeDados.contas.indexOf(conta)
    bancoDeDados.contas.splice(indexConta, 1)
}

const registrarDeposito = (numeroConta, valor) => {
    const data = formataData(new Date())
    bancoDeDados.depositos.push({ data, numeroConta, valor })
}

const registrarSaque = (numeroConta, valor) => {
    const data = formataData(new Date())
    bancoDeDados.saques.push({ data, numeroConta, valor })
}

const registrarTransferencia = (numeroContaOrigem, numeroContaDestino, valor) => {
    const data = formataData(new Date())
    bancoDeDados.transferencias.push({ data, numeroContaOrigem, numeroContaDestino, valor })
}

module.exports = {
    listarContas,
    obterContaPeloCpf,
    obterContaPeloEmail,
    obterContaPeloNumero,
    obterContaDiferentePeloCpf,
    obterContaDiferentePeloEmail,
    listarDepositos,
    listarSaques,
    listarTransferenciasEnviadas,
    listarTransferenciasRecebidas,
    validaSenhaBanco,
    adicionarConta,
    removerConta,
    registrarDeposito,
    registrarSaque,
    registrarTransferencia
}