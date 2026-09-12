import { Router } from "express";
import { prisma } from "../lib/prisma";
import { contactSchema, fieldErrors } from "../lib/validation";

export const contactRouter = Router();

contactRouter.post("/", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Données invalides", details: fieldErrors(parsed.error) });
    return;
  }

  await prisma.contactMessage.create({ data: parsed.data });
  res.status(201).json({ message: "Votre message a bien été envoyé." });
});
