import { SaleData, SalesRange } from "@/types";
import moment from "moment";

export const generateFeedsBasedOnRange = (
  range: SalesRange,
  sales: SaleData[]
): SaleData[] => {
  switch (range) {
    case "all":
      return sales;
    case "today":
      return sales.filter((s) =>
        moment(s.createdAt).isBetween(
          moment().startOf("day"),
          moment().endOf("day")
        )
      );
    case "wtd":
      return sales.filter((s) =>
        moment(s.createdAt).isBetween(
          moment().startOf("week"),
          moment().endOf("week")
        )
      );
    case "mtd":
      return sales.filter((s) =>
        moment(s.createdAt).isBetween(
          moment().startOf("month"),
          moment().endOf("month")
        )
      );
    case "ytd":
      return sales.filter((s) =>
        moment(s.createdAt).isBetween(
          moment().startOf("year"),
          moment().endOf("year")
        )
      );

    default:
      return sales;
  }
};

export const formatedData = (data: SaleData[]): SaleData[] => {
  const userNumberOfLines: { [userId: string]: number } = {};
  let d = {};

  // Iterate through the data array and calculate the sum of numberOfLines for each user.
  data.forEach((item) => {
    const userId = item.user.id;
    const numberOfLines = item.numberOfLines;
    d = { ...d, [userId]: numberOfLines };

    // If the user is not in the dictionary, initialize it with the numberOfLines.
    if (!userNumberOfLines[userId]) {
      userNumberOfLines[userId] = numberOfLines;
    } else {
      // If the user is already in the dictionary, add the numberOfLines to the existing value.
      userNumberOfLines[userId] += numberOfLines;
    }
  });

  // Create a new array with the original data and an additional 'totalNumberOfLines' field.
  const newData = data.map((item) => {
    const userId = item.user.id;
    const totalNumberOfLines = userNumberOfLines[userId];

    return {
      ...item,
      totalNumberOfLines,
    };
  });

  return newData;
};

export function salesData(data: SaleData[]): SaleData[] {
  const d: SaleData[] = [];
  data.forEach((item) => {
    const userId = item.user.id;
    const numberOfLines = item.numberOfLines;
    const index = d.findIndex((i) => i.user.id === userId);
    if (index === -1) {
      d.push({ ...item, numberOfLines: numberOfLines });
    } else {
      d[index].numberOfLines += numberOfLines;
    }
  });
  return d;
}
