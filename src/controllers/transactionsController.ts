import { Request, Response, NextFunction, response } from "express";
import { services } from "../service";



class TransactionController {

    async CreateTransaction(req: Request, res: Response) {
        try {
            const payload: any = req.body

            const transaction = await services.transaction.createTransaction(payload)

            res.status(201).json({ message: "Transaction was successfully created", transaction: transaction })
        } catch (error) {
            console.error("Failed to create Transaction", error)
            res.status(500).json("Internal Server Error")
        }
    }

    async FindTransaction(req: Request, res: Response) {
        try {
            const { userid } = req.params

            const transaction = await services.transaction.getTransaction(userid)

            if (transaction.length == 0) {
                res.status(404).json({ message: "Transactions not found" })
                return
            }

            res.status(200).json({ data: transaction })
        } catch (error) {
            console.error("Finding Failed, Internal Error: ", error)
            res.status(500).json("Internal Server Error")
        }
    }

    async DeleteTransaction(req: Request, res: Response) {
        try {
            const { id } = req.params

            const transactionId = parseInt(id, 10)

            if (isNaN(transactionId)) {
                res.status(400).json({ message: "Invalid Transaction" })
                return
            }

            const deletedTransaction = await services.transaction.deleteTransaction(transactionId)

            res.status(200).json({ message: "Transaction Deleted Successfully", transaction: deletedTransaction })
        } catch (error: any) {
            console.error("Deleting Failed, Internal Error: ", error)

            if (error.message === "NOT FOUND") {
                return res.status(404).json({ message: "Transaction Not Found" })
            }

            res.status(500).json("Internal Server Error")
        }
    }

    async FindSummary(req: Request, res: Response) {
        try {
            const { userid } = req.params

            const summary: any = await services.transaction.getSummary(userid)

            res.status(200).json({summary: summary})

        } catch (error: any) {
            console.error("Finding Summary Failed, Internal Error: ", error)

            if (error.message === "NOT FOUND") {
                return res.status(404).json({ message: "Summary Not Found" })
            }

            res.status(500).json("Internal Server Error")
        }
    }


}

export { TransactionController }