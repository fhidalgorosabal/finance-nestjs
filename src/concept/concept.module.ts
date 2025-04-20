import { Module } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { ConceptController } from './concept.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConceptController],
  providers: [ConceptService],
})
export class ConceptModule {}