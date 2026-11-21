"use client";
import { useState } from "react";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AppButton from "./AppButton";
import type { Car, CarInput } from "@/lib/types";

const EMPTY: CarInput = {
  plate: "",
  province: "",
  brand: "",
  model: "",
  year: "",
  color: "",
  note: "",
};

type RequiredField = "plate" | "brand" | "model";

interface Props {
  open: boolean;
  car: Car | null;
  onClose: () => void;
  onSubmit: (data: CarInput) => Promise<void>;
}

export default function CarFormDialog({ open, car, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CarInput>(
    car
      ? {
          plate: car.plate,
          province: car.province,
          brand: car.brand,
          model: car.model,
          year: car.year,
          color: car.color,
          note: car.note,
        }
      : EMPTY,
  );
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>(
    {},
  );
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const set =
    (key: keyof CarInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Partial<Record<RequiredField, string>> = {};
    if (!form.plate.trim()) next.plate = "License plate is required";
    if (!form.brand.trim()) next.brand = "Brand is required";
    if (!form.model.trim()) next.model = "Model is required";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    setServerError("");
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Couldn't save. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack
          direction="row"
          sx={{
            px: 3,
            pt: 3,
            pb: 1,
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontSize: 22 }}>
              {car ? "Edit car" : "Add new car"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {car
                ? "Update the details below."
                : "Fill in the details of the car."}
            </Typography>
          </Box>
          <IconButton
            aria-label="Close"
            onClick={onClose}
            disabled={saving}
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <DialogContent>
          {serverError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
              {serverError}
            </Alert>
          )}
          <Box
            sx={{
              display: "grid",
              gap: 2,
              pt: 1,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            }}
          >
            <TextField
              label="License plate"
              placeholder="1กก 1234"
              autoFocus
              value={form.plate}
              onChange={set("plate")}
              error={!!errors.plate}
              helperText={errors.plate}
            />
            <TextField
              label="Province"
              placeholder="Bangkok"
              value={form.province}
              onChange={set("province")}
            />
            <TextField
              label="Brand"
              placeholder="Toyota"
              value={form.brand}
              onChange={set("brand")}
              error={!!errors.brand}
              helperText={errors.brand}
            />
            <TextField
              label="Model"
              placeholder="Hilux Revo"
              value={form.model}
              onChange={set("model")}
              error={!!errors.model}
              helperText={errors.model}
            />
            <TextField
              label="Year"
              placeholder="2022"
              value={form.year}
              onChange={set("year")}
            />
            <TextField
              label="Color"
              placeholder="White"
              value={form.color}
              onChange={set("color")}
            />
            <TextField
              label="Note"
              placeholder="e.g. Delivery truck, tax due in March"
              value={form.note}
              onChange={set("note")}
              multiline
              minRows={2}
              sx={{ gridColumn: { sm: "1 / -1" } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <AppButton variant="ghost" onClick={onClose} disabled={saving}>
            {`Cancel`}
          </AppButton>
          <AppButton type="submit" loading={saving} loadingText={`Saving…`}>
            {`Save`}
          </AppButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
