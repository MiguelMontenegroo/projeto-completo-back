import { PostBusiness } from "../../../src/business/PostBusiness";
import { LikeOrDislikePostSchema } from "../../../src/dtos/post/likeOrDislikePost.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { TokenManagerMock } from "../../mocks/TokenGeneratorMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeneratorMock } from "../../mocks/idGeneratorMock";
import { PostDatabaseMock } from "../../mocks/postDatabaseMock";

describe("testando like or dislike do post", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new HashManagerMock(),
    new TokenManagerMock()
  );
  test("testando like or dislike", async () => {
    const input = LikeOrDislikePostSchema.parse({
      id: "post-id-mock1",
      token: "token-mock-user",
      like: false,
    });
    const output = await postBusiness.likeOrDislikePost(input);
    expect(output).toBeUndefined();
  });
});
