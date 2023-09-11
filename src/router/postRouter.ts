import express from "express";
import { PostController } from "../controller/PostController";
import { PostBusiness } from "../business/PostBusiness";
import { IdGenerator } from "../services/idGenerator";
import { HashManager } from "../services/hashManager";
import { TokenManager } from "../services/tokenManager";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";


export const postRouter = express.Router();


const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new UserDatabase(),
        new IdGenerator(),
        new HashManager(),
        new TokenManager(),
    )
)

postRouter.get("/", postController.getPosts)