import React, { useEffect, useMemo, useState } from "react";
import { createEmptyLifePlanSections, hasLifePlanContent, normalizeLifePlanSections, readLifePlan, saveLifePlan } from "../lib/lifePlanStorage.js";

const LIFE_AREAS = [
  { id: "direction", title: "Направление и смысл", description: "Ценности, видение жизни и личные приоритеты.", first: ["Life Purpose Coach", "Ценности и жизненное направление", "Сформулировать личные ориентиры и критерии выбора."], second: ["Strategic Life Coach", "Видение и приоритеты", "Перевести ориентиры в реалистичные цели."] },
  { id: "wellbeing", title: "Благополучие и энергия", description: "Стресс, восстановление и повседневные ритмы.", first: ["Stress Recovery Coach", "Стресс и восстановление", "Определить источники перегрузки и способы поддержки."], second: ["Wellbeing Coach", "Энергия и привычки", "Создать бережный план устойчивых ежедневных действий."] },
  { id: "relationships", title: "Отношения и семья", description: "Коммуникация, близость, семья и личные границы.", first: ["Relationship Coach", "Динамика отношений", "Прояснить потребности и повторяющиеся ситуации."], second: ["Communication & Boundaries Specialist", "Диалог и границы", "Подготовить конкретные способы общения."] },
  { id: "career", title: "Работа и карьера", description: "Профессиональное направление, развитие и баланс.", first: ["Career Coach", "Сильные стороны и выбор", "Выделить подходящие направления и критерии выбора."], second: ["Executive & Strategy Coach", "Карьерная стратегия", "Составить маршрут развития и ближайшие шаги."] },
  { id: "money", title: "Деньги и ресурсы", description: "Личные цели, ресурсы и решения. Не заменяет финансовую консультацию.", first: ["Financial Wellbeing Coach", "Цели и денежные привычки", "Прояснить приоритеты и вопросы для дальнейшей работы."], second: ["Business & Career Coach", "Ресурсы и возможности", "Исследовать профессиональные возможности и навыки."] },
  { id: "growth", title: "Личностный рост", description: "Обучение, навыки, уверенность и личные изменения.", first: ["Personal Growth Coach", "Паттерны и точки роста", "Выделить приоритетную тему и критерий прогресса."], second: ["Learning & Skills Coach", "Навыки и практика", "Составить план обучения и регулярной практики."] },
  { id: "lifestyle", title: "Образ жизни и окружение", description: "Дом, привычки, место проживания и социальная среда.", first: ["Lifestyle Coach", "Привычки и среда", "Определить подходящие изменения образа жизни."], second: ["Transition Coach", "Переход к новому укладу", "Подготовить последовательные шаги на период перемен."] },
  { id: "goals", title: "Цели и план действий", description: "Приоритеты, этапы, сроки и конкретные действия.", first: ["Strategic Coach", "Цели и приоритеты", "Выбрать измеримые цели и последовательность."], second: ["Accountability Coach", "План действий", "Определить контрольные точки и регулярный обзор."] },
  { id: "reflection", title: "Рефлексия и пересмотр", description: "Что изменилось, что помогает и что стоит пересмотреть.", first: ["Integrative Coach", "Итоги и ориентиры", "Увидеть динамику и сформулировать новый запрос."], second: ["Relevant Domain Specialist", "Тематическая встреча", "Углубить тему, которая стала приоритетной."] },
];

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function makeReports({ firstIntakeResult, advancedAiResult, consultationReports }) {
  const reports = [];
  if (firstIntakeResult) reports.push({
    id: "first-intake",
    type: "ai",
    title: firstIntakeResult.title || "Отчёт по первичному ИИ-приёму",
    date: firstIntakeResult.completedAt || firstIntakeResult.updatedAt || null,
    summary: firstIntakeResult.summary || firstIntakeResult.hypothesis || "Сохранённый результат первичного диалога.",
    source: "Первичный ИИ-приём",
  });
  if (advancedAiResult) reports.push({
    id: "advanced-analysis",
    type: "ai",
    title: advancedAiResult.title || advancedAiResult.programTitle || "Расширенный ИИ-анализ",
    date: advancedAiResult.completedAt || advancedAiResult.updatedAt || null,
    summary: advancedAiResult.hypothesis || advancedAiResult.summary || "Сохранённый результат расширенного анализа.",
    source: "Расширенный ИИ-анализ",
  });
  (Array.isArray(consultationReports) ? consultationReports : []).forEach((report, index) => {
    if (!report || report.clientVisible === false) return;
    reports.push({
      id: String(report.id || `consultation-${index}`),
      type: "consultation",
      title: report.title || report.serviceTitle || "Результат консультации",
      date: report.completedAt || report.createdAt || report.created_at || null,
      summary: report.summary || report.resultSummary || "Результат встречи со специалистом.",
      source: report.specialistName || report.specialist || "Консультация специалиста",
      href: report.href || "",
    });
  });
  return reports.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function EmptyPlan({ onStartIntake, onConsultation }) {
  return (
    <section className="card life-plan-empty">
      <span className="eyebrow">Ваш личный маршрут</span>
      <h2>Начните создавать свой план жизни</h2>
      <p>План постепенно заполняется после коучинговых и консультационных встреч. Вы также можете начать самостоятельно и возвращаться к разделам по мере появления новых идей.</p>
      <div className="life-plan-empty-actions">
        <button className="primary-btn" type="button" onClick={onStartIntake}>Начать первый ИИ-приём</button>
        <button className="secondary-btn" type="button" onClick={onConsultation}>Рассмотреть встречу со специалистом</button>
      </div>
    </section>
  );
}

function ReportsCatalog({ reports, filter, setFilter, selectedReport, setSelectedReport }) {
  const visible = reports.filter((report) => filter === "all" || report.type === filter);
  return (
    <section className="life-plan-reports">
      <div className="life-plan-filters" role="group" aria-label="Тип отчётов">
        <button type="button" className={filter === "all" ? "tab active" : "tab"} onClick={() => setFilter("all")}>Все ({reports.length})</button>
        <button type="button" className={filter === "ai" ? "tab active" : "tab"} onClick={() => setFilter("ai")}>ИИ-отчёты ({reports.filter((x) => x.type === "ai").length})</button>
        <button type="button" className={filter === "consultation" ? "tab active" : "tab"} onClick={() => setFilter("consultation")}>Консультации ({reports.filter((x) => x.type === "consultation").length})</button>
      </div>
      {visible.length === 0 ? (
        <div className="card life-plan-empty-report">
          <h3>Пока нет доступных отчётов этого типа</h3>
          <p>Здесь появятся результаты, которые были сохранены или переданы вам в личный кабинет.</p>
        </div>
      ) : (
        <div className="life-plan-report-list">
          {visible.map((report) => (
            <article className="card life-plan-report" key={report.id}>
              <div className="life-plan-report-meta">
                <span className="life-plan-type">{report.type === "ai" ? "ИИ-отчёт" : "Консультация"}</span>
                <time>{formatDate(report.date) || "Дата не указана"}</time>
              </div>
              <h3>{report.title}</h3>
              <p className="life-plan-report-source">{report.source}</p>
              <p>{report.summary}</p>
              {report.href ? <a className="text-link" href={report.href}>Открыть результат</a> : <button type="button" className="text-link life-plan-inline-button" onClick={() => setSelectedReport(report)}>Подробнее</button>}
            </article>
          ))}
        </div>
      )}
      {selectedReport && (
        <div className="life-plan-modal-backdrop" role="presentation" onClick={() => setSelectedReport(null)}>
          <section className="card life-plan-report-modal" role="dialog" aria-modal="true" aria-label={selectedReport.title} onClick={(event) => event.stopPropagation()}>
            <button className="life-plan-modal-close" type="button" onClick={() => setSelectedReport(null)}>Закрыть</button>
            <span className="eyebrow">{selectedReport.source}</span>
            <h3>{selectedReport.title}</h3>
            <p>{selectedReport.summary}</p>
            <small>{formatDate(selectedReport.date)}</small>
          </section>
        </div>
      )}
    </section>
  );
}

export default function LifePlanPage({
  client,
  firstIntakeResult,
  advancedAiResult,
  consultationReports = [],
  onStartIntake,
  onOpenConsultations,
}) {
  const ownerId = client?.id || client?.sub || "";
  const email = client?.email || "";
  const [sections, setSections] = useState(() => {
    return readLifePlan({ ownerId, email })?.sections || createEmptyLifePlanSections();
  });
  const [updatedAt, setUpdatedAt] = useState(() => readLifePlan({ ownerId, email })?.updatedAt || null);
  const [hasSavedPlan, setHasSavedPlan] = useState(() => Boolean(readLifePlan({ ownerId, email })));
  const [view, setView] = useState("plan");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeError, setNoticeError] = useState(false);
  const [reportFilter, setReportFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);

  // The cabinet may keep this page mounted while the authenticated client changes.
  // Always re-hydrate account-partitioned data and clear transient UI state on owner changes.
  useEffect(() => {
    const saved = readLifePlan({ ownerId, email });
    setSections(saved?.sections || createEmptyLifePlanSections());
    setUpdatedAt(saved?.updatedAt || null);
    setHasSavedPlan(Boolean(saved));
    setView("plan");
    setEditing(false);
    setSelectedReport(null);
    setReportFilter("all");
    setNotice("");
    setNoticeError(false);
  }, [ownerId, email]);

  const reports = useMemo(() => makeReports({ firstIntakeResult, advancedAiResult, consultationReports }), [firstIntakeResult, advancedAiResult, consultationReports]);
  const hasContent = hasLifePlanContent(sections);
  const hasHistory = reports.length > 0;
  const hasWorkspace = hasSavedPlan || hasContent || hasHistory || editing;

  const updateField = (sectionId, field, value) => {
    setSections((current) => ({
      ...current,
      [sectionId]: { ...current[sectionId], [field]: value },
    }));
    setNotice("");
  };

  const save = () => {
    setSaving(true);
    setNotice("");
    setNoticeError(false);
    try {
      const saved = saveLifePlan({ ownerId, email, sections });
      setSections(normalizeLifePlanSections(saved.sections));
      setUpdatedAt(saved.updatedAt);
      setHasSavedPlan(true);
      setEditing(false);
      setNotice("План сохранён в этом браузере для вашего аккаунта.");
    } catch (error) {
      setNoticeError(true);
      setNotice(error.message || "Не удалось сохранить план.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="life-plan-page" aria-labelledby="life-plan-title">
      <div className="life-plan-hero card">
        <span className="eyebrow">Личное пространство</span>
        <h2 id="life-plan-title">My Coaching Plan</h2>
        <p>Одна карта жизненных направлений, целей и следующих шагов. Вы решаете, что заполнять и какие рекомендации принимать.</p>
        <div className="life-plan-privacy">Ваши записи хранятся локально в браузере и привязаны к аккаунту. Они не передаются специалистам автоматически.</div>
      </div>
      {!hasWorkspace ? (
        <EmptyPlan onStartIntake={onStartIntake} onConsultation={onOpenConsultations} />
      ) : (
        <>
          <div className="life-plan-toolbar">
            <div className="life-plan-tabs" role="group" aria-label="План и отчёты">
              <button type="button" className={view === "plan" ? "tab active" : "tab"} onClick={() => setView("plan")}>План жизни</button>
              <button type="button" className={view === "reports" ? "tab active" : "tab"} onClick={() => setView("reports")}>Отчёты и консультации ({reports.length})</button>
            </div>
            {view === "plan" && <button className="secondary-btn" type="button" onClick={() => setEditing((value) => !value)}>{editing ? "Завершить редактирование" : "Редактировать план"}</button>}
          </div>
          {view === "reports" ? (
            <ReportsCatalog reports={reports} filter={reportFilter} setFilter={setReportFilter} selectedReport={selectedReport} setSelectedReport={setSelectedReport} />
          ) : (
            <div className="life-plan-area-list">
              {LIFE_AREAS.map((area, index) => {
                const value = sections[area.id];
                const filled = Object.values(value).some((item) => item.trim());
                return (
                  <details className="card life-plan-area" key={area.id} open={index === 0}>
                    <summary>
                      <span><strong>{area.title}</strong><small>{area.description}</small></span>
                      <span className={filled ? "life-plan-area-status filled" : "life-plan-area-status"}>{filled ? "Заполнено" : "Можно заполнить позже"}</span>
                    </summary>
                    <div className="life-plan-area-body">
                      {editing ? (
                        <>
                          <label>Где я сейчас<textarea rows="3" value={value.current} onChange={(event) => updateField(area.id, "current", event.target.value)} /></label>
                          <label>К чему хочу прийти<textarea rows="3" value={value.desired} onChange={(event) => updateField(area.id, "desired", event.target.value)} /></label>
                          <label>Следующие шаги<textarea rows="3" value={value.actions} onChange={(event) => updateField(area.id, "actions", event.target.value)} /></label>
                          <label>Мои заметки<textarea rows="2" value={value.notes} onChange={(event) => updateField(area.id, "notes", event.target.value)} /></label>
                        </>
                      ) : (
                        <div className="life-plan-area-preview">
                          {value.current && <p><strong>Сейчас:</strong> {value.current}</p>}
                          {value.desired && <p><strong>Желаемый результат:</strong> {value.desired}</p>}
                          {value.actions && <p><strong>Следующие шаги:</strong> {value.actions}</p>}
                          {value.notes && <p><strong>Заметки:</strong> {value.notes}</p>}
                          {!filled && <p>Раздел пока не заполнен.</p>}
                        </div>
                      )}
                    </div>
                    <aside className="life-plan-journey">
                      <span className="eyebrow">Возможная последовательность встреч</span>
                      {[area.first, area.second].map((step, stepIndex) => (
                        <div className="life-plan-journey-step" key={step[0]}>
                          <span>{stepIndex + 1}</span>
                          <div><strong>{step[0]}</strong><b>{step[1]}</b><p>{step[2]}</p></div>
                        </div>
                      ))}
                      <button type="button" className="text-link life-plan-inline-button" onClick={onOpenConsultations}>Посмотреть формат встречи со специалистом</button>
                      <small>Профили и темы рекомендованы по направлению. Реальные доступные специалисты и время встречи проверяются в каталоге. Запись и передача данных не выполняются автоматически.</small>
                    </aside>
                  </details>
                );
              })}
              {editing && <div className="life-plan-save-row"><button className="primary-btn" type="button" disabled={saving} onClick={save}>{saving ? "Сохраняю…" : "Сохранить план"}</button></div>}
              {updatedAt && <p className="life-plan-updated">Последнее сохранение: {formatDate(updatedAt)}</p>}
              {notice && <p className={noticeError ? "placeholder-notice error" : "placeholder-notice"} role="status">{notice}</p>}
            </div>
          )}
        </>
      )}
    </section>
  );
}
