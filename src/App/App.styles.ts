import { makeStaticStyles, makeStyles } from "@fluentui/react-components";

export const useGlobalStyles = makeStaticStyles({
  "*": { boxSizing: "border-box" },
  "html, body, #root": { minHeight: "100%", margin: 0 },
  body: {
    minWidth: "320px",
    backgroundColor: "#f5f6f3",
    color: "#172321",
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSynthesis: "none",
    textRendering: "optimizeLegibility",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  "button, input": { font: "inherit" },
  "button, a": { WebkitTapHighlightColor: "transparent" },
  "button:focus-visible, a:focus-visible, input:focus-visible": {
    outline: "3px solid #8fc5ae",
    outlineOffset: "3px",
  },
});

export const useAppStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});
