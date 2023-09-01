const format = require("date-fns/format")

const formataData = (data) => {
    return format(new Date(), "yyyy-MM-dd HH:mm:ss")
}

module.exports = {
    formataData
}