import ratelimit from "../config/upstash";
import { Response, Request, NextFunction } from "express";

const ratelimiter = async(req: Request, res: Response, next: NextFunction) => {
    try {
        //CHANGE THIS TO IP ADDRESS OR USERID LATER!!!!!!! "my-rate-limiter"
        const {success} = await ratelimit.limit("my-rate-limiter")

        if(!success){
            res.status(429).json({message: "Too many Requests, Please try again later"})
        }

        next()
    } catch (error) {
        console.log("RATE LIMITER ERROR: ", error)
        next(error)
    }
}

export default ratelimiter
