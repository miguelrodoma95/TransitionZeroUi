import { makeStyles, tokens } from "@fluentui/react-components";

export const useBrandStyles = makeStyles({
  root: {
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
    width: "fit-content",
    color: "#20302b",
    textDecorationLine: "none",
    fontSize: "15px",
    letterSpacing: "-.06em",
    fontWeight: 760,
    ":focus-visible": {
      outline: `3px solid ${tokens.colorBrandStroke1}`,
      outlineOffset: "3px",
    },
  },
  inverse: {
    color: "#f3f5ed",
  },
  mark: {
    width: "23px",
    height: "23px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    border: "1px solid #8db4a0",
    borderRadius: "50%",
    "> span": {
      width: "7px",
      height: "7px",
      position: "absolute",
      border: "1px solid #668f7a",
      borderRadius: "50%",
    },
    "> span:first-child": {
      transform: "translate(-3px, 2px)",
      backgroundColor: "#91b6a2",
    },
    "> span:last-child": {
      transform: "translate(3px, -2px)",
      backgroundColor: "#f6f7f5",
    },
  },
  inverseMark: {
    "> span:last-child": {
      backgroundColor: "#192b28",
    },
  },
  wordmark: {
    "> span": {
      fontWeight: 430,
    },
  },
  arrow: {
    marginLeft: "-6px",
    color: "#8fac9b",
  },
  inverseArrow: {
    color: "#b6c8b7",
  },
});
