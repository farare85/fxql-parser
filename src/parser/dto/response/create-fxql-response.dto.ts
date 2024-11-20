import { ApiProperty } from '@nestjs/swagger';
import { FXQLEntry } from 'src/parser/entity/fxql-entry.entity';

export class CreateFxqlResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the FX entry',
    example: 1,
    type: Number,
  })
  EntryId: string;

  @ApiProperty({
    description: 'Source currency code',
    example: 'USD',
    type: String,
    minLength: 3,
    maxLength: 3,
  })
  SourceCurrency: string;

  @ApiProperty({
    description: 'Destination currency code',
    example: 'GBP',
    type: String,
    minLength: 3,
    maxLength: 3,
  })
  DestinationCurrency: string;

  @ApiProperty({
    description: 'Selling price for the currency pair',
    example: 0.85,
    type: Number,
    minimum: 0,
  })
  SellPrice: number;

  @ApiProperty({
    description: 'Buying price for the currency pair',
    example: 0.9,
    type: Number,
    minimum: 0,
  })
  BuyPrice: number;

  @ApiProperty({
    description: 'Maximum transaction amount allowed',
    example: 10000,
    type: Number,
    minimum: 0,
  })
  CapAmount: number;
}

export const mapToCreateFxqlResponseDto = (
  entities: FXQLEntry[],
): CreateFxqlResponseDto[] => {
  return entities.map((entity) => ({
    EntryId: entity.id,
    SourceCurrency: entity.sourceCurrency,
    DestinationCurrency: entity.destinationCurrency,
    SellPrice: entity.sellPrice,
    BuyPrice: entity.buyPrice,
    CapAmount: entity.capAmount,
  }));
};
