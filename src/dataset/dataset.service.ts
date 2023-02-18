import { Injectable } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import * as XLSX from 'xlsx';
import { log } from 'console';
import { parseToSectionV2, returnAllTitle } from '../parsers/parser';
import {
  parseFromYearStatistic,
  parserToFirstSection,
  returnAllRegions,
  setNullAsZero,
} from 'src/parsers/parser';

@Injectable()
export class DatasetService {
  constructor(private fileService: FilesService) {}

  async createDataset(file: any, extension: string) {
    const fileName = await this.fileService.createDataset(file, extension);
    console.log(String(fileName));

    return String(fileName);
  }

  async returnDataset(fileName: string, readAs?: string, page?: string) {
    const file = await this.fileService.returnFile(fileName);
    const wb = XLSX.read(file, { type: 'buffer' });
    switch (readAs) {
      case 'xlsx':
        const sheets = parseToSectionV2(wb, page);
        return sheets;
      case 'csv':
        return wb;
      case 'yearsStat':
        const sheetsForYear = parseFromYearStatistic(wb);
        return sheetsForYear;
      case 'regions':
        return returnAllRegions(wb, ['Р1']);
      case 'test':
        return setNullAsZero(wb, '1.2.2.');
      case 'title':
        return {
          titles: returnAllTitle(wb, [page]),
          content: await parseToSectionV2(wb, page),
        };
      default:
        return file;
    }
  }
}
