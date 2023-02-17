import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DatasetService } from './dataset.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDataset } from './dto/create-dataset.dto';

@Controller('dataset')
export class DatasetController {
  constructor(private datasetService: DatasetService) {}
  @Post()
  @UseInterceptors(FileInterceptor('dataset'))
  createDataset(@Body() dto: CreateDataset, @UploadedFile() dataset) {
    return this.datasetService.createDataset(dataset, dto.extension);
  }

  @Get('/:fileName')
  getByFileName(@Param('fileName') fileName: string) {
    return this.datasetService.returnDataset(fileName);
  }
  @Get('/:fileName/:readAs')
  getByFileNameWithFlag(
    @Param('fileName') fileName: string,
    @Param('readAs') readAs: string,
  ) {
    return this.datasetService.returnDataset(fileName, readAs);
  }
}
