import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { adhesionSchema, fieldErrors } from "../lib/validation";

export const adhesionRouter = Router();

adhesionRouter.post("/", async (req, res) => {
  const parsed = adhesionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Données invalides", details: fieldErrors(parsed.error) });
    return;
  }

  const { consentement: _consentement, ...data } = parsed.data;

  try {
    await prisma.adhesion.create({ data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      res.status(409).json({
        error: "Cette adresse e-mail est déjà inscrite.",
        details: { email: "Cette adresse e-mail est déjà inscrite." },
      });
      return;
    }
    throw err;
  }

  res.status(201).json({ message: "Bienvenue au MDIJ ! Votre adhésion a bien été enregistrée." });
});
