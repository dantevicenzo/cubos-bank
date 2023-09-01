const { Router } = require('express')
const contasController = require('./controllers/contas')

const router = Router()

router.get("/", (req, res) => {
    res.json({ mensagem: "Rota principal" })
})

router.get("/contas", contasController.listar)
router.post("/contas", contasController.criar)
router.put("/contas/:numeroConta/usuario", contasController.atualizarUsuario)

module.exports = router