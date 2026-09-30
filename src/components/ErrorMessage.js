import { Alert, Button } from "@mui/material";

// Friendly error box with an optional Retry button
export default function ErrorMessage({ message, onRetry }) {
  return (
    <Alert
      severity="error"
      sx={{ my: 2 }}
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        )
      }
    >
      {message}
    </Alert>
  );
}