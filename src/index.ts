import { Request, Response } from "express"
import ConnectDB, { sql } from "./database/connection"
import ratelimiter from "./middleware/rate_limiter"
const express = require("express")
const bodyParser = require("body-parser")
require("dotenv").config()
const TransactionRoutes = require("./routes/transactions")
//const cors = require("cors")


const app = express()

const PORT = process.env.PORT

app.use(ratelimiter)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/api/transactions", TransactionRoutes)

app.get("/", (req: Request, res: Response) => {
    res.send("Hey Simon")
})


ConnectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Port: ", PORT)
        console.log("server is running")
    })
}
)




