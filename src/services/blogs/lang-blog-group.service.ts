import { singleton } from "tsyringe";
import { BaseService } from "../misc/base.service";
import { MLangBlogGroup, MLangBlogGroups } from "../../models/blogs/lang-blog-group";
import { MLangBlogGPs } from "../../models/blogs/lang-blog-gp";

@singleton()
export class LangBlogGroupService extends BaseService {

  async getDataByLang(langid: number, filter: string): Promise<MLangBlogGroup[]> {
    const url = `${this.baseUrlAPI}LANGBLOGGROUPS?filter=LANGID,eq,${langid}&filter=NAME,cs,${encodeURIComponent(filter)}&order=NAME`;
    const result = await this.httpGet<MLangBlogGroups>(url);
    return result.records;
  }

  async getDataByLangPost(langid: number, postid: number, filter: string): Promise<MLangBlogGroup[]> {
    const url = `${this.baseUrlAPI}VLANGBLOGGP?filter=LANGID,eq,${langid}&filter=POSTID,eq,${postid}&filter=NAME,cs,${encodeURIComponent(filter)}&order=GROUPNAME`;
    const result = await this.httpGet<MLangBlogGPs>(url);
    const list = result.records.map(o => {
      const g = new MLangBlogGroup();
      g.ID = o.GROUPID;
      g.LANGID = langid;
      g.NAME = o.GROUPNAME;
      g.GPID = o.ID;
      return g;
    });
    const unique = new Map<number, MLangBlogGroup>();
    list.forEach(item => unique.set(item.ID, item));
    return Array.from(unique.values());
  }

  async create(item: MLangBlogGroup): Promise<number> {
    const url = `${this.baseUrlAPI}LANGBLOGGROUPS`;
    const payload: any = { ...item, ID: null };
    return await this.httpPost<number>(url, payload);
  }

  async update(item: MLangBlogGroup): Promise<number> {
    const url = `${this.baseUrlAPI}LANGBLOGGROUPS/${item.ID}`;
    return await this.httpPut<number>(url, item);
  }

  async delete(id: number): Promise<number> {
    const url = `${this.baseUrlAPI}LANGBLOGGROUPS/${id}`;
    return await this.httpDelete(url);
  }
}
