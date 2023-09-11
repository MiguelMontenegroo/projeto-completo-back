import { PostDB } from "../models/Posts";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static POST_TABLE = "posts";
    public async getPosts(){
        const result: PostDB[] = await BaseDatabase.connection(PostDatabase.POST_TABLE)
        return result
    }
}