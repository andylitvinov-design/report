import React from "react";
import { expertBlocks } from "../data/mockData.js";
import "../results.css";

const clientHasFirstConsultation = true;

const reports = [
  {
    number: "01",
    type: "Самоотчёт",
    date: "04.06.2026",
    status: "Готов",
    summary: "Первичный самоанализ: текущая нагрузка, ресурс, Bach-темы и субъективная картина состояния.",
    accent: "Самоанализ",
  },
  {
    number: "02",
    type: "Диагностика эксперта",
    date: "14.05.2026",
    status: "На проверке",
    summary: "Сопоставление самооценки, повторяющихся тем и уровня ресурса перед финальной рекомендацией.",
    accent: "Эксперт",
  },
  {
    number: "03",
    type: "Повторный срез",
    date: "21.05.2026",
    status: "Черновик",
    summary: "Проверка динамики: что снизилось, что осталось активным и нужна ли корректировка поддержки.",
    accent: "Динамика",
  },
];

const reportDetails = {
  "Самоотчёт": {
    title: "Самоотчёт клиента",
    text:
      "Это слой первичных данных: как клиент сам описывает состояние, нагрузку, ресурс и повторяющиеся темы. Он не является финальным заключением, но задаёт основу для анализа.",
    items: ["Фокус: здоровье / тело", "Ресурс: 4/10", "Главная тема: Olive", "Повторяющиеся мысли: White Chestnut"],
  },
  "Диагностика эксперта": {
    title: "Диагностика эксперта",
    text:
      "Здесь специалист сверяет самоотчёт с повторяющимися темами, динамикой и возможным узким местом. Финальное решение принимается после проверки изменений во времени.",
    items: ["Основной узел: истощение", "Когнитивный слой: внутренний шум", "Bottleneck: ресурс ниже нагрузки", "Статус: требует проверки динамики"],
  },
  "Механизм": {
    title: "Механизм состояния",
    text:
      "Картина похожа на систему, где нагрузка продолжает расти, а восстановление откладывается. Поэтому поддержка должна сначала вернуть базовый ресурс, а не усиливать активность.",
    items: ["Нагрузка выше восстановления", "Мысли удерживают напряжение", "Тело просит паузу", "Главная задача: снизить расход"],
  },
  "У-Син": {
    title: "У-Син слой",
    text:
      "В этой версии У-Син используется как дополнительная карта ресурса. Она помогает увидеть, где система теряет опору и какой тип поддержки нужен первым.",
    items: ["Земля: перегруз и удержание", "Металл: необходимость завершения", "Вода: восстановление резерва", "Дерево: не форсировать движение"],
  },
  "Препараты": {
    title: "Препараты / поддержка",
    text:
      "Препараты здесь показаны как направление поддержки, а не как медицинское назначение. Любая формула требует наблюдения и повторной проверки состояния.",
    items: ["Olive — восстановление ресурса", "Elm — нагрузка ответственности", "White Chestnut — внутренний шум", "Срок проверки: 7-10 дней"],
  },
};

function EmptyFirstConsultation({ onStartSelfAnalysis }) {
  return (
    <article className="card results-empty-card">
      <span className="card-kicker">Новый клиент</span>
      <h2>Пройдите первую консультацию бесплатно (самоанализ)</h2>
      <p>
        После первичного самоанализа здесь появится перечень отчётов: самоотчёт, диагностика эксперта,
        повторные срезы и история изменений по датам.
      </p>
      <button className="primary-btn" onClick={onStartSelfAnalysis} type="button">
        Перейти в первый приём (Анализ)
      </button>
    </article>
  );
}

function ReportsMenu() {
  return (
    <article className="card results-menu-card">
      <div className="section-head">
        <div>
          <span className="card-kicker">Меню отчётов</span>
          <h2>История результатов</h2>
        </div>
        <span className="lab-badge">как медицинский анализ</span>
      </div>
      <div className="report-list">
        {reports.map((report) => (
          <button className="report-row" key={`${report.number}-${report.date}`} type="button">
            <span className="report-number">№ {report.number}</span>
            <span className="report-main">
              <strong>{report.type}</strong>
              <small>{report.summary}</small>
            </span>
            <span className="report-meta">
              <b>{report.date}</b>
              <small>{report.status}</small>
            </span>
          </button>
        ))}
      </div>
    </article>
  );
}

function ReportOverview() {
  return (
    <>
      <ReportsMenu />

      <article className="card lab-report-card">
        <div className="section-head">
          <div>
            <span className="card-kicker">Последний результат</span>
            <h2>Экспертная картина</h2>
          </div>
          <span className="lab-badge">14.05.2026</span>
        </div>
        <p>
          Анализ соединяет самооценку клиента, повторяющиеся Bach-темы и текущий уровень ресурса.
          Это рабочая версия интерпретации перед финальной рекомендацией.
        </p>
      </article>

      <div className="analysis-grid">
        {expertBlocks.map((block) => (
          <article className="card analysis-card" key={block.title}>
            <span>{block.title}</span>
            <h2>{block.remedy}</h2>
            <p>{block.text}</p>
          </article>
        ))}
      </div>
    </>
  );
}

function ReportDetail({ activeTab }) {
  const detail = reportDetails[activeTab] || reportDetails["Диагностика эксперта"];

  return (
    <article className="card lab-report-card">
      <div className="section-head">
        <div>
          <span className="card-kicker">Раздел отчёта</span>
          <h2>{detail.title}</h2>
        </div>
        <span className="lab-badge">{activeTab}</span>
      </div>
      <p>{detail.text}</p>
      <div className="lab-result-grid">
        {detail.items.map((item) => (
          <div className="lab-result-item" key={item}>
            <span>Показатель</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function ExpertAnalysis({ activeTab = "Меню отчётов", onStartSelfAnalysis }) {
  if (!clientHasFirstConsultation) {
    return <EmptyFirstConsultation onStartSelfAnalysis={onStartSelfAnalysis} />;
  }

  if (activeTab === "Меню отчётов") {
    return <ReportOverview />;
  }

  return <ReportDetail activeTab={activeTab} />;
}
