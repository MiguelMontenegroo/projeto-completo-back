import express from "express";
import { CommentController } from "../controller/CommentController";
import { CommentBusiness } from "../business/CommentBusiness";
import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { IdGenerator } from "../services/idGenerator";
import { TokenManager } from "../services/tokenManager";
import { UserDatabase } from "../database/UserDatabase";

export const commentRouter = express.Router();

const commentController = new CommentController(
  new CommentBusiness(
    new UserDatabase(),
    new CommentDatabase(),
    new PostDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
);

commentRouter.get("/:id", commentController.getComments);
commentRouter.post("/:id", commentController.createComment);
commentRouter.put(
  "/:id/:commentId/like",
  commentController.likeOrDislikeComment
);
