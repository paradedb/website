import { JamesHeadshot, PhilHeadshot, MingHeadshot, StuHeadshot } from "./blog-assets";

export interface Author {
  name: string;
  headshot: any;
  bio?: string;
}

export const AUTHORS: Record<string, Author> = {
  "Ming Ying": {
    name: "Ming Ying",
    headshot: MingHeadshot
  },
  "Philippe Noël": {
    name: "Philippe Noël", 
    headshot: PhilHeadshot
  },
  "James Blackwood-Sewell": {
    name: "James Blackwood-Sewell",
    headshot: JamesHeadshot
  },
  "Stu Hood": {
    name: "Stu Hood",
    headshot: StuHeadshot
  }
};