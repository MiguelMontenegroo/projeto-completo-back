import { UserBusiness } from "../../../src/business/UserBusiness";
import { SignupSchema } from "../../../src/dtos/user/signup.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";

import { TokenManagerMock } from "../../mocks/TokenGeneratorMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeneratorMock } from "../../mocks/idGeneratorMock";

describe("testando o signup", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new HashManagerMock(),
    new TokenManagerMock()
  );
  test("deve retornar um token", async () => {
    const input = SignupSchema.parse({
      email: "miguel@gmail.com",
      password: "123456",
      nickname: "miguel",
    });
    const output = await userBusiness.signup(input);
    expect(output).toEqual({
      message: expect.any(String),
      token: "token-mock",
    });
  });
});
