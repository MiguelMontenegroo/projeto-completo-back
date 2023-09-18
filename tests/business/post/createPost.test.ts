import { PostBusiness } from "../../../src/business/PostBusiness";
import { CreatePostSchema } from "../../../src/dtos/post/createPost.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { TokenManagerMock } from "../../mocks/TokenGeneratorMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeneratorMock } from "../../mocks/idGeneratorMock";
import { PostDatabaseMock } from "../../mocks/postDatabaseMock";

describe("testando criação de post", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new HashManagerMock(),
    new TokenManagerMock()
  );
  test("post criado com sucesso", async () => {
    const input = CreatePostSchema.parse({
      token: "token-mock-user",
      content: "qualquer coisa",
    });
    const output = await postBusiness.createPost(input);
    expect(output).toBeUndefined();
  });
});
