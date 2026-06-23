import React from "react";
import WorkbookTopNav from "./WorkbookTopNav.jsx";

function initialsForName(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "AL";
}

export default function WorkbookShell({
  activeGroup,
  activePage = "self",
  activeTab = "",
  children,
  onNavigate,
  userName = "Andrey Litvinov",
}) {
  return (
    <section className="workbook-app">
      <div className="workbook-shell">
        <header className="workbook-header">
          <div className="workbook-brand">
            <span className="workbook-brand-mark" aria-hidden="true">✦</span>
            <strong>PsiTherapy</strong>
          </div>
          <WorkbookTopNav
            activeGroup={activeGroup}
            activePage={activePage}
            activeTab={activeTab}
            onNavigate={onNavigate}
          />
          <button className="workbook-account" type="button">
            <span aria-hidden="true">{initialsForName(userName)}</span>
            <strong>{userName}</strong>
            <small aria-hidden="true">⌄</small>
          </button>
        </header>
        {children}
      </div>
    </section>
  );
}
