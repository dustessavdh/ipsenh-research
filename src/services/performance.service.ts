import { appendFile, appendFileSync, existsSync, writeFileSync } from 'fs';
import os from 'os';
import { BenchmarkDataType } from 'src/types/benchmark-data.type';

export class PerformanceService {
  private static instance: PerformanceService;
  public static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  private constructor(
    private readonly csvToSaveTo = process.env.CSV_FILE ?? './data/results.csv',
  ) {
    if (!existsSync(csvToSaveTo)) {
      writeFileSync(
        csvToSaveTo,
        'name,methodUsed,duration,averageCPULoad,oldSize,newSize,sizeDiff\n',
      );
    }
  }

  public saveToCsv(data: BenchmarkDataType) {
    appendFileSync(this.csvToSaveTo, this.buildCsvDataString(data));
  }

  private buildCsvDataString(data: BenchmarkDataType, separator = ','): string {
    return (
      data.name +
      separator +
      data.methodUsed +
      separator +
      data.duration +
      separator +
      data.averageCPULoad +
      separator +
      data.oldSize +
      separator +
      data.newSize +
      separator +
      data.sizeDiff +
      '\n'
    );
  }

  private startCPULoad: os.CpuInfo[] = os.cpus();

  public startAverageCPULoadMeasurement(): void {
    this.startCPULoad = os.cpus();
  }

  public getAverageCPULoad(): number {
    const startCPULoad = this.startCPULoad;
    const totals = os.cpus().reduce(
      function (totals, end, i) {
        const busy =
          end.times.user +
          end.times.sys -
          startCPULoad[i].times.user -
          startCPULoad[i].times.sys;
        totals.total += busy + end.times.idle - startCPULoad[i].times.idle;
        totals.busy += busy;
        return totals;
      },
      { busy: 0, total: 0 },
    );

    const averageCPULoad = (totals.busy / totals.total) * 100;
    return averageCPULoad === averageCPULoad ? averageCPULoad : 0;
  }
}
