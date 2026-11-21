import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import type { Car } from "../types";

const text = z.string().trim();

const carSchema = z.object({
  plate: text.min(1, "License plate is required"),
  province: text.default(""),
  brand: text.min(1, "Brand is required"),
  model: text.min(1, "Model is required"),
  year: text.default(""),
  color: text.default(""),
  note: text.default(""),
});

const COLUMNS = "id, plate, province, brand, model, year, color, note";
const DUPLICATE_MESSAGE = "This license plate and province already exist";

const isUniqueError = (e: unknown) =>
  typeof e === "object" &&
  e !== null &&
  (e as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE";

const router = Router();

router.get("/", (_req, res) => {
  const rows = db
    .prepare(`SELECT ${COLUMNS} FROM cars ORDER BY id DESC`)
    .all() as Car[];
  res.json(rows);
});

router.post("/", (req, res) => {
  const data = carSchema.parse(req.body);
  try {
    const result = db
      .prepare(
        `INSERT INTO cars (plate, province, brand, model, year, color, note)
         VALUES (@plate, @province, @brand, @model, @year, @color, @note)`,
      )
      .run(data);
    const row = db
      .prepare(`SELECT ${COLUMNS} FROM cars WHERE id = ?`)
      .get(result.lastInsertRowid) as Car;
    res.status(201).json(row);
  } catch (e) {
    if (isUniqueError(e)) {
      res.status(409).json({ message: DUPLICATE_MESSAGE });
      return;
    }
    throw e;
  }
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid car ID" });
    return;
  }
  const data = carSchema.parse(req.body);
  try {
    const result = db
      .prepare(
        `UPDATE cars SET plate=@plate, province=@province, brand=@brand,
           model=@model, year=@year, color=@color, note=@note
         WHERE id=@id`,
      )
      .run({ ...data, id });
    if (result.changes === 0) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    const row = db
      .prepare(`SELECT ${COLUMNS} FROM cars WHERE id = ?`)
      .get(id) as Car;
    res.json(row);
  } catch (e) {
    if (isUniqueError(e)) {
      res.status(409).json({ message: DUPLICATE_MESSAGE });
      return;
    }
    throw e;
  }
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid car ID" });
    return;
  }
  const result = db.prepare("DELETE FROM cars WHERE id = ?").run(id);
  if (result.changes === 0) {
    res.status(404).json({ message: "Car not found" });
    return;
  }
  res.status(204).end();
});

export default router;
