import { getResourcesBySection } from "@/lib/resources";
import ResourcesLayoutClient from "./layout-client";

export default async function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resourceSections = await getResourcesBySection();

  // If no resources, just render children without the layout sidebar
  if (resourceSections.length === 0) {
    return <div>{children}</div>;
  }

  return <ResourcesLayoutClient resourceSections={resourceSections}>{children}</ResourcesLayoutClient>;
}