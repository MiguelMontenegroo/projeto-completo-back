import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { createCommentSchema } from "../../../src/dtos/comment/createComment.dto";
import { TokenManagerMock } from "../../mocks/TokenGeneratorMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/commentDatabaseMock";
import { IdGeneratorMock } from "../../mocks/idGeneratorMock";
import { PostDatabaseMock } from "../../mocks/postDatabaseMock";

describe("testando createComments", () => {
  const commentBusiness = new CommentBusiness(
    new UserDatabaseMock(),
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  test("comment criado com sucesso", async () => {
    const input = createCommentSchema.parse({
      postId: "post-id-mock1",
      content: "qualquer coisa",
      token: "token-mock-user",
    });
    const output = await commentBusiness.createComment(input);
    expect(output).toBeUndefined();
  });
});
