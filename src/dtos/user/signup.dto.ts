import z from "zod";

export interface SignupInputDTO {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupOutputDTO{
 message: string;
  token :string;

}

export const SignupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    nickname: z.string().min(2)
  })
  .transform((data) => data as SignupInputDTO);