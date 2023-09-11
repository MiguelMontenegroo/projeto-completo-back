import { HashManager } from "../services/hashManager";
import { IdGenerator } from "../services/idGenerator";
import { TokenManager } from "../services/tokenManager";
import { UserDatabase } from "../database/UserDatabase";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { PostDatabase } from "../database/PostDatabase";
import { PostModel, Posts } from "../models/Posts";


export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private tokenmanager: TokenManager,
    ) { }

    public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO[]> => {
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
        console.log(output)
        return output
    }
}