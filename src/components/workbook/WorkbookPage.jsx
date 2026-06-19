import React from "react";

export default function WorkbookPage({
  backgroundVariant = "plain",
  children,
  className = "",
  side = "left",
  variant = "message",
}) {
  return (
    <article
      className={["workbook-page", `workbook-page-${side}`, `workbook-page-${variant}`, className]
        .filter(Boolean)
        .join(" ")}
      data-bg={backgroundVariant}
      data-side={side}
    >
      {children}
    </article>
  );
}
