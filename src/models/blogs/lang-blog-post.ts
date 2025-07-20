export interface MLangBlogPosts {
  records: MLangBlogPost[];
}
export class MLangBlogPost {
  ID = 0;
  LANGID = 0;
  TITLE = "";
  URL = "";
  GPID?: number;
}
