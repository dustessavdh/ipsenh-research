export type BenchmarkDataType = {
  name: string;
  methodUsed: string;
  duration: number;
  averageCPULoad: number;
  oldSize: number;
  newSize: number;
  sizeDiff: string;
};
