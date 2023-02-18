import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { log } from 'console';

@Injectable()
export class FilesService {
  async createFile(file: any): Promise<string> {
    try {
      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createDataset(file: any, extension: string): Promise<string> {
    try {
      const fileName = uuid.v4() + `.${extension}`;
      const filePath = path.resolve(__dirname, '..', 'static', 'datasets');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Произошла ошибка при записи датасета',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async returnFile(fileName: string) {
    try {
      const filePath = path.resolve(__dirname, '..', 'static', 'datasets');
      if (fs.existsSync(filePath + '\\' + fileName)) {
        return fs.readFileSync(filePath + '\\' + fileName);
      }
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Произошла ошибка при чтении файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
