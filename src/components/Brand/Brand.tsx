import { mergeClasses } from "@fluentui/react-components";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useBrandStyles } from "./Brand.styles";

interface BrandProps {
  inverse?: boolean;
}

export function Brand({ inverse = false }: BrandProps) {
  const styles = useBrandStyles();

  return (
    <Link
      className={mergeClasses(styles.root, inverse && styles.inverse)}
      to="/"
      aria-label="TransitionZero home"
    >
      <span
        className={mergeClasses(styles.mark, inverse && styles.inverseMark)}
        aria-hidden="true"
      >
        <span />
        <span />
      </span>
      <span className={styles.wordmark}>transition<span>zero</span></span>
      <ArrowUpRight className={mergeClasses(styles.arrow, inverse && styles.inverseArrow)} size={14} aria-hidden="true" />
    </Link>
  );
}
