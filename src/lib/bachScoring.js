export function calculateBachScore({
  situation,
  character,
  control,
  crossSectionBonus = 0,
  peakBonus = 0,
  controlPresenceBonus = 0,
}) {
  const total =
    Number(situation) * 1 +
    Number(character) * 1 +
    Number(control) * 1.5 +
    Number(crossSectionBonus) +
    Number(peakBonus) +
    Number(controlPresenceBonus);

  return {
    total,
    displayValue: Math.round(total * 10) / 10,
  };
}

const sectionWeights = {
  situation: 1,
  character: 1,
  control: 1.5,
};

const sectionLabels = {
  situation: "ситуация",
  character: "характер",
  control: "контроль",
};

export function calculateRemedyResults({ questions, scores }) {
  const totalsByRemedy = questions.reduce((acc, question) => {
    const value = Number(scores[question.id] || 0);
    if (value <= 0) {
      return acc;
    }

    if (!acc[question.remedy]) {
      acc[question.remedy] = {
        remedy: question.remedy,
        themeScores: {},
        sections: new Set(),
        sectionScores: { situation: 0, character: 0, control: 0 },
        peakBonus: 0,
        controlPresenceBonus: 0,
        evidenceCount: 0,
      };
    }

    const remedy = acc[question.remedy];
    remedy.themeScores[question.theme] = (remedy.themeScores[question.theme] || 0) + value;
    remedy.sections.add(question.section);
    remedy.sectionScores[question.section] += value;
    remedy.evidenceCount += 1;

    if (value === 4) {
      remedy.peakBonus += 1;
    }
    if (value === 5) {
      remedy.peakBonus += 2;
    }
    if (question.section === "control") {
      remedy.controlPresenceBonus = 1.5;
    }

    return acc;
  }, {});

  const results = Object.values(totalsByRemedy)
    .map((item) => {
      const sectionCount = item.sections.size;
      const crossSectionBonus = sectionCount >= 3 ? 4 : sectionCount === 2 ? 2 : 0;
      const weightedScore = Object.entries(item.sectionScores).reduce(
        (sum, [section, score]) => sum + score * sectionWeights[section],
        0
      );
      const total = weightedScore + crossSectionBonus + item.peakBonus + item.controlPresenceBonus;
      const topTheme = Object.entries(item.themeScores).sort((a, b) => b[1] - a[1])[0]?.[0] || "тема требует уточнения";
      const sectionText = Array.from(item.sections).map((section) => sectionLabels[section]).join(", ");

      return {
        remedy: item.remedy,
        theme: topTheme,
        total: Math.round(total * 10) / 10,
        sections: Array.from(item.sections),
        evidenceCount: item.evidenceCount,
        explanation: `Отмечено в разделах: ${sectionText}. Ведущая тема: ${topTheme}.`,
        confirmation:
          sectionCount === 1
            ? "Узкая опора на один раздел: стоит сверить со специалистом."
            : "Предварительная гипотеза для экспертного подтверждения.",
      };
    })
    .sort((a, b) => b.total - a.total || b.evidenceCount - a.evidenceCount || a.remedy.localeCompare(b.remedy));

  const earlyResults = results.slice(0, 7);
  const narrowEvidence = earlyResults.filter((item) => item.sections.length === 1 || item.evidenceCount === 1);

  return {
    main: results.slice(0, 3),
    support: results.slice(3, 7),
    verify: results
      .slice(7)
      .filter((item) => item.total > 0)
      .concat(narrowEvidence)
      .filter((item, index, list) => list.findIndex((candidate) => candidate.remedy === item.remedy) === index)
      .slice(0, 6),
    totalsByRemedy: Object.fromEntries(results.map((item) => [item.remedy, item.total])),
  };
}
