import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConceptModule } from './concept/concept.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [AuthModule, ConceptModule, CurrencyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
