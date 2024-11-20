import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../config/typeorm/base.entity';

@Entity({ name: 'fxql_entries' })
export class FXQLEntry extends BaseEntity {
  @Column({ name: 'source_currency', type: 'varchar' })
  sourceCurrency: string;

  @Column({ name: 'destination_currency', type: 'varchar' })
  destinationCurrency: string;

  @Column({ name: 'buy_price', type: 'float' })
  buyPrice: number;

  @Column({ name: 'sell_price', type: 'float' })
  sellPrice: number;

  @Column({ name: 'cap_amount', type: 'int' })
  capAmount: number;
}
