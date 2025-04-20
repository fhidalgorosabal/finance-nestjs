import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConceptModule } from './concept/concept.module';
import { CurrencyModule } from './currency/currency.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [AuthModule, ConceptModule, CurrencyModule, CompanyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
