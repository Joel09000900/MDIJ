import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { contactRouter } from "./routes/contact";
import { adhesionRouter } from "./routes/adhesion";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/contact", contactRouter);
app.use("/api/adhesions", adhesionRouter);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Une erreur interne est survenue. Veuillez réessayer plus tard." });
};
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur MDIJ démarré sur http://localhost:${PORT}`);
});
