import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { dataSourceOptions } from './typeorm';
import { BaseEntity } from './base.entity';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
})
export class TypeOrmConfigModule {}
