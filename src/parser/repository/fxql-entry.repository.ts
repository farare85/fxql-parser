import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FXQLEntry } from '../entity/fxql-entry.entity';
import { ParsedFXQL } from '../util/processor';

export class FXQLEntryRepository extends Repository<FXQLEntry> {
  constructor(
    @InjectRepository(FXQLEntry)
    private fxqlEntryRepository: Repository<FXQLEntry>,
  ) {
    super(
      fxqlEntryRepository.target,
      fxqlEntryRepository.manager,
      fxqlEntryRepository.queryRunner,
    );
  }

  async store(entries: ParsedFXQL[]): Promise<FXQLEntry[]> {
    const fxqlEntries = entries.map((entry) => {
      const fxqlEntry = new FXQLEntry();
      fxqlEntry.sourceCurrency = entry.SourceCurrency;
      fxqlEntry.destinationCurrency = entry.DestinationCurrency;
      fxqlEntry.buyPrice = entry.BuyPrice;
      fxqlEntry.sellPrice = entry.SellPrice;
      fxqlEntry.capAmount = entry.CapAmount;
      return fxqlEntry;
    });

    return await this.fxqlEntryRepository.save(fxqlEntries);
  }
}
