import { injectable } from 'inversify';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MUSMapping, MUSMappings } from '../../models/misc/usmapping';

@injectable()
export class UsMappingService extends BaseService {

  async getData(): Promise<MUSMapping[]> {
    const url = `${this.baseUrlAPI}USMAPPINGS`;
    const result = await this.httpGet<MUSMappings>(url);
    return result.records.map(value => Object.assign(new MUSMapping(), value));
  }
}
