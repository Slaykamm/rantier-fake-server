// Middleware для проверки токена
import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!!token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken; // Добавляем данные пользователя в запрос
      next();
    } catch (error) {
      console.error("Ошибка проверки токена:", error);
      res.status(401).send("Неверный токен");
    }
  } else {
    res.status(401).send("Токен отсутствует");
  }
};
