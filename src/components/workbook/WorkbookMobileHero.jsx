import React from "react";

export default function WorkbookMobileHero({ children, className = "" }) {
  return (
    <section className={["workbook-mobile-hero", className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}
