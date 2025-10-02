export const company = {
  CAREERS:
    "https://www.notion.so/paradedb/ParadeDB-Job-Board-50b45af7a2834e22958b171ffa008e00",
};

export const documentation = {
  BASE: "https://docs.paradedb.com",
  SEARCH: "https://docs.paradedb.com/documentation/full-text/overview",
  ANALYTICS: "https://docs.paradedb.com/documentation/aggregates/overview/",
  REPLICATION:
    "https://docs.paradedb.com/deploy/self-hosted/logical-replication/getting-started",
  INGEST: "https://docs.paradedb.com/deploy/third-party-extensions",
  DOCKER: "https://docs.paradedb.com/deploy/self-hosted/docker",
  DEPLOY_EXTENSION: "https://docs.paradedb.com/deploy/self-hosted/extension",
  CHANGELOG: "https://docs.paradedb.com/changelog",
};

export const legal = {
  TERMS:
    "https://paradedb.notion.site/Terms-of-Use-d17c9916a5b746fab86c274feb35da75",
  PRIVACY:
    "https://paradedb.notion.site/Privacy-Policy-a7ce333c45c8478fb03250dff7e573b7?pvs=4",
};

export const github = {
  REPO: "https://github.com/paradedb/paradedb",
  API: "https://api.github.com/repos/paradedb/paradedb",
};

export const social = {
  TWITTER: "https://x.com/paradedb",
  LINKEDIN: "https://www.linkedin.com/company/paradedb",
  SLACK:
    "https://join.slack.com/t/paradedbcommunity/shared_invite/zt-32abtyjg4-yoYoi~RPh9MSW8tDbl0BQw",
  CALENDLY: "https://calendly.com/paradedb",
};

export const email = {
  HELLO: "mailto:hello@paradedb.com",
  SUPPORT: "mailto:support@paradedb.com",
  SALES: "mailto:sales@paradedb.com",
};

// This is dynamically generated at build time
export const blog: Array<{
  name: string;
  href: string;
  date: string;
  author: string;
  description: string;
  categories?: string[];
}> = [
  {
    "name": "Elasticsearch, PostgreSQL, and the ACID Test",
    "href": "elasticsearch-acid-test",
    "date": "2025-09-29T00:00:00.000Z",
    "author": "James Blackwood-Sewell",
    "description": "A developer's look at how Elasticsearch and Postgres stack up against the ACID test",
    "categories": [
      "elasticsearch",
      "oltp",
      "postgres"
    ]
  },
  {
    "name": "Elasticsearch Was Never a Database",
    "href": "elasticsearch-was-never-a-database",
    "date": "2025-09-18T00:00:00.000Z",
    "author": "James Blackwood-Sewell",
    "description": "Elasticsearch is a search engine, not a database. Here's why it falls short as a system of record.",
    "categories": [
      "elasticsearch",
      "oltp"
    ]
  },
  {
    "name": "Syncing with Postgres: Logical Replication vs. ETL",
    "href": "etl_vs_logical_replication",
    "date": "2025-08-08T00:00:00.000Z",
    "author": "Philippe Noël",
    "description": "Comparing ETL pipelines with PostgreSQL logical replication for data synchronization.",
    "categories": [
      "postgres",
      "etl",
      "replication"
    ]
  },
  {
    "name": "Bilt Reduces Postgres Query Timeouts by 95% with ParadeDB",
    "href": "case_study_bilt",
    "date": "2025-07-28T00:00:00.000Z",
    "author": "Ming Ying",
    "description": "How Bilt improved their Postgres performance with ParadeDB, reducing query timeouts by 95%.",
    "categories": [
      "case-study",
      "bilt",
      "performance"
    ]
  },
  {
    "name": "Announcing Our $12M Series A",
    "href": "series_a_announcement",
    "date": "2025-07-14T00:00:00.000Z",
    "author": "Ming Ying",
    "description": "Announcing our Series A funding round to accelerate ParadeDB development.",
    "categories": [
      "announcement",
      "funding"
    ]
  },
  {
    "name": "We Made Postgres Writes Faster, but it Broke Replication",
    "href": "lsm_trees_in_postgres",
    "date": "2025-06-30T00:00:00.000Z",
    "author": "Stu Hood, Ming Ying, Mathew Pregasen, Olive Ratliff",
    "description": "Exploring LSM tree implementation in PostgreSQL for better write performance.",
    "categories": [
      "postgres",
      "lsm-trees",
      "performance"
    ]
  },
  {
    "name": "A New Postgres Block Storage Layout for Full Text Search",
    "href": "block_storage_part_one",
    "date": "2025-01-16T00:00:00.000Z",
    "author": "Ming Ying",
    "description": "How we implemented a new block storage layout in Postgres for full text search performance.",
    "categories": [
      "postgres",
      "search",
      "performance"
    ]
  },
  {
    "name": "Alibaba Picks ParadeDB to Bring Full Text Search to its Postgres-Based Data Warehouse",
    "href": "case_study_alibaba",
    "date": "2024-09-24T00:00:00.000Z",
    "author": "Ming Ying",
    "description": "How Alibaba Cloud integrated ParadeDB for full text search in their Postgres-based data warehouse.",
    "categories": [
      "case-study",
      "alibaba",
      "data-warehouse"
    ]
  },
  {
    "name": "A Data-Driven Approach to Writing Better Developer Documentation",
    "href": "improving_documentation",
    "date": "2024-09-19T00:00:00.000Z",
    "author": "Ming Ying",
    "description": "How we improved our documentation to better serve the community.",
    "categories": [
      "documentation",
      "community"
    ]
  },
  {
    "name": "Similarity Search with SPLADE Inside Postgres",
    "href": "introducing_sparse",
    "date": "2024-09-05T00:00:00.000Z",
    "author": "Stu Hood",
    "description": "Introducing sparse vector support in ParadeDB for efficient vector search.",
    "categories": [
      "vectors",
      "search",
      "performance"
    ]
  },
  {
    "name": "INSA Strasbourg Powers New Research Database with ParadeDB",
    "href": "case_study_insa",
    "date": "2024-08-29T00:00:00.000Z",
    "author": "Ming Ying",
    "description": "How INSA replaced Elasticsearch with ParadeDB for better performance and simplicity.",
    "categories": [
      "case-study",
      "insa",
      "elasticsearch"
    ]
  },
  {
    "name": "We've Rebranded",
    "href": "rebrand",
    "date": "2024-08-28T00:00:00.000Z",
    "author": "Ming Ying",
    "description": "Announcing our rebrand and new visual identity for ParadeDB.",
    "categories": [
      "announcement",
      "brand"
    ]
  },
  {
    "name": "Why We Picked AGPL",
    "href": "agpl",
    "date": "2024-08-03T00:00:00.000Z",
    "author": "Philippe Noël",
    "description": "ParadeDB has been licensed under AGPL from day one. Here's our thought process and case study on why we picked AGPL.",
    "categories": [
      "open-source",
      "license",
      "agpl"
    ]
  },
  {
    "name": "Full Text Search over Postgres: Elasticsearch vs. Alternatives",
    "href": "elasticsearch_vs_postgres",
    "date": "2024-07-31T00:00:00.000Z",
    "author": "Ming Ying",
    "description": "A comprehensive comparison between Elasticsearch and PostgreSQL for search workloads.",
    "categories": [
      "elasticsearch",
      "postgres",
      "comparison"
    ]
  },
  {
    "name": "Sweetspot Unifies Hybrid Search on Postgres with ParadeDB",
    "href": "case_study_sweetspot",
    "date": "2024-06-09T00:00:00.000Z",
    "author": "Ming Ying",
    "description": "How SweetSpot leveraged ParadeDB for their search infrastructure.",
    "categories": [
      "case-study",
      "sweetspot"
    ]
  },
  {
    "name": "pg_search: Elastic-Quality Full Text Search Inside Postgres",
    "href": "introducing_search",
    "date": "2023-11-15T00:00:00.000Z",
    "author": "Ming Ying",
    "description": "Introducing the search capabilities of ParadeDB.",
    "categories": [
      "paradedb",
      "search",
      "announcement"
    ]
  },
  {
    "name": "Introducing ParadeDB",
    "href": "introducing_paradedb",
    "date": "2023-08-31T00:00:00.000Z",
    "author": "Ming Ying",
    "description": "We're excited to announce ParadeDB: a PostgreSQL database optimized for search.",
    "categories": [
      "paradedb",
      "postgres",
      "search"
    ]
  }
];