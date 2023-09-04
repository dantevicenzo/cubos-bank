const format = require("date-fns/format")
const ptBR = require('date-fns/locale/pt-BR')

const formataData = (data) => {
    return format(data, "yyyy-MM-dd HH:mm:ss")
}

const formataDataPtBr = (data) => {
    return format(data, "dd 'de' MMM 'de' yyyy 'às' HH:mm:ss", { locale: ptBR })
}

module.exports = {
    formataData,
    formataDataPtBr
}