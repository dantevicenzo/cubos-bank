const { Router } = require('express')

const router = Router()

router.get("/", (req, res) => {
    res.json({ mensagem: "Rota principal" })
})

module.exports = router