import React from "react";

export default function WorkbookActionList({ children, label = "Действия", className = "" }) {
  return (
    <div className={["workbook-action-list", className].filter(Boolean).join(" ")} aria-label={label}>
      {children}
    </div>
  );
}
