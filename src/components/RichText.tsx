import { Trans } from "react-i18next";
import type { ParseKeys } from "i18next";

/** Tags translators can use in a string: <br/>, <strong>, <em>, and <red> for the brand red. */
const tags = {
  br: <br />,
  strong: <strong />,
  em: <em />,
  red: <span className="proximater-red" />,
};

/** Renders a translation that contains inline markup. */
export function RichText({ k }: { k: ParseKeys }) {
  return <Trans i18nKey={k} components={tags} />;
}
