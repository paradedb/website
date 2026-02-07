import type { MDXComponents } from "mdx/types";

import {
  Bold,
  ChangelogEntry,
  CustomLink,
  H1,
  H2,
  H3,
  P,
  Ul,
} from "@/components/mdx";

import { ChangelogImage } from "@/components/mdx";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { LineChartCard } from "@/components/charts/LineChartCard";

const customComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  Bold: Bold,
  ul: Ul,
  a: CustomLink,
  ChangelogEntry: ChangelogEntry,
  ChangelogImage: ChangelogImage,
  BarChartCard: BarChartCard,
  LineChartCard: LineChartCard,
};

export function useMDXComponents(components: MDXComponents) {
  return {
    ...customComponents,
    ...components,
  };
}
