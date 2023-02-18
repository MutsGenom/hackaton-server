import { Injectable } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class DobroService {
  constructor(private fileService: FilesService) {}
  async updateDate() {}
}
