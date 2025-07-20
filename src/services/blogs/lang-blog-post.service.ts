import { singleton } from "tsyringe";
import { BaseService } from "../misc/base.service";
import { MLangBlogPost, MLangBlogPosts } from '../../models/blogs/lang-blog-post';
import { MLangBlogGPs } from '../../models/blogs/lang-blog-gp';

@singleton()
export class LangBlogPostService extends BaseService {

  async getDataByLang(langid: number, filter: string): Promise<MLangBlogPost[]> {
    const url = `${this.baseUrlAPI}LANGBLOGPOSTS?filter=LANGID,eq,${langid}&filter=TITLE,cs,${encodeURIComponent(filter)}&order=TITLE`;
    const result = await this.httpGet<MLangBlogPosts>(url);
    return result.records;
  }

  async getDataByLangGroup(langid: number, groupid: number, filter: string): Promise<MLangBlogPost[]> {
    const url = `${this.baseUrlAPI}VLANGBLOGGP?filter=LANGID,eq,${langid}&filter=GROUPID,eq,${groupid}&filter=TITLE,cs,${encodeURIComponent(filter)}&order=TITLE`;
    const result = await this.httpGet<MLangBlogGPs>(url);
    const list = result.records.map(o => {
      const g = new MLangBlogPost();
      g.ID = o.POSTID;
      g.LANGID = langid;
      g.TITLE = o.TITLE;
      g.GPID = o.ID;
      return g;
    });
    const unique = new Map<number, MLangBlogPost>();
    list.forEach(item => unique.set(item.ID, item));
    return Array.from(unique.values());
  }

  private async create(item: MLangBlogPost): Promise<number> {
    const url = `${this.baseUrlAPI}LANGBLOGPOSTS`;
    const payload: any = { ...item, ID: null };
    return await this.httpPost<number>(url, payload);
  }

  private async update(item: MLangBlogPost): Promise<number> {
    const url = `${this.baseUrlAPI}LANGBLOGPOSTS/${item.ID}`;
    return await this.httpPut<number>(url, item);
  }

  async updatePost(item: MLangBlogPost): Promise<number> {
    if (!item.ID)
      return await this.create(item);
    else
      return await this.update(item);
  }

  async delete(id: number): Promise<number> {
    const url = `${this.baseUrlAPI}LANGBLOGPOSTS/${id}`;
    return await this.httpDelete(url);
  }
}
