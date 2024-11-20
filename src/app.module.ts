import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExceptionsModule } from './common/exceptions/exceptions.module';
import { LoggerModule } from './common/logger/logger.module';
import { EnvironmentConfigModule } from './config/environment-config/environment-config.module';
import { TypeOrmConfigModule } from './config/typeorm/typeorm.module';
import { ParserModule } from './parser/parser.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmConfigModule,
    LoggerModule,
    ExceptionsModule,
    EnvironmentConfigModule,
    ParserModule,
  ],
  providers: [],
})
export class AppModule {}
