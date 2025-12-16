import { getResourceLinks } from "@/lib/resources";
import ContentList from "@/components/ContentList";

export default async function Resources() {
  const allResources = await getResourceLinks();

  const sortedResources = allResources.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <ContentList
      items={sortedResources}
      contentType="learn"
      title="Learn"
      description="Deep dive into search concepts, and learn how to build powerful search features in Postgres."
      showSection={true}
      showType={false}
    />
  );
}
