import { HashManager } from "../services/hashManager";
import { IdGenerator } from "../services/idGenerator";
import { TokenManager } from "../services/tokenManager";
import { UserDatabase } from "../database/UserDatabase";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { PostDatabase } from "../database/PostDatabase";
import { LikeDislikeDB, POST_LIKE, PostModel, Posts } from "../models/Posts";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { LikeOrDislikePostInputDTO, LikeOrDislikePostOutputDTO } from "../dtos/post/likeOrDislikePost.dto";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";


export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private tokenmanager: TokenManager,
    ) { }

    public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {
        const { token } = input
        const tokenPayload = this.tokenmanager.getPayload(token)
        if (!tokenPayload) {
            throw new UnauthorizedError("você precisa estar autenticado")
        }
        const postsDB = await this.postDatabase.getPosts()
        const postsModel: Array<Promise<PostModel>> = postsDB.map(async (post) => {
            const creator = await this.userDatabase.findUserById(post.creator_id)
            const postModel = new Posts(post.id, post.creator_id, post.content, post.comments, post.likes,
                post.dislikes, post.created_at, post.updated_at, creator.nickname)
            return postModel.toBusinessModel()
        })
        const output: PostModel[] = await Promise.all(postsModel)
       
        return output
    }
    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
        const { token, content } = input
        const tokenPayload = this.tokenmanager.getPayload(token)
        if (!tokenPayload) {
            throw new UnauthorizedError("você precisa estar autenticado")
        }
        const id = this.idGenerator.generate()
        const newPost = new Posts(id, tokenPayload.id, content, 0, 0, 0, new Date().toISOString(), new Date().toISOString(), tokenPayload.nickname)
        await this.postDatabase.createPost(newPost.toDBModel())
        const output: CreatePostOutputDTO = undefined
        return output
    }
    public likeOrDislikePost = async (input: LikeOrDislikePostInputDTO): Promise<LikeOrDislikePostOutputDTO> => {
        const { token, like, id } = input
        const tokenPayload = this.tokenmanager.getPayload(token)
        if (!tokenPayload) {
            throw new UnauthorizedError("você precisa estar autenticado")
        }
        const postdb = await this.postDatabase.getPostById(id)
        if(!postdb){
        throw new NotFoundError("Post não encontrado")
        }
        const creator = await this.userDatabase.findUserById(postdb.creator_id)
        const post = new Posts(postdb.id,postdb.creator_id,postdb.content,postdb.comments,postdb.likes,postdb.dislikes,postdb.created_at,postdb.updated_at,creator.nickname)
        const likedb = like? 1 : 0
        const likeOrDislikedb: LikeDislikeDB = {like: likedb, post_id: postdb.id, user_id: tokenPayload.id}
        const likeOrDislikeExist = await this.postDatabase.getLikeOrDislike(likeOrDislikedb)
        if(post.getCreatorId() === tokenPayload.id){
        throw new ForbiddenError("o usuario que fez o post não pode curtir o seu post")
        }
        if(likeOrDislikeExist === POST_LIKE.ALREADY_LIKED){
         if(like){
          await this.postDatabase.removeLikeOrDislike(likeOrDislikedb)
          post.removeLike()
         } else {
            await this.postDatabase.updateLikeOrDislike(likeOrDislikedb)
            post.removeLike()
            post.addDislike()
         }
        } else if(likeOrDislikeExist === POST_LIKE.ALREADY_DISLIKED) {
           if(!like){
            await this.postDatabase.removeLikeOrDislike(likeOrDislikedb)
            post.removeDislike()
           } else {
            await this.postDatabase.updateLikeOrDislike(likeOrDislikedb)
            post.removeDislike()
            post.addLike()
           }
        } else {
            await this.postDatabase.insertLikeOrDislike(likeOrDislikedb)
            like? post.addLike() : post.addDislike()
        }
        await this.postDatabase.updatePost(post.toDBModel())
        const output: LikeOrDislikePostOutputDTO =  undefined
        return output
    }

}