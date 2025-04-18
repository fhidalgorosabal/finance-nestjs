import { Module } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { ConceptController } from './concept.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ConceptController],
  providers: [ConceptService, PrismaService],
})
export class ConceptModule {}