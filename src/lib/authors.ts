import type { StaticImageData } from "next/image";
import {
  JamesHeadshot,
  PhilHeadshot,
  MingHeadshot,
  StuHeadshot,
  AnkitHeadshot,
} from "./blog-assets";

export interface Author {
  name: string;
  headshot: StaticImageData;
  bio?: string;
}

export const AUTHORS: Record<string, Author> = {
  "Ming Ying": {
    name: "Ming Ying",
    headshot: MingHeadshot,
  },
  "Philippe Noël": {
    name: "Philippe Noël",
    headshot: PhilHeadshot,
  },
  "James Blackwood-Sewell": {
    name: "James Blackwood-Sewell",
    headshot: JamesHeadshot,
  },
  "Stu Hood": {
    name: "Stu Hood",
    headshot: StuHeadshot,
  },
  "Ankit Mittal": {
    name: "Ankit Mittal",
    headshot: AnkitHeadshot,
  },
};
