export type ExampleDirection = 'buy' | 'sell';

// Educational gross P/L only. No spread, fees, financing, leverage or currency conversion.
export function calculateMetalsExample(direction: ExampleDirection, units: number, entry: number, exit: number): number | null {
  if (![units, entry, exit].every(value => Number.isFinite(value) && value > 0 && value <= 1_000_000)) return null;
  return (exit - entry) * units * (direction === 'buy' ? 1 : -1);
}
