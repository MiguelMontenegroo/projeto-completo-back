export class HashManagerMock {
  public hash = async (plaintext: string): Promise<string> => {
    return "hash-mock";
  };

  public compare = async (
    plaintext: string,
    hash: string
  ): Promise<boolean> => {
    switch (plaintext) {
      case "123456":
        return hash === "mock-user123";

      case "user123":
        return hash === "mock-user12345";

      default:
        return false;
    }
  };
}
