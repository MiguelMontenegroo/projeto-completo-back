import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import {
  CreateCommentInputDTO,
  CreateCommentOutputDTO,
} from "../dtos/comment/createComment.dto";
import {
  GetCommentsInputDTO,
  GetCommentsOutputDTO,
} from "../dtos/comment/getComments.dto";
import {
  LikeOrDislikeCommentInputDTO,
  likeDislikeCommentOutputDTO,
} from "../dtos/comment/likeOrDislikeComment.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import {
  COMMENT_LIKE,
  Comment,
  LikeDislikeCommentDB,
} from "../models/Comments";
import { Posts } from "../models/Posts";
import { IdGenerator } from "../services/idGenerator";
import { TokenManager } from "../services/tokenManager";

export class CommentBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private commentDatabase: CommentDatabase,
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenmanager: TokenManager
  ) {}

  public getComments = async (
    input: GetCommentsInputDTO
  ): Promise<GetCommentsOutputDTO> => {
    const { token, postId } = input;
    const tokenPayload = this.tokenmanager.getPayload(token);
    if (!tokenPayload) {
      throw new UnauthorizedError("você deve estar autenticado para acessar");
    }
    const post = await this.postDatabase.getPostById(postId);
    if (!post) {
      throw new NotFoundError("post não encontrado");
    }
    const commentsdb = await this.commentDatabase.getComments(postId);
    const commentsmodel = commentsdb.map(async (comment) => {
      const creator = await this.userDatabase.findUserById(comment.creator_id);
      return new Comment(
        comment.id,
        comment.post_id,
        comment.content,
        comment.likes,
        comment.dislikes,
        comment.created_at,
        comment.creator_id,
        creator.nickname
      ).toBusinessModel();
    });
    const output = await Promise.all(commentsmodel);
    return output;
  };

  public createComment = async (
    input: CreateCommentInputDTO
  ): Promise<CreateCommentOutputDTO> => {
    const { token, postId, content } = input;
    const tokenPayload = this.tokenmanager.getPayload(token);
    if (!tokenPayload) {
      throw new UnauthorizedError("você deve estar autenticado para acessar");
    }
    const post = await this.postDatabase.getPostById(postId);
    if (!post) {
      throw new NotFoundError("post não encontrado");
    }
    const id = this.idGenerator.generate();
    const newComment = new Comment(
      id,
      post.id,
      content,
      0,
      0,
      new Date().toISOString(),
      tokenPayload.id,
      tokenPayload.nickname
    ).toDBModel();
    await this.commentDatabase.createComment(newComment);
    const postCreator = await this.userDatabase.findUserById(post.creator_id);
    const updatePost = new Posts(
      post.id,
      post.creator_id,
      post.content,
      post.comments + 1,
      post.likes,
      post.dislikes,
      post.created_at,
      post.updated_at,
      postCreator.nickname
    );
    await this.postDatabase.updatePost(updatePost.toDBModel());
    const output: CreateCommentOutputDTO = undefined;
    return output;
  };

  public likeOrDislikeComment = async (
    input: LikeOrDislikeCommentInputDTO
  ): Promise<likeDislikeCommentOutputDTO> => {
    const { token, postId, commentId, like } = input;
    const tokenPayload = this.tokenmanager.getPayload(token);
    if (!tokenPayload) {
      throw new UnauthorizedError("você deve estar autenticado para acessar");
    }
    const post = await this.postDatabase.getPostById(postId);
    if (!post) {
      throw new NotFoundError("post não encontrado");
    }
    const comment = await this.commentDatabase.getCommentById(commentId);
    if (!comment) {
      throw new NotFoundError("comentario não existe");
    }
    if (tokenPayload.id === comment.creator_id) {
      throw new ForbiddenError("o criador do comentario não deve curti-lo");
    }
    const creator = await this.userDatabase.findUserById(comment.creator_id);
    const newComment = new Comment(
      comment.id,
      comment.post_id,
      comment.content,
      comment.likes,
      comment.dislikes,
      comment.created_at,
      comment.creator_id,
      creator.nickname
    );
    const likedb = like ? 1 : 0;
    const commentLike = await this.commentDatabase.getLikeOrDislikeComment(
      commentId,
      tokenPayload.id
    );
    const likeOrDislikedb: LikeDislikeCommentDB = {
      user_id: tokenPayload.id,
      comment_id: comment.id,
      like: likedb,
    };
    if (commentLike === COMMENT_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.commentDatabase.removeLikeOrDislike(likeOrDislikedb);
        newComment.removeLike();
      } else {
        await this.commentDatabase.updateLikeOrDislike(likeOrDislikedb);
        newComment.removeLike();
        newComment.addDislike();
      }
    } else if (commentLike === COMMENT_LIKE.ALREADY_DISLIKED) {
      if (!like) {
        await this.commentDatabase.removeLikeOrDislike(likeOrDislikedb);
        newComment.removeDislike();
      } else {
        await this.commentDatabase.updateLikeOrDislike(likeOrDislikedb);
        newComment.removeDislike();
        newComment.addLike();
      }
    } else {
      await this.commentDatabase.createLikeOrDislike(likeOrDislikedb);
      like ? newComment.addLike() : newComment.addDislike();
    }
    const newCommentdb = newComment.toDBModel();
    await this.commentDatabase.updateComment(newCommentdb);
    const output: likeDislikeCommentOutputDTO = undefined;
    return output;
  };
}
