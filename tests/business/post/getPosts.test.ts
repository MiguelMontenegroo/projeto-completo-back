import { PostBusiness } from "../../../src/business/PostBusiness";
import { GetPostsSchema } from "../../../src/dtos/post/getPosts.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { TokenManagerMock } from "../../mocks/TokenGeneratorMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeneratorMock } from "../../mocks/idGeneratorMock";
import { PostDatabaseMock } from "../../mocks/postDatabaseMock";

describe("testando getPosts", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new HashManagerMock(),
    new TokenManagerMock()
  );
  test("retorna todos os posts", async () => {
    const input = GetPostsSchema.parse({
      token: "token-mock-user",
    });
    const output = await postBusiness.getPosts(input);
    expect(output).toContainEqual({
      id: "post-id-mock1",
      content: "qualquer coisa",
      comments: 0,
      likes: 0,
      dislikes: 0,
      created_at: expect.any(String),
      updated_at: expect.any(String),
      creator: {
        id: "id-mock-user1",
        name: "mock-user1",
      },
    });
  });
});
