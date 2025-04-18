import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConceptModule } from './concept/concept.module';

@Module({
  imports: [AuthModule, ConceptModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
