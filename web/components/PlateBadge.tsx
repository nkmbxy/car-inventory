import { Box, Typography } from "@mui/material";

export default function PlateBadge({
  plate,
  province,
}: {
  plate: string;
  province: string;
}) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        px: 1.75,
        py: 0.5,
        borderRadius: "10px",
        border: "1.5px solid #18181b",
        bgcolor: "#ffffff",
      }}
    >
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: 1,
          lineHeight: 1.35,
          color: "#18181b",
        }}
      >
        {plate}
      </Typography>
      {province && (
        <Typography
          sx={{
            fontSize: 11,
            lineHeight: 1.3,
            color: "#71717a",
            letterSpacing: 0.3,
          }}
        >
          {province}
        </Typography>
      )}
    </Box>
  );
}
