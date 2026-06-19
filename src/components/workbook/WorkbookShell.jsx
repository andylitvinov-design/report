import React from "react";
import WorkbookTopNav from "./WorkbookTopNav.jsx";

export default function WorkbookShell({ activeGroup = "overview", children, onNavigate }) {
  return (
    <section className="workbook-app">
      <div className="workbook-shell">
        <header className="workbook-header">
          <div className="workbook-brand">
            <strong>PsiTherapy</strong>
            <span>Журнал самонаблюдений</span>
          </div>
          <WorkbookTopNav activeGroup={activeGroup} onNavigate={onNavigate} />
        </header>
        {children}
      </div>
    </section>
  );
}
