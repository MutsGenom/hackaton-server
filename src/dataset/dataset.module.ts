import { Module } from '@nestjs/common';
import { FilesModule } from 'src/files/files.module';
import { DatasetController } from './dataset.controller';
import { DatasetService } from './dataset.service';

@Module({
  controllers: [DatasetController],
  providers: [DatasetService],
  imports: [FilesModule],
})
export class DatasetModule {}
