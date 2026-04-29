import React from 'react';
export function BeaconLogo() {
  return (
    <svg
      className="beacon-logo"
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="80" height="80" rx="24" className="beacon-frame" />
      <path
        d="M44 14L53 30H35L44 14ZM39 30H49V61C49 66.523 46.761 71 44 71C41.239 71 39 66.523 39 61V30Z"
        className="beacon-core"
      />
      <path
        d="M20 42C24.833 35.333 31.5 32 40 32M68 42C63.167 35.333 56.5 32 48 32"
        className="beacon-wave"
      />
      <path
        d="M14 53C21.667 46.333 30.333 43 40 43M74 53C66.333 46.333 57.667 43 48 43"
        className="beacon-wave soft"
      />
    </svg>
  );
}

export function BellIcon() {
  return (
    <svg
      className="followup-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 4.25C9.37665 4.25 7.25 6.37665 7.25 9V11.6308C7.25 12.3107 7.06835 12.9782 6.72406 13.5647L5.25681 16.0654C4.87418 16.7176 5.34447 17.5417 6.09984 17.5417H17.9002C18.6555 17.5417 19.1258 16.7176 18.7432 16.0654L17.2759 13.5647C16.9317 12.9782 16.75 12.3107 16.75 11.6308V9C16.75 6.37665 14.6234 4.25 12 4.25Z"
        className="bell-line"
      />
      <path
        d="M9.75 18.1667C10.1191 19.2148 10.9992 19.9584 12 19.9584C13.0008 19.9584 13.8809 19.2148 14.25 18.1667"
        className="bell-line"
      />
    </svg>
  );
}

export function splitRecommendation(item) {
  const suffix = item.level === 'Bach' ? ' (Bach)' : ` ${item.level}`;
  return `${item.name}${suffix}`;
}

export function renderContactLine(contactText, contactHandle) {
  const handle = contactHandle || '';

  if (!handle || !contactText.includes(handle)) {
    return <p>{contactText}</p>;
  }

  const [before, after] = contactText.split(handle);

  return (
    <p>
      {before}
      <strong>{handle}</strong>
      {after}
    </p>
  );
}

export function ReportFrame({ brand, page, children, followup, pageClassName = '' }) {
  return (
    <section className={`report-page ${pageClassName}`.trim()}>
      <header className="report-header">
        <div className="brand-lockup">
          <BeaconLogo />
          <div className="brand-copy">
            <p className="brand-title">{brand.title}</p>
            <p className="brand-subtitle">{brand.subtitle}</p>
          </div>
        </div>

        <div className="page-headings">
          <p className="eyebrow">{page.title}</p>
          <p className="page-subtitle">{page.subtitle}</p>
        </div>

        <div className="page-number">{page.number}</div>
      </header>

      {children}

      {followup ? (
        <footer className="followup-block soft-card">
          <BellIcon />
          <div className="followup-copy">
            <p>{followup.text}</p>
            {renderContactLine(followup.contact, brand.contact)}
          </div>
        </footer>
      ) : null}

      <div className="page-decoration" aria-hidden="true" />
    </section>
  );
}
