import { singleton } from "tsyringe";
import { BaseService } from '../misc/base.service';
import { MUnitBlogPost, MUnitBlogPosts } from '../../models/blogs/unit-blog-post';

@singleton()
export class UnitBlogPostService extends BaseService {

  async getDataByTextbook(textbookid: number, unit: number): Promise<MUnitBlogPost | undefined> {
    const url = `${this.baseUrlAPI}UNITBLOGPOSTS?filter=TEXTBOOKID,eq,${textbookid}&filter=UNIT,eq,${unit}`;
    const result = await this.httpGet<MUnitBlogPosts>(url);
    return result.records[0];
  }

  private async create(item: MUnitBlogPost): Promise<number> {
    const url = `${this.baseUrlAPI}UNITBLOGPOSTS`;
    const payload: any = { ...item, ID: null };
    return await this.httpPost<number>(url, payload);
  }

  private async update(item: MUnitBlogPost): Promise<number> {
    const url = `${this.baseUrlAPI}UNITBLOGPOSTS/${item.ID}`;
    return await this.httpPut<number>(url, item);
  }

  async updatePost(textbookid: number, unit: number, content: string): Promise<void> {
    const existing = await this.getDataByTextbook(textbookid, unit);
    const item = existing ?? new MUnitBlogPost();
    if (!item.ID) {
      item.TEXTBOOKID = textbookid;
      item.UNIT = unit;
    }
    item.CONTENT = content;
    if (!item.ID)
      await this.create(item);
    else
      await this.update(item);
  }

  async delete(id: number): Promise<number> {
    const url = `${this.baseUrlAPI}UNITBLOGPOSTS/${id}`;
    return await this.httpDelete(url);
  }
}
