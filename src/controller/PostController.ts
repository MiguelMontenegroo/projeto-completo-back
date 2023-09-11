import { Request, Response } from "express";
import { GetPostsSchema } from "../dtos/post/getPosts.dto";
import { PostBusiness } from "../business/PostBusiness";
import { BaseError } from "../errors/BaseError";
import { ZodError } from "zod";

export class PostController {

 constructor(private postBusiness: PostBusiness){}

    public getPosts = async (req: Request, res:Response) => {
        try {
            const input = GetPostsSchema.parse({
                token: req.headers.authorization
            })
            const output = await this.postBusiness.getPosts(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error);

            if (error instanceof BaseError) {
              res.status(error.statusCode).send(error.message);
            } else if (error instanceof ZodError) {
              res.status(400).send(error.issues);
            } else {
              res.status(500).send("Unexpected error");
            }
        }
    }
}