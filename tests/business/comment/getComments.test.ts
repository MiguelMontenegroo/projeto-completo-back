import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { getCommentSchema } from "../../../src/dtos/comment/getComments.dto";
import { TokenManagerMock } from "../../mocks/TokenGeneratorMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/commentDatabaseMock";
import { IdGeneratorMock } from "../../mocks/idGeneratorMock";
import { PostDatabaseMock } from "../../mocks/postDatabaseMock";

describe("testando getComments", () => {
  const commentBusiness = new CommentBusiness(
    new UserDatabaseMock(),
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  test("retorna todos os comments", async () => {
    const input = getCommentSchema.parse({
      postId: "post-id-mock2",
      token: "token-mock-user",
    });
    const output = await commentBusiness.getComments(input);
    expect(output).toEqual([
      {
        id: "id-mock-comment2",
        content: "que legal",
        likes: 1,
        dislikes: 0,
        createdAt: expect.any(String),
        postId: "post-id-mock2",
        creator: {
          id: "id-mock-user1",
          name: "mock-user1",
        },
      },
    ]);
  });
});
