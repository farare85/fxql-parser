import { Module } from '@nestjs/common';
import { ExceptionsModule } from 'src/common/exceptions/exceptions.module';
import { ParserService } from './service/parser.service';
import { ParserController } from './controller/parser.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FXQLEntry } from './entity/fxql-entry.entity';
import { FXQLEntryRepository } from './repository/fxql-entry.repository';
import { LoggerModule } from 'src/common/logger/logger.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 20000,
        limit: 5,
      },
    ]),
    ExceptionsModule,
    TypeOrmModule.forFeature([FXQLEntry]),
    LoggerModule,
  ],
  providers: [
    ParserService,
    FXQLEntryRepository,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [ParserController],
})
export class ParserModule {}
