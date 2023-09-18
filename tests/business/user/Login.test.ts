import { UserBusiness } from "../../../src/business/UserBusiness";
import { LoginSchema } from "../../../src/dtos/user/login.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { TokenManagerMock } from "../../mocks/TokenGeneratorMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeneratorMock } from "../../mocks/idGeneratorMock";

describe("testando o login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new HashManagerMock(),
    new TokenManagerMock()
  );
  test("deve retornar um token", async () => {
    const input = LoginSchema.parse({
      email: "mock-user1@email.com",
      password: "123456",
    });
    const output = await userBusiness.login(input);
    expect(output).toEqual({
      message: expect.any(String),
      token: "token-mock-user",
    });
  });
});
