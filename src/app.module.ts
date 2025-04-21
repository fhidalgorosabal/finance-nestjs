import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConceptModule } from './modules/concept/concept.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { CompanyModule } from './modules/company/company.module';
import { BankModule } from './modules/bank/bank.module';
import { AccountModule } from './modules/account/account.module';
import { ReceiptModule } from './modules/receipt/receipt.module';
import { SettingModule } from './modules/setting/setting.module';

@Module({
  imports: [
    AuthModule, 
    ConceptModule, 
    CurrencyModule, 
    CompanyModule, 
    BankModule, 
    AccountModule, 
    ReceiptModule, 
    SettingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
