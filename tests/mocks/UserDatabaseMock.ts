import { BaseDatabase } from "../../src/database/BaseDatabase";
import { UserDB } from "../../src/models/User";

const mockUsers: UserDB[] = [
  {
    id: "id-mock-user1",
    email: "mock-user1@email.com",
    password: "mock-user123",
    nickname: "mock-user1",
    created_at: new Date().toISOString(),
  },
  {
    id: "id-mock-user2",
    email: "mock-user2@email.com",
    password: "mock-user12345",
    nickname: "mock-user2",
    created_at: new Date().toISOString(),
  },
];

export class UserDatabaseMock extends BaseDatabase {
  public static TABLE_USERS = "users";

  public async findUserByEmail(email: string): Promise<UserDB | undefined> {
    const [result] = mockUsers.filter((user) => user.email === email);
    return result;
  }

  public async insertUser(newUser: UserDB) {
    return;
  }

  public async findUserById(id: string): Promise<UserDB> {
    const [result] = mockUsers.filter((user) => user.id === id);
    return result;
  }
}
