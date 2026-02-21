// Centralized email styling system for a modern, creative aesthetic

export const main = {
    backgroundColor: "#F4F4F5", // Zin 100 for a subtle modern backdrop
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

export const container = {
    backgroundColor: "#ffffff",
    margin: "40px auto",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0,0,0,0.02)",
    maxWidth: "600px",
    overflow: "hidden",
};

export const h1 = {
    color: "#09090B", // Zinc 950
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "-0.025em",
    textAlign: "center" as const,
    margin: "0 0 32px 0",
};

export const h2 = {
    color: "#09090B",
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "-0.015em",
    margin: "0 0 16px 0",
};

export const text = {
    color: "#3F3F46", // Zinc 700
    fontSize: "16px",
    lineHeight: "26px",
    textAlign: "left" as const,
    marginBottom: "20px",
};

export const highlightBox = {
    padding: "24px",
    backgroundColor: "#FAFAFA", // Very subtle gray
    border: "1px solid #E4E4E7", // Zinc 200
    borderRadius: "16px",
    marginBottom: "32px",
};

export const detailRow = {
    marginBottom: "12px",
    color: "#18181B", // Zinc 900
    fontSize: "15px",
    lineHeight: "24px",
};

export const detailLabel = {
    color: "#71717A", // Zinc 500
    fontWeight: "600",
    marginRight: "8px",
};

export const buttonPrimary = {
    backgroundColor: "#18181B", // Jet black
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "100%",
    padding: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
};

export const buttonSuccess = {
    ...buttonPrimary,
    backgroundColor: "#10B981", // Emerald 500
    boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
};

export const buttonDanger = {
    ...buttonPrimary,
    backgroundColor: "#EF4444", // Red 500
    boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.2)",
};

export const hr = {
    borderColor: "#E4E4E7", // Zinc 200
    margin: "32px 0",
};

export const footer = {
    color: "#A1A1AA", // Zinc 400
    fontSize: "13px",
    lineHeight: "20px",
    textAlign: "center" as const,
};

export const unsub = {
    color: "#A1A1AA",
    textDecoration: "underline",
    fontWeight: "500",
};

export const headerBrand = {
    textAlign: "center" as const,
    marginBottom: "32px",
};

export const headerLogo = {
    display: "inline-block",
    background: "linear-gradient(135deg, #18181B 0%, #3F3F46 100%)",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "12px",
    fontWeight: "800",
    fontSize: "18px",
    letterSpacing: "-0.5px",
};
