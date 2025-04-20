import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConceptModule } from './concept/concept.module';
import { CurrencyModule } from './currency/currency.module';
import { CompanyModule } from './company/company.module';
import { BankModule } from './bank/bank.module';

@Module({
  imports: [AuthModule, ConceptModule, CurrencyModule, CompanyModule, BankModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
