let express = require('express')
let session = require('express-session')
let path = require('path')
let app = express()
let port = process.env.PORT || 3000

app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'email' }))
app.set('view engine', 'ejs')



app.get('/', (req, res) => {
     res.render('index')
})

app.listen(port, () => {
    console.log("Node server is runing in $", port) 
})