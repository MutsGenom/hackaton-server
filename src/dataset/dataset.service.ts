import { Injectable } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import * as XLSX from 'xlsx';
import {
  parseFromYearStatistic,
  parserToFirstSection,
} from 'src/parsers/parser';

@Injectable()
export class DatasetService {
  constructor(private fileService: FilesService) {}

  async createDataset(file: any, extension: string) {
    const fileName = await this.fileService.createDataset(file, extension);
    return fileName;
  }

  async returnDataset(fileName: string, readAs?: string, page?: string) {
    const file = await this.fileService.returnFile(fileName);
    switch (readAs) {
      case 'xlsx':
        const wb = XLSX.read(file, { type: 'buffer' });
        const sheets = parserToFirstSection(wb, page);
        return sheets;
      case 'csv':
        const csv = XLSX.read(file, { type: 'buffer' });
        return csv;
      case 'yearsStat':
        const forYears = XLSX.read(file, { type: 'buffer' });
        const sheetsForYear = parseFromYearStatistic(forYears);
        return sheetsForYear;
      default:
        return file;
    }
  }
}
