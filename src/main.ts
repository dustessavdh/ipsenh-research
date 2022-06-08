import { readdirSync, readFileSync } from 'fs';
import { sizeof } from 'sizeof';
import { Benchmark } from './interfaces/benchmark.interface';
import { FastRleMethod } from './methods/fast-rle.method';
import { HuffmanMethod } from './methods/huffman.method';
import { LzMethod } from './methods/lz.method';
import { PerformanceService } from './services/performance.service';
import cliProgress from 'cli-progress';

import colors from 'ansi-colors';

const performanceService = PerformanceService.getInstance();
const testAmount = 1000;
const imageArray: Array<Record<string, any>> = [];
const methodArray: Array<Benchmark> = [];

function loadAllImages() {
  const files = readdirSync('./assets');
  files.forEach((file) => {
    if (file.endsWith('.png') || file.endsWith('.jpg')) {
      const filePath = `./assets/${file}`;
      const imageData = readFileSync(filePath).toString();
      imageArray.push({
        name: file,
        data: imageData,
        sizeof: sizeof(imageData),
      });
    }
  });
}

function loadAllMethods() {
  methodArray.push(new FastRleMethod(performanceService));
  methodArray.push(new HuffmanMethod(performanceService));
  methodArray.push(new LzMethod(performanceService));
}

loadAllImages();
loadAllMethods();

const totalAmountOfTests = testAmount * methodArray.length * imageArray.length;
const progressBar = new cliProgress.SingleBar({
  format:
    'Benchmark Progress |' +
    colors.cyan('{bar}') +
    '| {percentage}% |' +
    '| {value}/{total} Tests |' +
    '| Eta: {eta_formatted} |' +
    '| Duration: {duration_formatted} |' +
    '| Image: {image_name} |' +
    '| Method: {method_used}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
  etaBuffer: 100,
});

progressBar.start(totalAmountOfTests, 0, {
  image_name: '',
  method_used: '',
});
imageArray.forEach((image) => {
  for (let testNumber = 0; testNumber < testAmount; testNumber++) {
    methodArray.forEach((method) => {
      progressBar.increment(1, {
        image_name: image.name,
        method_used: method.methodUsed,
      });
      performanceService.saveToCsv(method.test(image));
    });
  }
});
progressBar.stop();
