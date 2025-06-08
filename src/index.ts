import { NextFunction, Request, Response } from "express"
const express = require("express")

const bodyParser = require("body-parser")

//const cors = require("cors")

import ConnectDB, { sql } from "./database/connection"
import ratelimiter from "./middleware/rate_limiter"

interface Transactions {
    user_id: string,
    title: string,
    amount: number,
    category: string
}

const app = express()

app.use(ratelimiter)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req: Request, res: Response) => {
    res.send("Hey Simon")
})

app.post("/api/transactions", async (req: Request, res: Response) => {
    try {
        const { user_id, title, amount, category } = req.body;

        console.log(title)

        if (!title) {
            res.status(400).json({ message: "All fields are required" })
        }

        const transaction = await sql`INSERT INTO transactions(user_id, title, amount, category) VALUES(${user_id}, ${title}, ${amount}, ${category}) RETURNING*`

        console.log(transaction)

        res.status(201).json({message: "Transaction was successfully created."});
    } catch (err) {
        console.log("Error sending data: ", err)
    }

})


app.get("/api/transactions/:userid", async (req: Request, res: Response) => {
    try {
        const {userid} = req.params

        const data: any[] = await sql`SELECT * FROM transactions WHERE user_id = ${userid} ORDER BY created_at DESC`

        if(data.length == 0){
            res.status(404).json({message: "Transaction could not be found"})
        }

        res.json(data)
    } catch (error) {
        console.log("ERROR FETCHING", error)
        res.status(500).json({message: "An Error Occured"})
    }

})

app.delete("/api/transactions/:id", async (req: Request, res: Response) => {
    try{
        const {id} = req.params

        if(isNaN(parseInt(id))){
            res.status(400).json({message: "Invalid Transaction"})
        }

        const data = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING*`

        if(data.length == 0){
           return res.status(404).json({message: "Transaction Not Found."})
        }

        
        res.status(200).json({message: "Transaction Deleted Successfully"})
    }catch(error){
        console.log("ERROR DELETING", error)
        res.status(500).json({message: "An Error Occured"})
    }
})


app.get("/api/transactions/summary/:userid", async (req: Request, res: Response) => {
    try{
        const {userid} = req.params

        const data: any = await sql`SELECT title FROM transactions WHERE user_id = ${userid}`

        if(data.length == 0){
            return res.status(404).json({message: "Transaction Not Found"})
        }

        const balance: any = await sql`SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userid}` 

        const income: any = await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userid} AND amount > 0` 

        const expenses: any = await sql`SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userid} AND amount < 0` 



        res.status(200).json({
            balance: balance[0].balance,
            income: income[0].income,
            expenses: expenses[0].expenses
        })
        
    }catch(error){
        console.log("Error getting summary: ", error)
        res.status(500).json({message: "Internal Server Error"})
    }
})

ConnectDB().then(() => {
    app.listen(3005, () => {
        console.log("Port: ", 3005)
        console.log("server is running")
    })
}
)




