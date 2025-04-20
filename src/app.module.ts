import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConceptModule } from './concept/concept.module';
import { CurrencyModule } from './currency/currency.module';
import { CompanyModule } from './company/company.module';
import { BankModule } from './bank/bank.module';
import { AccountModule } from './account/account.module';
import { ReceiptModule } from './receipt/receipt.module';

@Module({
  imports: [AuthModule, ConceptModule, CurrencyModule, CompanyModule, BankModule, AccountModule, ReceiptModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
