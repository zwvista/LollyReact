import { singleton } from "tsyringe";
import { BaseService } from "../misc/base.service";
import { MLangBlogPostContent, MLangBlogsContent } from "../../models/blogs/lang-blog-post-content";

@singleton()
export class LangBlogPostContentService extends BaseService {

  async getDataById(id: number): Promise<MLangBlogPostContent | undefined> {
    const url = `${this.baseUrlAPI}LANGBLOGPOSTS?filter=ID,eq,${id}`;
    const result = await this.httpGet<MLangBlogsContent>(url);
    return result.records[0];
  }

  async update(item: MLangBlogPostContent): Promise<number> {
    const url = `${this.baseUrlAPI}LANGBLOGPOSTS/${item.ID}`;
    return await this.httpPut<number>(url, item);
  }
}
