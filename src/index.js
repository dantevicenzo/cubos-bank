const express = require('express')
const format = require('date-fns/format')
const ptBR = require('date-fns/locale/pt-BR')
const router = require('./routes')

const app = express()

app.use(express.json())
app.use(router)

app.listen(3000, () => {
    const dataAtual = new Date()
    const dataFormatada = format(dataAtual, "dd 'de' MMM 'de' yyyy 'às' HH:mm:ss", { locale: ptBR })

    console.log(`Servidor iniciado na porta 3000 | URL: http://localhost:3000 | ${dataFormatada}`)
})