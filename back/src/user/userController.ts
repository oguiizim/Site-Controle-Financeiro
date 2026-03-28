import bcrypt from "bcrypt";
import * as userService from "./userService";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export async function createUser(req: Request, res: Response) {
  try {
    const { name, password } = req.body;
    if (name == null) {
      return res.status(400).json({ message: "Dados invalidos!" });
    }
    if (password == null) {
      return res.status(400).json({ message: "Dados invalidos!" });
    }
    const user = await userService.createUser({ name, password });
    return res.status(201).json({
      message: "Usuario crido com sucesso",
      user: {
        id: Number(user.id),
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro interno do servidor!", error: err });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Dados invalidos!" });
    }
    await userService.deleteUserById(Number(id));

    return res.status(200).json({ message: "Usuario deletedo com sucesso!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro interno do servidor!", error: err });
  }
}

export async function login(req: Request, res: Response) {
  try {
    if (!jwtSecret) {
      throw new Error("JWT_SECRET não definido");
    }

    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "Dados inválidos!" });
    }

    const user = await userService.getUserByName(name);

    if (!user || !user.password) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: Number(user.id), role: user.role },
      jwtSecret,
      {
        expiresIn: "2h",
      },
    );

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor!", err });
  }
}

export async function edit(req: Request, res: Response) {
  try {
    const { lastPassword, password } = req.body;
    const userToken = (req as any).user;
    if (!userToken) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = await userService.getUserById(userToken.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    const valid = await bcrypt.compare(lastPassword, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    await userService.editUserById(userToken.id, password);
    return res.status(200).json({ message: "Senha atualizada com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor!", err });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const userToken = (req as any).user;

    if (!userToken) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const user = await userService.getUserById(userToken.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json({
      user: {
        id: Number(user.id),
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor!" });
  }
}
