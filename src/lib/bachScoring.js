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
