const express = require('express')
const router = require('./routes')
const { formataDataPtBr } = require('./formatter')

const app = express()

app.use(express.json(), router)

app.listen(3000, () => {
    const dataFormatada = formataDataPtBr(new Date())
    console.log(`Servidor iniciado na porta 3000 | URL: http://localhost:3000 | ${dataFormatada}`)
})