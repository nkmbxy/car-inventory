import express, { ErrorRequestHandler, RequestHandler } from "express";
import cors from "cors";
import { ZodError } from "zod";
import cars from "./routes/cars";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/api/cars", cars);

const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Route not found" });
};
app.use(notFound);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ message: err.issues[0]?.message ?? "Invalid data" });
    return;
  }
  if ((err as { type?: string }).type === "entity.parse.failed") {
    res.status(400).json({ message: "Invalid JSON body" });
    return;
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
