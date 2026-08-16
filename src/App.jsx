import React, { useEffect, useMemo, useState } from "react";
import Layout from "./components/Layout.jsx";
import { analysisCatalog, client, clientProgress, selfAnalysis } from "./data/mockData.js";
import { testCatalog } from "./data/testCatalog.js";
import AdvancedAiAnalysis from "./pages/AdvancedAiAnalysis.jsx";
import ExpertAnalysis from "./pages/ExpertAnalysis.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import SelfAnalysis from "./pages/SelfAnalysis.jsx";
import {
  authEnv,
  clearStoredSession,
  exchangeOAuthCodeFromUrl,
  getCurrentUser,
  signOut,
} from "./lib/authClient.js";
import { readAdvancedAiAnalysisResult } from "./lib/advancedAiAnalysisStorage.js";
import { readFirstIntakeProgress, readFirstIntakeResult } from "./lib/firstIntakeStorage.js";

export const pageTabs = {
  overview: [],
  profile: [],
  expert: ["Меню отчётов", "Самоотчёт", "Расширенный ИИ-анализ", "Диагностика эксперта", "Механизм", "У-Син", "Препараты"],
  recommendations: ["Отчёты Мастера", "ИИ-отчёты"],
  self: [],
  advanced: [],
  history: ["Текущие рекомендации", "Карта личности", "Динамика замеров", "История", "Следующий шаг"],
  consultations: [],
};

const packageFormats = [
  {
    id: "basic",
    title: "Базовый",
    price: "0€",
    description: "Короткий ИИ-приём и базовые результаты.",
  },
  {
    id: "expanded",
    title: "Расширенный",
    price: "5€",
    description: "Доступ к расширенным диагностикам и ИИ-отчётам.",
  },
  {
    id: "personal",
    title: "Личный",
    price: "50€",
    description: "Расширенный формат плюс одна персональная сессия вне очереди.",
  },
  {
    id: "support",
    title: "Сопровождение",
    price: "200€",
    description: "Входит 4 сессии плюс 4 недели дистанционной энергетической коррекции и поддержки через препараты.",
  },
  {
    id: "deepSupport",
    title: "Глубокая поддержка",
    price: "300€/мес",
    description: "Для случаев, когда человеку нужна более частая и бережная дистанционная поддержка.",
    details: [
      "Несколько раз в неделю — проверка препаратов/средств поддержки.",
      "Каждый день — дистанционное сопровождение и корректировка по состоянию.",
    ],
  },
];

const accessRank = {
  basic: 0,
  expanded: 1,
  personal: 2,
  support: 3,
  deepSupport: 4,
};

const aiReportCards = [
  {
    id: "homeopathy",
    title: "План-программа коррекции в гомеопатии",
    source: "по результатам ИИ-приёма и текущего запроса",
  },
  {
    id: "naturopathy",
    title: "План-программа коррекции в натуропатии",
    source: "по ресурсу, нагрузке и режиму восстановления",
  },
  {
    id: "bach",
    title: "План-программа коррекции в цветочной терапии Баха",
    source: "по Bach-блоку и эмоциональным темам",
  },
  {
    id: "body-therapy",
    title: "Отчёт Рекомендации телесной терапии",
    source: "по телесным маркерам и уровню напряжения",
  },
  {
    id: "imaginal-therapy",
    title: "Отчёт рекомендация Образной Терапии",
    source: "по запросу и повторяющимся образам",
  },
];

function LockedReportState({
  bookingNoticeVisible,
  onSpecialistRequest,
  onStartSelfAnalysis,
}) {
  return (
    <section className="locked-empty-state" aria-labelledby="locked-report-title">
      <article className="card locked-empty-card">
        <p className="eyebrow">Результаты (Отчёт)</p>
        <h2 id="locked-report-title">Результаты появятся после первого анализа</h2>
        <p>
          Сейчас отчётов ещё нет. Чтобы открыть этот раздел, сначала пройдите первый короткий
          самоанализ или закажите встречу со специалистом.
        </p>
        <div className="locked-empty-actions">
          <button className="primary-btn" onClick={onStartSelfAnalysis} type="button">
            Пройти первый анализ
          </button>
          <button className="secondary-btn" onClick={onSpecialistRequest} type="button">
            Заказать встречу
          </button>
        </div>
        {bookingNoticeVisible && (
          <p className="placeholder-notice" role="status">
            Раздел записи к специалисту ещё подключается. Запрос сохранён как следующий шаг.
          </p>
        )}
      </article>
    </section>
  );
}

export function getFirstIntakeStatus({ firstIntakeResult, firstIntakeProgress }) {
  if (firstIntakeResult) return "completed";
  if (firstIntakeProgress && firstIntakeProgress.status !== "completed") return "in_progress";
  return "not_started";
}

export function getPrimaryIntakeCtaLabel(status) {
  if (status === "in_progress") return "Продолжить первый ИИ-приём";
  if (status === "completed") return "Повторный ИИ-приём";
  return "Пройти первый ИИ-приём";
}

const durationFilters = [
  { id: "any", label: "Любое время" },
  { id: "under5", label: "до 5 минут" },
  { id: "5to10", label: "5–10 минут" },
  { id: "10to20", label: "10–20 минут" },
  { id: "20plus", label: "20+ минут" },
];

function matchesDurationFilter(minutes, filter) {
  if (filter === "under5") return minutes <= 5;
  if (filter === "5to10") return minutes >= 5 && minutes <= 10;
  if (filter === "10to20") return minutes >= 10 && minutes <= 20;
  if (filter === "20plus") return minutes >= 20;
  return true;
}

function getTestStatusLabel(status) {
  if (status === "in_progress") return "начат";
  if (status === "completed") return "результат готов";
  if (status === "repeat_available") return "можно повторить";
  return "не начат";
}

function getTestCtaLabel(status) {
  if (status === "in_progress") return "Продолжить";
  if (status === "completed") return "Открыть результат";
  if (status === "repeat_available") return "Пройти повторно";
  return "Пройти тест";
}

function TestCatalogSection({
  advancedAiResult,
  firstIntakeStatus,
  onStartAdvanced,
  onStartAnalysis,
  onStartBrief,
}) {
  const [themeFilter, setThemeFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("any");
  const themes = ["all", ...Array.from(new Set(testCatalog.map((item) => item.theme)))];

  const getStatus = (item) => {
    if (item.id === "dao-resource" && advancedAiResult) return "completed";
    return "not_started";
  };

  const visibleTests = testCatalog.filter((item) => {
    const themeMatches = themeFilter === "all" || item.theme === themeFilter;
    return themeMatches && matchesDurationFilter(item.durationMinutes, durationFilter);
  });

  const handleStart = (item, status) => {
    if (item.page === "advanced") {
      onStartAdvanced?.();
      return;
    }
    if (status === "completed") {
      onStartAnalysis?.(item.analysisId);
      return;
    }
    onStartAnalysis?.(item.analysisId);
  };

  return (
    <section className="test-catalog-section" aria-labelledby="test-catalog-title">
      <article className="card intake-continuation-card">
        <div>
          <span className="ai-intake-secondary-title">Базовый первичный приём</span>
          <h3>Первичный ИИ-приём</h3>
          <p>4 части: точка состояния и 3 анкеты Bach.</p>
        </div>
        <div className="intake-continuation-actions">
          <small>{getTestStatusLabel(firstIntakeStatus)}</small>
          <button className="secondary-btn" type="button" onClick={onStartBrief}>
            {getPrimaryIntakeCtaLabel(firstIntakeStatus)}
          </button>
        </div>
      </article>

      <div className="test-catalog-head">
        <div>
          <span className="ai-intake-secondary-title">Расширенный приём</span>
          <h2 id="test-catalog-title">Тесты для самопроверки</h2>
        </div>
        <div className="test-catalog-filters" aria-label="Фильтры тестов">
          <label>
            <span>Все темы</span>
            <select value={themeFilter} onChange={(event) => setThemeFilter(event.target.value)}>
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme === "all" ? "Все темы" : theme}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Время</span>
            <select value={durationFilter} onChange={(event) => setDurationFilter(event.target.value)}>
              {durationFilters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {visibleTests.length === 0 ? (
        <p className="test-catalog-empty" role="status">
          По этим фильтрам пока нет тестов. Попробуйте выбрать другую тему или время.
        </p>
      ) : (
        <div className="test-catalog-grid">
          {visibleTests.map((item) => {
            const status = getStatus(item);
            return (
              <article className="card test-catalog-card" key={item.id}>
                <span>{item.theme}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="test-catalog-meta">
                  <small>≈ {item.durationMinutes} минут</small>
                  <small>{getTestStatusLabel(status)}</small>
                </div>
                <button className="secondary-btn" type="button" onClick={() => handleStart(item, status)}>
                  {getTestCtaLabel(status)}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function AiIntakeDashboard({
  advancedAiResult,
  firstIntakeProgress,
  firstIntakeResult,
  onOpenPersonalIntake,
  onStartAdvanced,
  onStartAnalysis,
  onStartBrief,
}) {
  const firstIntakeStatus = getFirstIntakeStatus({ firstIntakeResult, firstIntakeProgress });
  const hasBriefIntake = firstIntakeStatus === "completed";

  return (
    <section className="compact-section-page ai-intake-onboarding" aria-labelledby="ai-intake-title">
      <article className="card compact-route-hero ai-intake-hero">
        <span className="ai-intake-kicker">Мягкий AI-сеанс</span>
        <h2 id="ai-intake-title">
          {hasBriefIntake ? "Повторный ИИ-приём" : "Начните путь к ясности"}
        </h2>
        <p>
          {hasBriefIntake
            ? "AI задаст несколько бережных вопросов и обновит карту состояния."
            : "AI задаст несколько бережных вопросов и создаст первую карту состояния."}
        </p>
        <div className="compact-route-actions">
          <button className="primary-btn" type="button" onClick={onStartBrief}>
            {getPrimaryIntakeCtaLabel(firstIntakeStatus)}
          </button>
        </div>
        <button className="text-link ai-intake-personal-link" type="button" onClick={onOpenPersonalIntake}>
          Записаться на личный приём
        </button>
        {hasBriefIntake && (
          <button className="text-link ai-intake-advanced-link" type="button" onClick={onStartAdvanced}>
            {advancedAiResult ? "Вернуться к расширенному AI-срезу" : "Открыть расширенный AI-срез"}
          </button>
        )}
      </article>

      <TestCatalogSection
        advancedAiResult={advancedAiResult}
        firstIntakeStatus={firstIntakeStatus}
        onStartAdvanced={onStartAdvanced}
        onStartAnalysis={onStartAnalysis}
        onStartBrief={onStartBrief}
      />
    </section>
  );
}

function ConsultationPlaceholder({
  bookingNoticeVisible,
  hasCompletedResults,
  onOpenAiIntake,
  onOpenReport,
  onSpecialistRequest,
}) {
  return (
    <section className="compact-section-page" aria-labelledby="consultations-title">
      <article className="card compact-route-hero">
        <h2 id="consultations-title">Приём у Мастера</h2>
        <p>Можно оставить заявку на живое сопровождение, если хочется разобрать состояние вместе со специалистом.</p>
        <div className="compact-route-actions">
          <button className="primary-btn" onClick={onSpecialistRequest} type="button">
            Оставить заявку
          </button>
          {hasCompletedResults && (
            <button className="secondary-btn" onClick={onOpenReport} type="button">
              Открыть последний отчёт
            </button>
          )}
        </div>
        {bookingNoticeVisible && (
          <p className="placeholder-notice" role="status">
            Раздел записи к специалисту ещё подключается. Запрос сохранён как следующий шаг.
          </p>
        )}
      </article>
    </section>
  );
}

function ProfileReportsPage({ hasCompletedResults, onBookSession, onOpenReport, onStartSelfAnalysis }) {
  const reportText = hasCompletedResults
    ? "Последний ИИ-отчёт доступен."
    : "ИИ-отчёты появятся после первого ИИ-приёма.";

  return (
    <section className="compact-section-page" aria-labelledby="profile-reports-title">
      <article className="card compact-route-hero">
        <p className="eyebrow">Профиль</p>
        <h2 id="profile-reports-title">Отчёты и динамика</h2>
        <p>Личный архив, последние результаты и настройки доступа.</p>
      </article>

      <div className="compact-archive-grid">
        <article className="card compact-route-card">
          <span>Личный анализ</span>
          <h3>Отчёты специалиста</h3>
          <p>Появятся после личной сессии.</p>
          <button className="secondary-btn" type="button" onClick={onBookSession}>Заказать сессию</button>
        </article>
        <article className="card compact-route-card">
          <span>ИИ-анализ</span>
          <h3>Последний ИИ-отчёт</h3>
          <p>{reportText}</p>
          <button className="secondary-btn" type="button" onClick={hasCompletedResults ? onOpenReport : onStartSelfAnalysis}>
            {hasCompletedResults ? "Открыть последний отчёт" : "Пройти ИИ-приём"}
          </button>
        </article>
        <article className="card compact-route-card">
          <span>Данные и динамика</span>
          <h3>Сравнение срезов</h3>
          <p>После двух и более ИИ-приёмов.</p>
          <button className="secondary-btn" type="button" onClick={onStartSelfAnalysis}>Пройти повторный ИИ-приём</button>
        </article>
        <article className="card compact-route-card">
          <span>Доступ и настройки</span>
          <h3>Аккаунт</h3>
          <p>Данные, вход и приватность.</p>
        </article>
      </div>
    </section>
  );
}

function clampScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function scale10ToPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return clampScore(number * 10);
}

function formatProfileDate(value) {
  if (!value) return "первая точка";
  try {
    return new Date(value).toLocaleDateString("ru-RU");
  } catch {
    return "первая точка";
  }
}

function getProfileMetrics(firstIntakeResult) {
  if (!firstIntakeResult) return [];

  const baseline = firstIntakeResult.symptomBaseline || {};
  const answers = firstIntakeResult.answers?.baseline || {};
  const metrics = [
    {
      id: "resource",
      title: "Ресурс",
      value: scale10ToPercent(baseline.resourceLevel ?? answers.resourceLevel),
      firstValue: clampScore(firstIntakeResult.dynamics?.resource?.firstValue),
      currentValue: clampScore(firstIntakeResult.dynamics?.resource?.currentValue),
      interpretation: "Показывает, сколько опоры ощущается прямо сейчас.",
    },
    {
      id: "tension",
      title: "Напряжение",
      value: scale10ToPercent(baseline.problemStrength ?? answers.problemStrength),
      firstValue: clampScore(firstIntakeResult.dynamics?.tension?.firstValue),
      currentValue: clampScore(firstIntakeResult.dynamics?.tension?.currentValue),
      interpretation: "Помогает увидеть силу текущей нагрузки.",
    },
    {
      id: "support",
      title: "Опора",
      value: scale10ToPercent(baseline.supportLevel ?? answers.supportLevel),
      firstValue: clampScore(firstIntakeResult.dynamics?.support?.firstValue),
      currentValue: clampScore(firstIntakeResult.dynamics?.support?.currentValue),
      interpretation: "Отражает доступность внутренних и внешних поддержек.",
    },
  ].filter((item) => item.value !== null);

  return metrics;
}

function GaugeCard({ metric }) {
  const gaugeStyle = {
    "--gauge-value": `${metric.value}%`,
  };

  return (
    <article className="card profile-metric-card">
      <div className="profile-gauge" style={gaugeStyle} aria-label={`${metric.title}: ${metric.value} из 100`}>
        <strong>{metric.value}</strong>
        <span>/100</span>
      </div>
      <div>
        <span>{metric.title}</span>
        <p>{metric.interpretation}</p>
        <button className="text-link" type="button">Открыть детали</button>
      </div>
    </article>
  );
}

function ClientStateProfile({ firstIntakeResult, onStartSelfAnalysis }) {
  const metrics = getProfileMetrics(firstIntakeResult);

  return (
    <section className="compact-section-page profile-metrics-page" aria-labelledby="profile-state-title">
      <article className="card compact-route-hero profile-state-hero">
        <p className="eyebrow">Профиль</p>
        <h2 id="profile-state-title">Профиль состояния</h2>
        <p>Краткая карта по вашим тестам</p>
      </article>

      {metrics.length === 0 ? (
        <article className="card profile-empty-state">
          <h3>Пока нет данных по тестам</h3>
          <p>Первый ИИ-приём создаст мягкую исходную точку для показателей и будущей динамики.</p>
          <button className="primary-btn" type="button" onClick={onStartSelfAnalysis}>
            Пройти первый ИИ-приём
          </button>
        </article>
      ) : (
        <div className="profile-metrics-grid">
          {metrics.map((metric) => (
            <GaugeCard key={metric.id} metric={metric} />
          ))}
        </div>
      )}
    </section>
  );
}

function deltaLabel(firstValue, currentValue) {
  if (currentValue > firstValue) return "выросло";
  if (currentValue < firstValue) return "снизилось";
  return "без изменений";
}

function ProfileDynamicsPage({ firstIntakeResult, onRepeatIntake }) {
  const metrics = getProfileMetrics(firstIntakeResult);
  const completedDate = formatProfileDate(firstIntakeResult?.completedAt);
  const hasTwoPoints = metrics.some((metric) => metric.firstValue !== null && metric.currentValue !== null);

  return (
    <section className="compact-section-page profile-dynamics-page" aria-labelledby="profile-dynamics-title">
      <article className="card compact-route-hero profile-state-hero">
        <p className="eyebrow">Профиль</p>
        <h2 id="profile-dynamics-title">Динамика состояния</h2>
        <p>Сравнение первой точки и текущего среза по сохранённым тестам.</p>
      </article>

      {!firstIntakeResult || !hasTwoPoints ? (
        <article className="card profile-empty-state">
          <h3>Нужна повторная точка, чтобы увидеть динамику</h3>
          <p>
            Сейчас есть только первая точка{firstIntakeResult ? ` от ${completedDate}` : ""}. Повторная проверка
            покажет направление изменения без выдуманных значений.
          </p>
          <button className="primary-btn" type="button" onClick={onRepeatIntake}>
            Пройти повторную проверку
          </button>
        </article>
      ) : (
        <div className="profile-dynamics-grid">
          {metrics.filter((metric) => metric.firstValue !== null && metric.currentValue !== null).map((metric) => {
            const firstValue = metric.firstValue;
            const currentValue = metric.currentValue;
            return (
              <article className="card profile-dynamics-card" key={metric.id}>
                <span>{metric.title}</span>
                <div className="profile-dynamics-points">
                  <div>
                    <small>первая точка · {completedDate}</small>
                    <strong>{firstValue}</strong>
                  </div>
                  <div>
                    <small>сейчас</small>
                    <strong>{currentValue}</strong>
                  </div>
                </div>
                <p>{deltaLabel(firstValue, currentValue)}</p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function NextStepsPage({
  activeTab = pageTabs.recommendations[0],
  accessLevel = "basic",
  hasCompletedResults,
  onBookSession,
  onOpenReport,
  onRepeatAiIntake,
  onStartSelfAnalysis,
}) {
  const selectedTab = pageTabs.recommendations.includes(activeTab) ? activeTab : pageTabs.recommendations[0];
  const hasPersonalAccess = accessRank[accessLevel] >= accessRank.personal;
  const hasExpandedAccess = accessRank[accessLevel] >= accessRank.expanded;

  if (selectedTab === "Отчёты Мастера") {
    return (
      <section className="compact-section-page" aria-labelledby="master-reports-title">
        <article className="card compact-route-hero">
          <p className="eyebrow">Отчёты Мастера</p>
          <h2 id="master-reports-title">
            {hasPersonalAccess ? "Отчёты Мастера добавляются вручную" : "Для доступа перейти на Пакет Персональный"}
          </h2>
          <p>
            {hasPersonalAccess
              ? "В этом разделе будут только отчёты, которые специалист подготовил и передал вручную после проверки."
              : "Мастер-отчёты не генерируются автоматически. Доступ открывается с пакета «Личный», после работы со специалистом."}
          </p>
          <div className="compact-route-actions">
            <button className="primary-btn" type="button" onClick={onBookSession}>
              {hasPersonalAccess ? "Запросить отчёт у Мастера" : "Перейти на Пакет Персональный"}
            </button>
          </div>
        </article>
        <article className="card soft-card master-report-safety">
          <h3>Без автогенерации</h3>
          <p>
            Раздел не создаёт мастер-отчёты сам и не показывает фиктивно успешную покупку. После заявки формат
            подтверждается отдельно.
          </p>
        </article>
      </section>
    );
  }

  if (!hasCompletedResults) {
    return (
      <section className="compact-section-page" aria-labelledby="ai-reports-empty-title">
        <article className="card compact-route-hero">
          <p className="eyebrow">ИИ-отчёты</p>
          <h2 id="ai-reports-empty-title">ИИ-отчёты появятся после ИИ-приёма</h2>
          <p>
            Сначала нужен короткий ИИ-приём, чтобы карточки опирались на ответы, а не на пустой шаблон.
            Отчёты Мастера добавляются специалистом вручную отдельно.
          </p>
          <div className="compact-route-actions">
            <button className="primary-btn" type="button" onClick={onStartSelfAnalysis}>Пройти ИИ-приём</button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="compact-section-page" aria-labelledby="ai-reports-title">
      <article className="card compact-route-hero">
        <p className="eyebrow">ИИ-отчёты</p>
        <h2 id="ai-reports-title">Пять направлений ИИ-отчётов</h2>
        <p>
          Это предварительные рабочие программы поддержки, а не медицинское назначение. Финальная версия
          требует проверки и не заменяет работу со специалистом.
        </p>
        <div className="compact-route-actions">
          <button className="primary-btn" disabled={!hasExpandedAccess} type="button">
            {hasExpandedAccess ? "Открыть ИИ-отчёты" : "Доступно в расширенном формате 5€"}
          </button>
          <button className="secondary-btn" type="button" onClick={onOpenReport}>Открыть текущие отчёты</button>
          <button className="secondary-btn" type="button" onClick={onRepeatAiIntake}>Пройти повторную проверку</button>
        </div>
      </article>

      <div className="compact-archive-grid next-plan-grid">
        {aiReportCards.map((report) => (
          <article
            className={hasExpandedAccess ? "card compact-route-card" : "card compact-route-card soft-locked-card"}
            key={report.id}
          >
            <span>{hasExpandedAccess ? report.source : "Расширенный формат 5€"}</span>
            <h3>{report.title}</h3>
            <p>
              {hasExpandedAccess
                ? "Каркас отчёта доступен по сохранённым результатам. Подробные рекомендации требуют проверки."
                : "Карточка видна как направление, но полный ИИ-отчёт закрыт до расширенного формата."}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

const isDemoCabinetEnabled = import.meta.env.VITE_ENABLE_DEMO_CABINET === "true";

function userDisplayName(user) {
  return user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Клиент PsiTherapy";
}

function buildClientFromUser(user) {
  return {
    name: userDisplayName(user),
    email: user?.email || "",
    id: user?.id ? user.id.slice(0, 8).toUpperCase() : "CLIENT",
    focus: "первичный анализ ситуации",
    lastSlice: "ожидает первого приёма",
    nextSession: "вход через Google подтверждён",
  };
}

function CabinetLoadingScreen() {
  return (
    <main className="auth-page">
      <section className="auth-card card">
        <p className="eyebrow">PsiTherapy</p>
        <h1>Загружаю кабинет…</h1>
        <p className="subtitle">Проверяю Google-сессию и открываю структуру личного кабинета.</p>
      </section>
    </main>
  );
}

function CabinetAuthError({ error }) {
  return (
    <main className="auth-page">
      <section className="auth-card card">
        <p className="eyebrow">Ошибка входа</p>
        <h1>Google-сессия не загрузилась</h1>
        <p className="subtitle">{error}</p>
        <a className="primary-btn auth-inline-btn" href="/login">Попробовать снова</a>
      </section>
    </main>
  );
}

export function CabinetAuthGate({ initialPage = "self" } = {}) {
  const [authStatus, setAuthStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      if (!authEnv.isConfigured) {
        if (isMounted) setAuthStatus("signed-out");
        return;
      }

      try {
        const redirectUser = await exchangeOAuthCodeFromUrl();
        const currentUser = redirectUser || await getCurrentUser();
        if (!isMounted) return;

        if (!currentUser) {
          clearStoredSession();
          setAuthStatus("signed-out");
          return;
        }

        setUser(currentUser);
        setAuthStatus("signed-in");
      } catch (loadError) {
        clearStoredSession();
        if (!isMounted) return;
        setError(loadError?.message || "Не удалось загрузить пользователя.");
        setAuthStatus("error");
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const clientOverride = useMemo(() => buildClientFromUser(user), [user]);

  const handleSignOut = () => {
    signOut();
    window.location.assign("/login");
  };

  const signOutAction = (
    <button className="secondary-btn sidebar-logout" type="button" onClick={handleSignOut}>Выйти из кабинета</button>
  );

  if (authStatus === "loading") {
    return <CabinetLoadingScreen />;
  }

  if (authStatus === "signed-out") {
    return <LoginPage />;
  }

  if (authStatus === "error") {
    return <CabinetAuthError error={error} />;
  }

  return <ReportApp clientOverride={clientOverride} initialPage={initialPage} onSignOut={handleSignOut} userAction={signOutAction} />;
}

function RoutedApp() {
  const path = window.location.pathname;
  const query = new URLSearchParams(window.location.search);
  const requestedDemoMode = query.get("demo") === "1";
  const demoMode = isDemoCabinetEnabled && requestedDemoMode;

  if (path === "/") {
    return demoMode ? <ReportApp forceDemo /> : <CabinetAuthGate />;
  }

  if (path === "/login") {
    return <LoginPage />;
  }

  if (path === "/profile") {
    const explicitSettings = query.get("section") === "settings";
    const explicitProfile =
      query.get("section") === "profile" ||
      query.get("tab") === "profile-now" ||
      query.get("tab") === "profile";
    const initialPage = explicitSettings ? "settings" : explicitProfile ? "profile" : "self";
    return demoMode ? <ReportApp forceDemo initialPage={initialPage} /> : <CabinetAuthGate initialPage={initialPage} />;
  }

  if (path === "/demo") {
    return isDemoCabinetEnabled ? <ReportApp forceDemo /> : <LoginPage />;
  }

  return <LoginPage />;
}

export function ReportApp({ clientOverride = null, forceDemo = false, initialPage = "self", onSignOut = null, userAction = null }) {
  const [activePage, setActivePage] = useState(initialPage);
  const [selfAnalysisMode, setSelfAnalysisMode] = useState("overview");
  const [bookingNoticeVisible, setBookingNoticeVisible] = useState(false);
  const [firstIntakeResult, setFirstIntakeResult] = useState(() => readFirstIntakeResult());
  const [firstIntakeProgress, setFirstIntakeProgress] = useState(() => readFirstIntakeProgress());
  const [advancedAiResult, setAdvancedAiResult] = useState(() => readAdvancedAiAnalysisResult());
  const [advancedAnalysisMode, setAdvancedAnalysisMode] = useState("overview");
  const [activeAnalysisId, setActiveAnalysisId] = useState("general-state");
  const [activeTabs, setActiveTabs] = useState({
    overview: pageTabs.overview[0],
    expert: pageTabs.expert[0],
    recommendations: pageTabs.recommendations[0],
    self: selfAnalysis.tabs[0],
    advanced: "",
    history: pageTabs.history[0],
    consultations: "",
    profile: "",
  });
  const completedFromProgress =
    clientProgress.assessments.some((item) => item.status === "completed") ||
    clientProgress.reports.some((item) => item.status === "completed") ||
    clientProgress.results.some((item) => item.status === "completed");
  const hasCompletedResults =
    forceDemo ||
    Boolean(firstIntakeResult) ||
    completedFromProgress ||
    clientOverride?.hasCompletedFirstConsultation === true ||
    clientOverride?.hasCompletedResults === true;
  const currentAccessLevel = clientOverride?.accessLevel || (forceDemo ? "expanded" : "basic");

  const analysisGroups = useMemo(() => {
    const completedAt = firstIntakeResult?.completedAt
      ? new Date(firstIntakeResult.completedAt).toLocaleDateString("ru-RU")
      : null;
    const advancedCompletedAt = advancedAiResult?.completedAt
      ? new Date(advancedAiResult.completedAt).toLocaleDateString("ru-RU")
      : null;

    return analysisCatalog.map((group) => ({
      ...group,
      items: group.items.map((item) => {
        if (item.id === "general-state" && firstIntakeResult) {
          return {
            ...item,
            status: "single",
            first: { value: Number(firstIntakeResult.symptomBaseline?.resourceLevel) * 10 || item.first.value, date: completedAt },
            last: null,
            currentResult: "Первый самоанализ сохранён. Для динамики нужен повторный срез.",
          };
        }
        if (item.id === "advanced-1" && advancedAiResult) {
          return {
            ...item,
            title: advancedAiResult.programTitle || item.title,
            status: "single",
            first: { value: item.first.value, date: advancedCompletedAt },
            last: null,
            summary: advancedAiResult.hypothesis || item.summary,
            currentResult: advancedAiResult.title || item.currentResult,
          };
        }
        return item;
      }),
    }));
  }, [advancedAiResult, firstIntakeResult]);

  const selectedAnalysis = useMemo(
    () => analysisGroups.flatMap((group) => group.items).find((item) => item.id === activeAnalysisId) ||
      analysisGroups[1]?.items[0],
    [activeAnalysisId, analysisGroups]
  );

  const handleNavigation = (page, tab) => {
    const targetPage = page === "overview" ? "self" : page;

    if (targetPage === "settings") {
      setActivePage("settings");
      setBookingNoticeVisible(false);
      setSelfAnalysisMode("overview");
      return;
    }
    if (!hasCompletedResults && targetPage === "expert") {
      setActivePage("profile");
      setBookingNoticeVisible(false);
      return;
    }
    if (tab) {
      setActiveTabs((current) => ({ ...current, [targetPage]: tab }));
      setActivePage(targetPage);
      setBookingNoticeVisible(false);
      return;
    }
    setActivePage(targetPage);
    setBookingNoticeVisible(false);
    if (targetPage !== "self") {
      setSelfAnalysisMode("overview");
    }
    if (targetPage !== "advanced") {
      setAdvancedAnalysisMode("overview");
    }
  };

  const openFirstIntake = () => {
    setFirstIntakeProgress(readFirstIntakeProgress());
    setActivePage("self");
    setSelfAnalysisMode("form");
    setBookingNoticeVisible(false);
  };

  const handleSpecialistRequest = () => {
    setBookingNoticeVisible(true);
  };

  const openSettings = () => {
    setActivePage("settings");
    setBookingNoticeVisible(false);
    setSelfAnalysisMode("overview");
  };

  const handleSelectAnalysis = (analysisId) => {
    setActiveAnalysisId(analysisId);
    if (!["profile", "self"].includes(activePage)) {
      setActivePage("self");
    }
    setSelfAnalysisMode("overview");
    setBookingNoticeVisible(false);
  };

  const handleStartAnalysis = (analysisId) => {
    if (analysisId === "expert-consultation") {
      setActivePage("consultations");
      handleSpecialistRequest();
      return;
    }

    if (analysisId.startsWith("advanced")) {
      setActivePage("advanced");
      setAdvancedAnalysisMode("overview");
      setBookingNoticeVisible(false);
      return;
    }

    setActiveAnalysisId(analysisId);
    openFirstIntake();
  };

  const openResultReport = (tab) => {
    setActivePage("expert");
    setActiveTabs((current) => ({ ...current, expert: tab }));
  };

  const handleFirstIntakeComplete = (result) => {
    setFirstIntakeResult(result);
    setFirstIntakeProgress(readFirstIntakeProgress());
    setActivePage("self");
    setSelfAnalysisMode("overview");
    setActiveAnalysisId("general-state");
  };

  const handleFirstIntakeSaveAndExit = () => {
    setFirstIntakeProgress(readFirstIntakeProgress());
    setActivePage("self");
    setSelfAnalysisMode("overview");
  };

  const handleAdvancedAiSaveAndExit = () => {
    setActivePage("self");
    setAdvancedAnalysisMode("overview");
  };

  const handleAdvancedAiResultSaved = (result) => {
    setAdvancedAiResult(result);
    setActivePage("self");
    setAdvancedAnalysisMode("overview");
    setActiveAnalysisId("advanced-1");
  };

  const renderPage = () => {
    if (activePage === "settings") {
      const accountName = clientOverride?.name || "Клиент PsiTherapy";
      const accountEmail = clientOverride?.email || "Email не указан";
      const accountStatus = clientOverride?.nextSession || (forceDemo ? "демо-режим" : "вход через Google подтверждён");
      const accountId = clientOverride?.id ? `ID ${clientOverride.id}` : "ID демо-кабинета";

      return (
        <section className="settings-page" aria-labelledby="settings-title">
          <article className="card settings-card">
            <p className="eyebrow">Аккаунт</p>
            <h2 id="settings-title">Настройки</h2>
            <div className="settings-grid">
              <div>
                <span>Профиль</span>
                <strong>{accountName}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{accountEmail}</strong>
              </div>
              <div>
                <span>Статус входа</span>
                <strong>{accountStatus}</strong>
              </div>
              <div>
                <span>Сессия</span>
                <strong>{accountId}</strong>
              </div>
            </div>
            {userAction ? <div className="settings-actions">{userAction}</div> : null}
          </article>
          <article className="card settings-card format-settings-card">
            <p className="eyebrow">Форматы</p>
            <h2>Пакеты доступа</h2>
            <p className="settings-note">
              Выбор формата здесь не запускает оплату и не подтверждает покупку. Доступ меняется только после
              отдельного подтверждения.
            </p>
            <div className="format-card-grid">
              {packageFormats.map((format) => {
                const isCurrent = format.id === currentAccessLevel;
                return (
                  <section className={isCurrent ? "format-card active" : "format-card"} key={format.id}>
                    <div>
                      <span>{format.title}</span>
                      <strong>{format.price}</strong>
                    </div>
                    <p>{format.description}</p>
                    {format.details?.length ? (
                      <ul className="format-card-details">
                        {format.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    ) : null}
                    <button
                      className={isCurrent ? "secondary-btn" : "primary-btn"}
                      onClick={isCurrent ? undefined : handleSpecialistRequest}
                      type="button"
                    >
                      {isCurrent ? "Текущий формат" : "Запросить формат"}
                    </button>
                  </section>
                );
              })}
            </div>
            {bookingNoticeVisible && (
              <p className="placeholder-notice" role="status">
                Запрос сохранён как следующий шаг. Автоматическая оплата не запускается.
              </p>
            )}
            <p className="safety-note">
              Не заменяет медицинскую помощь. При серьёзных симптомах важно оставаться на связи с врачом.
            </p>
          </article>
        </section>
      );
    }
    if (activePage === "consultations") {
      return (
        <ConsultationPlaceholder
          bookingNoticeVisible={bookingNoticeVisible}
          hasCompletedResults={hasCompletedResults}
          onOpenAiIntake={() => handleNavigation("self")}
          onOpenReport={() => openResultReport(pageTabs.expert[0])}
          onSpecialistRequest={handleSpecialistRequest}
        />
      );
    }
    if (activePage === "profile") {
      return <ClientStateProfile firstIntakeResult={firstIntakeResult} onStartSelfAnalysis={openFirstIntake} />;
    }
    if (activePage === "self") {
      if (selfAnalysisMode !== "form") {
        return (
          <AiIntakeDashboard
            advancedAiResult={advancedAiResult}
            firstIntakeProgress={firstIntakeProgress}
            firstIntakeResult={firstIntakeResult}
            onOpenPersonalIntake={() => handleNavigation("consultations")}
            onStartAdvanced={() => handleNavigation("advanced")}
            onStartAnalysis={handleStartAnalysis}
            onStartBrief={openFirstIntake}
          />
        );
      }
      return (
        <SelfAnalysis
          activeAnalysis={selectedAnalysis}
          clientName={clientOverride?.name}
          mode={selfAnalysisMode === "form" ? "form" : "navigator"}
          onComplete={handleFirstIntakeComplete}
          onModeChange={setSelfAnalysisMode}
          onNavigate={handleNavigation}
          onSelectAnalysis={handleSelectAnalysis}
          onSaveAndExit={handleFirstIntakeSaveAndExit}
          onSpecialistRequest={handleSpecialistRequest}
          onStartAnalysis={handleStartAnalysis}
        />
      );
    }
    if (activePage === "advanced") {
      return (
        <AdvancedAiAnalysis
          onModeChange={setAdvancedAnalysisMode}
          onResultSaved={handleAdvancedAiResultSaved}
          onSaveAndExit={handleAdvancedAiSaveAndExit}
        />
      );
    }
    if (!hasCompletedResults && activePage === "expert") {
      return (
        <LockedReportState
          bookingNoticeVisible={bookingNoticeVisible}
          onSpecialistRequest={handleSpecialistRequest}
          onStartSelfAnalysis={openFirstIntake}
        />
      );
    }
    if (activePage === "expert") {
      return (
        <ExpertAnalysis
          activeTab={activeTabs.expert}
          advancedAiResult={advancedAiResult}
          clientOverride={clientOverride}
          firstIntakeResult={firstIntakeResult}
          onSelectReport={openResultReport}
          onStartSelfAnalysis={openFirstIntake}
        />
      );
    }
    if (activePage === "recommendations") {
      return (
        <NextStepsPage
          accessLevel={currentAccessLevel}
          activeTab={activeTabs.recommendations}
          hasCompletedResults={hasCompletedResults}
          onBookSession={() => handleNavigation("consultations")}
          onOpenReport={() => openResultReport(pageTabs.expert[0])}
          onRepeatAiIntake={() => handleNavigation("advanced")}
          onStartSelfAnalysis={openFirstIntake}
        />
      );
    }
    if (activePage === "history") {
      return <ProfileDynamicsPage firstIntakeResult={firstIntakeResult} onRepeatIntake={openFirstIntake} />;
    }
    return (
      <AiIntakeDashboard
        advancedAiResult={advancedAiResult}
        firstIntakeProgress={firstIntakeProgress}
        firstIntakeResult={firstIntakeResult}
        onOpenPersonalIntake={() => handleNavigation("consultations")}
        onStartAdvanced={() => handleNavigation("advanced")}
        onStartAnalysis={handleStartAnalysis}
        onStartBrief={openFirstIntake}
      />
    );
  };

  const isSelfAnalysisFocusMode = activePage === "self" && selfAnalysisMode === "form";
  const isAdvancedAnalysisFocusMode = activePage === "advanced" && advancedAnalysisMode === "form";

  return (
    <Layout
      activePage={activePage}
      activeAnalysisId={activeAnalysisId}
      activeTab={activeTabs[activePage]}
      analysisGroups={analysisGroups}
      clientOverride={clientOverride}
      focusMode={isSelfAnalysisFocusMode || isAdvancedAnalysisFocusMode}
      hasCompletedResults={hasCompletedResults}
      hideSpecialistPanel={["expert", "settings", "profile", "self", "consultations"].includes(activePage)}
      onPrimaryAction={!hasCompletedResults && ["overview", "expert"].includes(activePage) ? openFirstIntake : undefined}
      onOpenSettings={openSettings}
      onSelectAnalysis={handleSelectAnalysis}
      onSignOut={onSignOut}
      onStartAnalysis={handleStartAnalysis}
      onTabChange={handleNavigation}
      pageTabs={pageTabs[activePage]}
      userAction={userAction}
      workbookMode
    >
      {renderPage()}
    </Layout>
  );
}

export default RoutedApp;
