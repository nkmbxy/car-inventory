import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface Props extends Omit<ButtonProps, "variant" | "color"> {
  variant?: Variant;
  loading?: boolean;
  loadingText?: string;
}

const PRESETS: Record<
  Variant,
  { variant: ButtonProps["variant"]; color: ButtonProps["color"] }
> = {
  primary: { variant: "contained", color: "primary" },
  secondary: { variant: "outlined", color: "inherit" },
  danger: { variant: "contained", color: "error" },
  ghost: { variant: "text", color: "inherit" },
};

export default function AppButton({
  variant = "primary",
  loading = false,
  loadingText,
  disabled,
  children,
  sx,
  ...rest
}: Props) {
  const preset = PRESETS[variant];

  return (
    <Button
      variant={preset.variant}
      color={preset.color}
      disabled={disabled || loading}
      sx={[
        variant === "secondary" && { borderColor: "divider" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}
