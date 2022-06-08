import { Benchmark } from 'src/interfaces/benchmark.interface';
import { PerformanceService } from 'src/services/performance.service';
import encode from 'fast-rle/decode';
import { performance } from 'perf_hooks';
import { sizeof } from 'sizeof';
import { BenchmarkDataType } from 'src/types/benchmark-data.type';

export class FastRleMethod implements Benchmark {
  methodUsed = 'fast-rle';

  constructor(public performanceService: PerformanceService) {}

  test(image: Record<string, any>): BenchmarkDataType {
    const startTime = performance.now();

    this.performanceService.startAverageCPULoadMeasurement();

    // Encoding
    const encoded = encode(image.data);

    const endTime = performance.now();
    const averageCPULoad = this.performanceService.getAverageCPULoad();

    return {
      name: image.name,
      oldSize: sizeof(image.data),
      newSize: sizeof(encoded),
      methodUsed: this.methodUsed,
      sizeDiff: `${
        ((sizeof(image.data) - sizeof(encoded)) / sizeof(image.data)) * 100
      }%`,
      duration: endTime - startTime,
      averageCPULoad,
    };
  }
}
