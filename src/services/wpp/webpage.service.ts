import { BaseService } from '../misc/base.service';
import { MWebPage, MWebPages } from '../../models/wpp/webpage';
import { singleton } from "tsyringe";

@singleton()
export class WebpageService extends BaseService {

  async getDataById(id: number): Promise<MWebPage[]> {
    const url = `${this.baseUrlAPI}WEBPAGES?filter=ID,eq,${id}`;
    const result = await this.httpGet<MWebPages>(url);
    return result.records.map(value => Object.assign(new MWebPage(), value));
  }

  async getDataBySearch(t: string, u: string): Promise<MWebPage[]> {
    let filter = '';
    if (t)
      filter += `?filter=TITLE,cs,${encodeURIComponent(t)}`;
    if (u) {
      filter += filter ? '?' : '&';
      filter += `filter=URL,cs,${encodeURIComponent(u)}`;
    }
    const url = `${this.baseUrlAPI}WEBPAGES${filter}`;
    const result = await this.httpGet<MWebPages>(url);
    return result.records.map(value => Object.assign(new MWebPage(), value));
  }

  async create(item: MWebPage): Promise<number | any[]> {
    const url = `${this.baseUrlAPI}WEBPAGES`;
    (item as any).ID = null;
    return await this.httpPost<number | any[]>(url, item);
  }

  async update(item: MWebPage): Promise<number> {
    const url = `${this.baseUrlAPI}WEBPAGES/${item.ID}`;
    return await this.httpPut<number>(url, item);
  }

  async delete(id: number): Promise<number> {
    const url = `${this.baseUrlAPI}WEBPAGES/${id}`;
    return await this.httpDelete(url);
  }
}
