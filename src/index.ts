import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from 'dotenv'


const app = express();
app.use(express.json());

app.listen(Number(process.env.PORT || 3003), () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`)
})
app.get("/ping", (req: Request, res: Response) => {
    res.send("Funciona! ");
  });