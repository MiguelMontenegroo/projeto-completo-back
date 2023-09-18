import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { createCommentSchema } from "../../../src/dtos/comment/createComment.dto";
import { likeDislikeCommentSchema } from "../../../src/dtos/comment/likeOrDislikeComment.dto";
import { TokenManagerMock } from "../../mocks/TokenGeneratorMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/commentDatabaseMock";
import { IdGeneratorMock } from "../../mocks/idGeneratorMock";
import { PostDatabaseMock } from "../../mocks/postDatabaseMock";

describe("testando likeOrDislikeComments", () => {
  const commentBusiness = new CommentBusiness(
    new UserDatabaseMock(),
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  test("like criado com sucesso", async () => {
    const input = likeDislikeCommentSchema.parse({
      postId: "post-id-mock2",
      commentId: "id-mock-comment2",
      like: true,
      token: "token-mock-user",
    });
    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toBeUndefined();
  });
});
