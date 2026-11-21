"use client";
import { createTheme } from "@mui/material/styles";
import { Inter, Noto_Sans_Thai } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const thai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    primary: { main: "#18181b" },
    error: { main: "#dc2626" },
    background: { default: "#fafafa", paper: "#ffffff" },
    text: { primary: "#18181b", secondary: "#71717a" },
    divider: "#e4e4e7",
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: `${inter.style.fontFamily}, ${thai.style.fontFamily}, sans-serif`,
    h3: { fontWeight: 600, letterSpacing: "-0.03em" },
    h6: { fontWeight: 600, letterSpacing: "-0.01em" },
    button: { textTransform: "none", fontWeight: 500 },
  },
  components: {
        MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, padding: "8px 20px" },
        contained: {
          "&.MuiButton-colorPrimary:hover": { backgroundColor: "#27272a" },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(9, 9, 11, 0.35)",
            backdropFilter: "blur(4px)",
          },
        },
        container: { alignItems: "flex-start" },
        paper: {
          margin: "64px 16px 32px",
          maxHeight: "calc(100% - 96px)",
          borderRadius: 24,
          boxShadow: "0 32px 80px -16px rgba(9, 9, 11, 0.35)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12 },
        notchedOutline: { borderColor: "#e4e4e7" },
      },
    },
  },
});

export default theme;