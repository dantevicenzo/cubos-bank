const { Router } = require('express')
const contasController = require('./controllers/contas')
const transacoesController = require('./controllers/transacoes')
const { validaCamposObrigatorios } = require('./validation')
const { contasShema, transacoesShema } = require('./shemas')

const router = Router()

router.get("/contas", validaCamposObrigatorios(contasShema.required.listar), contasController.listar)
router.post("/contas", validaCamposObrigatorios(contasShema.required.criar), contasController.criar)
router.put("/contas/:numeroConta/usuario", validaCamposObrigatorios(contasShema.required.atualizarUsuario), contasController.atualizarUsuario)
router.delete("/contas/:numeroConta", contasController.remover)

router.post("/transacoes/depositar", validaCamposObrigatorios(transacoesShema.required.depositar), transacoesController.depositar)
router.post("/transacoes/sacar", validaCamposObrigatorios(transacoesShema.required.sacar), transacoesController.sacar)
router.post("/transacoes/transferir", validaCamposObrigatorios(transacoesShema.required.transferir), transacoesController.transferir)

router.get("/contas/saldo", validaCamposObrigatorios(contasShema.required.saldo), contasController.saldo)
router.get("/contas/extrato", validaCamposObrigatorios(contasShema.required.extrato), contasController.extrato)

module.exports = router