node -e '
const fs = require("fs")
var text = fs.readFileSync("./debug.html")
text = String(text).replace(/(<(\w+)[^<>]*>)([\u4e00-\u9fa5]+)(<\/\2>)/g, "$1$3<!--{todo}-->$4")
fs.writeFileSync("./debug.html", text)

var text = fs.readFileSync("./index.html")
text = String(text).replace(/(<(\w+)[^<>]*>)([\u4e00-\u9fa5]+)(<\/\2>)/g, "$1$3<!--{todo}-->$4")
fs.writeFileSync("./index.html", text)
'