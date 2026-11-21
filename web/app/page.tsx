"use client";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Alert,
  Box,
  Container,
  IconButton,
  InputAdornment,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import AppButton from "@/components/AppButton";
import CarCard from "@/components/CarCard";
import CarFormDialog from "@/components/CarFormDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { carApi } from "@/lib/api";
import type { Car, CarInput } from "@/lib/types";

function NavStat({
  icon,
  value,
  label,
  sx,
}: {
  icon: ReactNode;
  value: string | number;
  label: string;
  sx?: object;
}) {
  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{
        alignItems: "center",
        color: "text.secondary",
        "& svg": { fontSize: 17 },
        ...sx,
      }}
    >
      {icon}
      <Typography sx={{ fontSize: 14 }}>
        <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
          {value}
        </Box>
        {` ${label}`}
      </Typography>
    </Stack>
  );
}

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editing, setEditing] = useState<Car | null>(null);
  const [deleting, setDeleting] = useState<Car | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let cancelled = false;
    carApi
      .list()
      .then((data) => {
        if (!cancelled) setCars(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : "Couldn't load cars",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = () => {
    setLoading(true);
    setLoadError("");
    setReloadKey((k) => k + 1);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cars;
    return cars.filter((c) =>
      `${c.plate} ${c.brand} ${c.model}`.toLowerCase().includes(q),
    );
  }, [cars, query]);

  const brandCount = useMemo(
    () => new Set(cars.map((c) => c.brand.trim().toLowerCase())).size,
    [cars],
  );

  const openAdd = () => {
    setEditing(null);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  };

  const openEdit = (car: Car) => {
    setEditing(car);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  };

  const handleSubmit = async (data: CarInput) => {
    if (editing) {
      const updated = await carApi.update(editing.id, data);
      setCars((list) => list.map((c) => (c.id === updated.id ? updated : c)));
      setToast("Changes saved");
    } else {
      const created = await carApi.create(data);
      setCars((list) => [created, ...list]);
      setToast("Car added");
    }
  };

  const handleDelete = async (car: Car) => {
    await carApi.remove(car.id);
    setCars((list) => list.filter((c) => c.id !== car.id));
    setToast("Car deleted");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "rgba(250, 250, 250, 0.8)",
          backdropFilter: "saturate(180%) blur(12px)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            sx={{
              height: 64,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#18181b",
                  color: "#ffffff",
                }}
              >
                <DirectionsCarOutlinedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
                {`Car inventory`}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2.5} sx={{ alignItems: "center" }}>
              <NavStat
                icon={<DirectionsCarOutlinedIcon />}
                value={loading ? "–" : cars.length}
                label={cars.length === 1 ? "car" : "cars"}
              />
              <NavStat
                icon={<SellOutlinedIcon />}
                value={loading ? "–" : brandCount}
                label={brandCount === 1 ? "brand" : "brands"}
                sx={{ display: { xs: "none", sm: "flex" } }}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Box sx={{ pt: { xs: 5, sm: 8 }, pb: { xs: 4, sm: 5 } }}>
          <Typography variant="h3" sx={{ fontSize: { xs: 34, sm: 48 } }}>
            {`Company cars`}
          </Typography>

          <Stack
            direction="row"
            sx={{
              mt: 4,
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextField
              placeholder="Search by plate, brand, or model"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{
                flex: { xs: "1 1 100%", sm: "1 1 280px" },
                maxWidth: { xs: "none", sm: 440 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  bgcolor: "#ffffff",
                  boxShadow: "0 1px 2px rgba(24, 24, 27, 0.04)",
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: query ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
            />
            <AppButton
              startIcon={<AddIcon />}
              onClick={openAdd}
              sx={{
                width: { xs: "100%", sm: "auto" },
                ml: { xs: 0, sm: "auto" },
                py: { xs: 1.25, sm: 1 },
              }}
            >
              {`Add car`}
            </AppButton>
          </Stack>
        </Box>

        {loadError && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 3 }}
            action={
              <AppButton variant="ghost" size="small" onClick={retry}>
                {`Try again`}
              </AppButton>
            }
          >
            {loadError}
          </Alert>
        )}

        {loading && (
          <Box
            sx={{
              display: "grid",
              gap: 2.5,
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {[0, 1, 2].map((i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={230}
                sx={{ borderRadius: "24px" }}
              />
            ))}
          </Box>
        )}

        {!loading && !loadError && filtered.length === 0 && (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f4f4f5",
                color: "text.secondary",
              }}
            >
              <DirectionsCarOutlinedIcon sx={{ fontSize: 30 }} />
            </Box>
            <Typography variant="h6">
              {cars.length === 0 ? "No cars yet" : "No cars found"}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
              {cars.length === 0
                ? "Add your company's first car to get started."
                : "Try a different plate, brand, or model."}
            </Typography>
            {cars.length === 0 && (
              <AppButton startIcon={<AddIcon />} onClick={openAdd}>
                {`Add car`}
              </AppButton>
            )}
          </Box>
        )}

        {!loading && filtered.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gap: 2.5,
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {filtered.map((c, i) => (
              <CarCard
                key={c.id}
                car={c}
                index={i}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </Box>
        )}
      </Container>

      <CarFormDialog
        key={formKey}
        open={formOpen}
        car={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
      <DeleteDialog
        car={deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={2500}
        onClose={() => setToast("")}
        message={toast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Box>
  );
}
