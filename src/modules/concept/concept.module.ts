import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConceptService } from './concept.service';
import { ConceptController } from './concept.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ConceptController],
  providers: [ConceptService],
})
export class ConceptModule {}