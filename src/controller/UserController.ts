import { Request, Response } from "express";
import { ZodError } from "zod";
import { SignupSchema } from "../dtos/user/signup.dto";
import { BaseError } from "../errors/BaseError";
import { UserBusiness } from "../business/UserBusiness";
import { LoginSchema } from "../dtos/user/login.dto";
export class UserController {
  constructor(private userBusiness: UserBusiness) {}

  public signup = async (req: Request, res: Response) => {
    try {
      const input = SignupSchema.parse({
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.userBusiness.signup(input);
      return res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Unexpected error");
      }
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const input = LoginSchema.parse({
        email: req.body.email,
        password: req.body.password, })
        const output = await this.userBusiness.login(input)

        return res.status(200).send(output)

    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Unexpected error");
      }
    
    }
  }
}