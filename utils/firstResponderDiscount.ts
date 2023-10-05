export const firstResponderDiscount = (
  totalLines: number,
  isFirstResponder: boolean
) => {
  switch (true) {
    case isFirstResponder && totalLines === 0:
      return 0;
    case isFirstResponder && totalLines === 1:
      return 10;
    case isFirstResponder && totalLines >= 2 && totalLines <= 3:
      return 25;
    case totalLines >= 4 && isFirstResponder:
      return 20;
    default:
      return 0;
  }
};
