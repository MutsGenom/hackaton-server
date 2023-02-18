import { Module } from '@nestjs/common';
import { FilesModule } from 'src/files/files.module';
import { DobroController } from './dobro.controller';
import { DobroService } from './dobro.service';

@Module({
  controllers: [DobroController],
  providers: [DobroService],
  imports: [FilesModule],
})
export class DobroModule {}
