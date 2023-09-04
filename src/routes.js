const { Router } = require('express')
const contasController = require('./controllers/contas')
const transacoesController = require('./controllers/transacoes')
const { validaCampos } = require('./validation')
const { contasShema, transacoesShema } = require('./shemas')

const router = Router()

router.get("/contas", validaCampos(contasShema.listar), contasController.listar)
router.post("/contas", validaCampos(contasShema.criar), contasController.criar)
router.put("/contas/:numeroConta/usuario", validaCampos(contasShema.atualizarUsuario), contasController.atualizarUsuario)
router.delete("/contas/:numeroConta", validaCampos(contasShema.remover), contasController.remover)
router.get("/contas/saldo", validaCampos(contasShema.saldo), contasController.saldo)
router.get("/contas/extrato", validaCampos(contasShema.extrato), contasController.extrato)

router.post("/transacoes/depositar", validaCampos(transacoesShema.depositar), transacoesController.depositar)
router.post("/transacoes/sacar", validaCampos(transacoesShema.sacar), transacoesController.sacar)
router.post("/transacoes/transferir", validaCampos(transacoesShema.transferir), transacoesController.transferir)

module.exports = router