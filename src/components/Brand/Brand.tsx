import { mergeClasses } from "@fluentui/react-components";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useBrandStyles } from "./Brand.styles";

interface BrandProps {
  inverse?: boolean;
  slate?: boolean;
}

export function Brand({ inverse = false, slate = false }: BrandProps) {
  const styles = useBrandStyles();

  return (
    <Link
      className={mergeClasses(styles.root, inverse && styles.inverse, slate && styles.slate)}
      to="/"
      aria-label="TransitionZero home"
    >
      <span
        className={mergeClasses(styles.mark, inverse && styles.inverseMark, slate && styles.slateMark)}
        aria-hidden="true"
      >
        <span />
        <span />
      </span>
      <span className={styles.wordmark}>transition<span>zero</span></span>
      <ArrowUpRight className={mergeClasses(styles.arrow, inverse && styles.inverseArrow, slate && styles.slateArrow)} size={14} aria-hidden="true" />
    </Link>
  );
}
