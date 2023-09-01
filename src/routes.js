const { Router } = require('express')
const contasController = require('./controllers/contas')
const transacoesController = require('./controllers/transacoes')

const router = Router()

router.get("/", (req, res) => {
    res.json({ mensagem: "Rota principal" })
})

router.get("/contas", contasController.listar)
router.post("/contas", contasController.criar)
router.put("/contas/:numeroConta/usuario", contasController.atualizarUsuario)
router.delete("/contas/:numeroConta", contasController.remover)

router.post("/transacoes/depositar", transacoesController.depositar)
router.post("/transacoes/sacar", transacoesController.sacar)
router.post("/transacoes/transferir", transacoesController.transferir)

router.get("/contas/saldo", contasController.saldo)
router.get("/contas/extrato", contasController.extrato)

module.exports = router