"use client";
import { useState } from "react";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AppButton from "./AppButton";
import type { Car } from "@/lib/types";

interface Props {
  car: Car | null;
  onClose: () => void;
  onConfirm: (car: Car) => Promise<void>;
}

export default function DeleteDialog({ car, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!car) return;
    setLoading(true);
    setError("");
    try {
      await onConfirm(car);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Couldn't delete. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={!!car}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth={false}
      sx={{
        "& .MuiDialog-container": { alignItems: "center" },
        "& .MuiDialog-paper": { margin: 2, maxWidth: 520 },
      }}
      slotProps={{ transition: { onExited: () => setError("") } }}
    >
      <DialogContent sx={{ textAlign: "center", pt: 4 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fee2e2",
            color: "error.main",
          }}
        >
          <DeleteOutlinedIcon sx={{ fontSize: 28 }} />
        </Box>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 3, textAlign: "left" }}
          >
            {error}
          </Alert>
        )}
        <Typography variant="h6" sx={{ fontSize: 20 }}>
          {`Delete this car?`}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {`${car?.plate} (${car?.brand} ${car?.model}) will be removed permanently.`}
          <br />
          {`This can't be undone.`}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center", gap: 1 }}>
        <AppButton
          variant="secondary"
          onClick={onClose}
          disabled={loading}
          sx={{ minWidth: 110 }}
        >
          {`Keep`}
        </AppButton>
        <AppButton
          variant="danger"
          onClick={handleConfirm}
          loading={loading}
          loadingText={`Deleting…`}
          sx={{ minWidth: 110 }}
        >
          {`Delete`}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
