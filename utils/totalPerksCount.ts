import { Line } from "@/types";

export const totalPerksCount = (lines: Line[], line?: Line) => {
  if (line) {
    return line.perks
      .map((perk) => (perk.selected ? { count: 1 } : { count: 0 }))

      .flat()
      .reduce((acc, perks) => acc + perks.count, 0);
  }

  return lines
    .map((line) =>
      line.perks.map((perk) => (perk.selected ? { count: 1 } : { count: 0 }))
    )
    .flat()
    .reduce((acc, perks) => acc + perks.count, 0);
};
