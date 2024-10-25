const express = require("express")
require("dotenv").config()
const sequelize = require("./database")
const cors = require('cors')
const { DataTypes } = require("sequelize")


const http = require('http')
const HOST = process.env.HOST
const PORT = process.env.PORT
const app = express()
const server = http.createServer(app)


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    next();
});
app.use(cors())
app.use(express.json())

const User = sequelize.define('users', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    login: { type: DataTypes.STRING, unique: true },
    passwd: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "Student" },
})

const Car = sequelize.define('cars', {
    id_car: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name_car: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING }
})


app.post('/adduser', async (req, res) => {
    const { login, passwd } = req.body
    const user = await User.create({ login, passwd })
    res.json(user)
})//запрос на вывод всех данных из таблицы users, где id передается через query. в этом запросе присутствует SQL-уязвимость

app.get('/people', async (req, res) => {
    const id = req.query.id
    const user = await sequelize.query(`SELECT * FROM users WHERE id=${id}`);
    return res.json(user[0])
})

app.get('/peoplenormal', async (req, res) => {
    const id = req.query.id
    const user = await User.findOne({where: {id:id}});
    return res.json(user)
})//запрос на вывод всех данных из таблицы users, где id передается через query. в этом запросе ограничена возможность SQL-инъекций с помощью встроенной в sequelize функции .findOne()

app.post('/addcar', async (req, res) => {
    const { name_car, model } = req.body
    const car = await Car.create({ name_car, model })
    res.json(car)
})

app.get('/cars', async (req, res) => {
    const id_car = req.query.id_car
    const car = await sequelize.query(`SELECT * FROM cars WHERE id_car=${id_car}`);
    return res.json(car[0])
})//запрос на вывод всех данных из таблицы cars, где id_car передается через query. в этом запросе присутствует SQL-уязвимость

app.get('/carsnormal', async (req, res) => {
    const id_car = req.query.id_car
    const car = await Car.findOne({where: {id_car: id_car}})
    return res.json(car)
})//запрос на вывод всех данных из таблицы cars, где id_car передается через query. в этом запросе ограничена возможность SQL-инъекций с помощью встроенной в sequelize функции .findOne()


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(PORT, HOST, () => console.log(`Server start on ${HOST}:${PORT}`))
    }
    catch (e) {
        console.log(e)
    }
}

start()