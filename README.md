# ParadeDB Website

[![Slack URL](https://img.shields.io/badge/Join%20Slack-purple?logo=slack&link=https%3A%2F%2Fjoin.slack.com%2Ft%2Fparadedbcommunity%2Fshared_invite%2Fzt-32abtyjg4-yoYoi~RPh9MSW8tDbl0BQw)](https://join.slack.com/t/paradedbcommunity/shared_invite/zt-32abtyjg4-yoYoi~RPh9MSW8tDbl0BQw)
[![X URL](https://img.shields.io/twitter/url?url=https%3A%2F%2Ftwitter.com%2Fparadedb&label=Follow%20%40paradedb)](https://x.com/paradedb)

Official repository for the [ParadeDB website](https://www.paradedb.com), hosted on Vercel.

## Getting started

Install the dependencies. We recommend using pnpm. If you want to use `npm`, just replace `pnpm` with `npm`.

```bash
pnpm install
```

Then, start the development server:

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to view.

## Notes

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

Chart components use vendored utilities from [`Tremor Raw`](https://raw.tremor.so/docs/getting-started/installation) (in `src/lib/chartUtils.ts`) alongside [`@tremor/react`](https://www.tremor.so/) for bar charts.

## License

Apache-2.0 License - see [LICENSE](LICENSE) for details.
