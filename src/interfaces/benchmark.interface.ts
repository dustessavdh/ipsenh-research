import { PerformanceService } from 'src/services/performance.service';
import { BenchmarkDataType } from 'src/types/benchmark-data.type';

export interface Benchmark {
  methodUsed: string;
  performanceService: PerformanceService;

  test(image: Record<string, any>): BenchmarkDataType;
}
