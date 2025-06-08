import { sql } from "../database/connection";

class TransactionService {

    async createTransaction(data: any) {
        try {
            const { user_id, title, amount, category } = data;

            return await sql`INSERT INTO transactions(user_id, title, amount, category) VALUES(${user_id}, ${title}, ${amount}, ${category}) RETURNING*`

        } catch (error) {
            console.log("Error creating transaction: ", error)
            throw error
        }
    }

    async getTransaction(userid: string) {
        try {
            const transaction: any[] = await sql`SELECT * FROM transactions WHERE user_id = ${userid} ORDER BY created_at DESC`

            return transaction
        } catch (error) {
            console.log("ERROR FETCHING", error)
            throw error
        }
    }

    async deleteTransaction(id: number) {
        try {

            const deletedData = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING*`

            if (deletedData.length == 0) {
                throw new Error("NOT FOUND")
            }

            return deletedData
        } catch (error) {
            throw error
        }
    }

    async getSummary(userid: string) {
        try {

            const exists: any = await sql`SELECT 1 FROM transactions WHERE user_id = ${userid} LIMIT 1`

            if (exists.length == 0) {
                throw new Error("NOT FOUND")
            }

            const balance: any = await sql`SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userid}`

            const income: any = await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userid} AND amount > 0`

            const expenses: any = await sql`SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userid} AND amount < 0`


            return {
                balance: balance[0].balance,
                income: income[0].income,
                expenses: expenses[0].expenses
            }

        } catch (error) {
            throw error
        }
    }
}

export { TransactionService }