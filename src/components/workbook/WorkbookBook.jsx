import React from "react";

export default function WorkbookBook({ children, className = "" }) {
  return <div className={["workbook-book", className].filter(Boolean).join(" ")}>{children}</div>;
}
