import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PlateBadge from "./PlateBadge";
import { colorToHex } from "@/lib/carColor";
import type { Car } from "@/lib/types";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pill = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  px: 1.25,
  py: 0.5,
  borderRadius: 999,
  bgcolor: "#f4f4f5",
  color: "#3f3f46",
  fontSize: 13,
};

interface Props {
  car: Car;
  index: number;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
}

export default function CarCard({ car, index, onEdit, onDelete }: Props) {
  const swatch = colorToHex(car.color);

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        p: 3,
        borderRadius: "24px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "#ffffff",
        animation: `${fadeUp} 0.5s ease backwards`,
        animationDelay: `${Math.min(index, 8) * 60}ms`,
        transition:
          "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px) scale(1.015)",
          borderColor: "#d4d4d8",
          boxShadow: "0 24px 48px -12px rgba(24, 24, 27, 0.18)",
          "& .card-actions": { opacity: 1, transform: "translateY(0)" },
        },
        "&:focus-within .card-actions": {
          opacity: 1,
          transform: "translateY(0)",
        },
        "&:active": { transform: "translateY(-2px) scale(0.99)" },
      }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <PlateBadge plate={car.plate} province={car.province} />
        <Stack
          direction="row"
          spacing={0.5}
          className="card-actions"
          sx={{
            opacity: 0,
            transform: "translateY(-4px)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
            "@media (hover: none)": { opacity: 1, transform: "none" },
          }}
        >
          <IconButton
            size="small"
            aria-label="Edit car"
            onClick={() => onEdit(car)}
            sx={{ bgcolor: "#f4f4f5", "&:hover": { bgcolor: "#e4e4e7" } }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label="Delete car"
            onClick={() => onDelete(car)}
            sx={{
              bgcolor: "#f4f4f5",
              "&:hover": { bgcolor: "#fee2e2", color: "error.main" },
            }}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Typography
          sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary" }}
        >
          {car.brand}
        </Typography>
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
          }}
        >
          {car.model}
        </Typography>
      </Box>

      {(car.year || car.color) && (
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ mt: 2, flexWrap: "wrap" }}
        >
          {car.year && (
            <Box sx={pill}>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
              {car.year}
            </Box>
          )}
          {car.color && (
            <Box sx={pill}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: swatch,
                  boxShadow: "0 0 0 1px rgba(24, 24, 27, 0.2)",
                }}
              />
              {car.color}
            </Box>
          )}
        </Stack>
      )}

      {car.note && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {car.note}
        </Typography>
      )}
    </Card>
  );
}
