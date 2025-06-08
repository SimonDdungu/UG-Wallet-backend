const express = require("express")
import { Request, Response } from "express";

import { controllers } from "../controllers";

const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
    await controllers.transaction.CreateTransaction(req, res)
})


router.get("/:userid", async (req: Request, res: Response) => {
    await controllers.transaction.FindTransaction(req, res)
})

router.delete("/:id", async (req: Request, res: Response) => {
   await controllers.transaction.DeleteTransaction(req, res)
})


router.get("/summary/:userid", async (req: Request, res: Response) => {
    await controllers.transaction.FindSummary(req, res)
})

module.exports = router