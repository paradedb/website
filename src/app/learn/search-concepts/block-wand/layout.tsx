import {
  ContentLayout,
  createContentMetadataGenerator,
} from "@/lib/content-layout";

export const generateMetadata = createContentMetadataGenerator(__dirname);

export default ContentLayout;
