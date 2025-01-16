export const company = {
  CAREERS:
    "https://www.notion.so/paradedb/ParadeDB-Job-Board-50b45af7a2834e22958b171ffa008e00",
}

export const documentation = {
  BASE: "https://docs.paradedb.com",
  SEARCH: "https://docs.paradedb.com/documentation/full-text/overview",
  ANALYTICS: "https://docs.paradedb.com/documentation/faceting/overview",
  REPLICATION: "https://docs.paradedb.com/deploy/replication",
  INGEST: "https://docs.paradedb.com/integrations/overview",
  DOCKER: "https://docs.paradedb.com/deploy/self-hosted/docker",
  DEPLOY_EXTENSION: "https://docs.paradedb.com/deploy/self-hosted/extensions",
  CHANGELOG: "https://docs.paradedb.com/changelog",
}

export const legal = {
  TERMS:
    "https://paradedb.notion.site/Terms-of-Use-d17c9916a5b746fab86c274feb35da75",
  PRIVACY:
    "https://paradedb.notion.site/Privacy-Policy-a7ce333c45c8478fb03250dff7e573b7?pvs=4",
}

export const github = {
  REPO: "https://github.com/paradedb/paradedb",
  API: "https://api.github.com/repos/paradedb/paradedb",
}

export const social = {
  TWITTER: "https://x.com/paradedb",
  LINKEDIN: "https://www.linkedin.com/company/paradedb",
  SLACK:
    "https://join.slack.com/t/paradedbcommunity/shared_invite/zt-2lkzdsetw-OiIgbyFeiibd1DG~6wFgTQ",
  CALENDLY: "https://calendly.com/paradedb",
}

export const email = {
  HELLO: "mailto:hello@paradedb.com",
  SUPPORT: "mailto:support@paradedb.com",
  SALES: "mailto:sales@paradedb.com",
}

export const blog = [
  {
    name: "A New Postgres Block Storage Layout for Full Text Search",
    href: "block_storage_part_one",
    date: "2025-01-06T12:00:00.000Z",
    author: "Ming Ying",
    description:
      "The architecture and data access patterns of ParadeDB's new block storage layout",
    categories: ["postgres", "block storage"],
  },
  {
    name: "Case Study: Alibaba Picks ParadeDB to Bring Full Text Search to its Postgres-Based Data Warehouse",
    href: "case_study_alibaba",
    date: "2024-09-24T12:00:00.000Z",
    author: "Ming Ying",
    description:
      "A case study on why Alibaba picked ParadeDB to bring full text search to its data warehouse",
    categories: ["case study"],
  },
  {
    name: "A Data-Driven Approach to Writing Better Developer Documentation",
    href: "improving_documentation",
    date: "2024-09-18T12:00:00.000Z",
    author: "Ming Ying",
    description:
      "The most impactful changes ParadeDB has made over the last year to its developer documentation.",
    categories: ["documentation", "developer experience"],
  },
  {
    name: "Case Study: INSA Strasbourg Powers New Research Database with ParadeDB",
    href: "case_study_insa",
    date: "2024-08-29T12:00:00.000Z",
    author: "Ming Ying",
    description:
      "A case study on how INSA Strasbourg used ParadeDB to build its new document retrieval system.",
    categories: ["case study"],
  },
  {
    name: "We've Rebranded",
    href: "rebrand",
    date: "2024-08-28T12:00:00.000Z",
    author: "Ming Ying",
    description: "Announcing ParadeDB's new logo and design refresh.",
    categories: ["announcement"],
  },
  {
    name: "Why We Picked AGPL",
    href: "agpl",
    date: "2024-08-03T12:00:00.000Z",
    author: "Philippe Noël",
    description: "A case study on why ParadeDB chose to license under AGPL.",
    categories: ["open source", "licensing"],
  },
  {
    name: "Full Text Search over Postgres: Elasticsearch vs. Alternatives",
    href: "elasticsearch_vs_postgres",
    date: "2024-07-31T12:00:00.000Z",
    author: "Ming Ying",
    description: "Evaluating Elasticsearch against native Postgres FTS",
    categories: ["elasticsearch", "postgres", "full text search", "data infra"],
  },
  {
    name: "Querying Apache Iceberg from Postgres",
    href: "iceberg_lakehouse",
    date: "2024-06-24T12:00:00.000Z",
    author: "Ming Ying",
    description: "ParadeDB now has the ability to query Apache Iceberg tables",
    categories: ["iceberg", "analytics", "postgres", "olap", "duckdb"],
  },
  {
    name: "Case Study: Sweetspot Unifies Hybrid Search on Postgres with ParadeDB",
    href: "case_study_sweetspot",
    date: "2024-06-09T12:00:00.000Z",
    author: "Ming Ying",
    description:
      "A case study on how Sweetspot simplified its data stack with ParadeDB",
    categories: ["case study"],
  },
  {
    name: "Building a DuckDB Alternative in Postgres",
    href: "introducing_lakehouse",
    date: "2024-05-24T12:00:00.000Z",
    author: "Ming Ying",
    description:
      "Introducing a new extension for fast analytical queries over data lakes inside Postgres",
    categories: ["analytics", "postgres", "olap", "duckdb"],
  },
  {
    name: "Similarity Search with SPLADE Inside Postgres",
    href: "introducing_sparse",
    date: "2023-11-12T12:00:00.000Z",
    author: "Ming Ying",
    description:
      "Introducing pg_sparse, a Postgres extension for sparse vector search",
    categories: ["vector search", "sparse vectors"],
  },
  {
    name: "pg_search: Elastic-Quality Full Text Search Inside Postgres",
    href: "introducing_search",
    date: "2023-10-01T12:00:00.000Z",
    author: "Ming Ying",
    description:
      "Introducing pg_search, a Postgres extension for full text search",
    categories: ["full text search", "postgres", "bm25"],
  },
  {
    name: "Introducing ParadeDB",
    href: "introducing_paradedb",
    date: "2023-10-01T12:00:00.000Z",
    author: "Ming Ying",
    description: "Announcing the launch of ParadeDB",
    categories: ["announcement"],
  },
]
