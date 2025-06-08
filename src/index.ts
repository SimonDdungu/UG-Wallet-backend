import { Request, Response } from "express"

const express = require("express")
const bodyParser = require("body-parser")

const TransactionRoutes = require("./routes/transactions")

//const cors = require("cors")

import ConnectDB, { sql } from "./database/connection"
import ratelimiter from "./middleware/rate_limiter"


const app = express()

app.use(ratelimiter)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/api/transactions", TransactionRoutes)

app.get("/", (req: Request, res: Response) => {
    res.send("Hey Simon")
})


ConnectDB().then(() => {
    app.listen(3005, () => {
        console.log("Port: ", 3005)
        console.log("server is running")
    })
}
)




