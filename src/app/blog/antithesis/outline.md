## Context

The goal here is to write a deeply technical blog post that will help with recruiting and asserting technical authority and seriousness. I think something like this could do very well for our brand and go on HackerNews.

Here’s a reference: https://antithesis.com/blog/2026/tigris_report/

It would be good to get Antithesis involved once we have a rough draft, as co-authoring it and cross-posting on their website would help improve our SEO and our reach.

## Outline

### Option A

- What is ParadeDB
    - Discuss what ParadeDB does. I think discussing how we have a “distributed system inside a single node” because Postgres is process-based, and the whole parallel worker machinery would be very interesting
    - Example: https://antithesis.com/blog/2026/tigris_report/#introduction-global-consistency-under-chaos
- ParadeDB’s guarantees
    - Here we can outline that ParadeDB aims to be “just Postgres”, e.g. behaviour should be identical to Postgres on correctness
    - We could also outline that, because we are an extension, we must work with any Postgres distro (e.g., Neon, CNPG, etc.).
    - This could be useful: https://docs.paradedb.com/welcome/guarantees
    - Example: https://antithesis.com/blog/2026/tigris_report/#tigris-system-guarantees
- Testing at ParadeDB
    - Here we should outline all of the testing we did before adding Antithesis
        - Unit tests
        - Integration tests
        - `pg_regress` tests (worth explaining what they are)
        - proptests
        - Load tests (with Stressgres, which could use a brief explanation)
        - We also have a super complex end-to-end Terraform test that spins up a cluster, feeds it with data normally and via logical replication, then upgrades it and ensures queries continue to be served throughout the upgrade process:
            - https://github.com/paradedb/terraform-paradedb-byoc/blob/dev/.github/workflows/tests-reusable-infrastructure-e2e-test.yml
            - Stressgres and this let us test both physical and logical replication under stress and under failover
    - Example: https://antithesis.com/blog/2026/tigris_report/#testing-at-tigris
- Antithesis at ParadeDB
    - We realized that we essentially are a distributed system, and thought that many of the properties they test could help us
    - The main tests we wanted to cover were race conditions between processes trying to access data (for example, on the FSM — the root cause of us looking into Antithesis was a race in the FSM, which caused a data corruption error on a live production cluster)
        - https://paradedb.slack.com/archives/C0A1CNHHBRQ/p1767995941049099
        - https://paradedb.slack.com/archives/C0A1CNHHBRQ/p1765383865954429
- ParadeDB’s Antithesis setup
    - We have two Antithesis setups
        - This is how we wire it up to CI: https://github.com/paradedb/paradedb/blob/main/.github/workflows/antithesis-trigger-test-run.yml
        - We can trigger it on PRs and it runs nightly twice a week for 8 hours
    - First one: Stressgres/load test
        - We use the ParadeDB Kubernetes harness to deploy our Helm charts built on CloudNativePG. This deploys a K8s cluster with the CNPG operator and 3 ParadeDB pods (one primary, two replicas)
        - We also deploy two other containers:
            - logical-replication-publisher — This is a vanilla postgres pod that publishes changes over LR to the ParadeDB primary
            - Stressgres — our load testing workload. It does three things
                - It writes to the logical replication publisher, which then propagates the changes to ParadeDB
                - It reads and writes to the ParadeDB primary directly
                - It reads from the ParadeDB replicas directly
            - If you go here under “Cluster Status”, you can find an example cluster config
                - https://paradedb.antithesis.com/report/IGmGhwJsT2XqpVmVe6NHcz3H/aujp6rxtITHhV8xS-iJ1qNoPlNCfXu4IPIr7yovVcwI.html?auth=v2.public.eyJuYmYiOiIyMDI2LTA2LTA0VDEwOjQ2OjQ5LjMyNjU5NDE1MVoiLCJzY29wZSI6eyJSZXBvcnRTY29wZVYxIjp7ImFzc2V0IjoiYXVqcDZyeHRJVEhoVjh4Uy1pSjFxTm9QbE5DZlh1NElQSXI3eW92VmN3SS5odG1sIiwicmVwb3J0X2lkIjoiSUdtR2h3SnNUMlhxcFZtVmU2TkhjejNIIn19fQZY1pNfTfBcMEZ6FsypGfmglMjjC5TSm9M_t5_RPSkFyfD9WNxq8_JQa8P89PRHc-Qw0r9D6b2DRyCXyF4U3gs
                - You can also see the manifests deployed here: https://github.com/paradedb/paradedb-enterprise/tree/315f3883651ef2d608336cbed17d9546ba6dca0d/docker/manifests
            - Stressgres runs customer-representative “SQL workloads” defined in TOML. We could link some examples:
                - https://github.com/paradedb/paradedb/blob/main/stressgres/suites/bulk-updates.toml
                - https://github.com/paradedb/paradedb/blob/main/stressgres/suites/antithesis/singleton_driver_bulk-updates.sh
        - This whole setup uses the Antithesis singleton driver tests
    - Second one: proptests
        - We deploy just the ParadeDB cluster (no stressgres/logical replication) and a separate container `proptests-runner` to run our proptests inside Antithesis to benefit from the fault injection
            - @Stu Hood can add a bit more context around the faults we are interested in
                - You can see the ones we have enabled here under “Fault Configuration”
                - https://paradedb.antithesis.com/report/IGmGhwJsT2XqpVmVe6NHcz3H/aujp6rxtITHhV8xS-iJ1qNoPlNCfXu4IPIr7yovVcwI.html?auth=v2.public.eyJuYmYiOiIyMDI2LTA2LTA0VDEwOjQ2OjQ5LjMyNjU5NDE1MVoiLCJzY29wZSI6eyJSZXBvcnRTY29wZVYxIjp7ImFzc2V0IjoiYXVqcDZyeHRJVEhoVjh4Uy1pSjFxTm9QbE5DZlh1NElQSXI3eW92VmN3SS5odG1sIiwicmVwb3J0X2lkIjoiSUdtR2h3SnNUMlhxcFZtVmU2TkhjejNIIn19fQZY1pNfTfBcMEZ6FsypGfmglMjjC5TSm9M_t5_RPSkFyfD9WNxq8_JQa8P89PRHc-Qw0r9D6b2DRyCXyF4U3gs
            - Reference:
                - https://github.com/paradedb/paradedb-enterprise/blob/315f3883651ef2d608336cbed17d9546ba6dca0d/docker/manifests/antithesis-proptests.yaml
                - https://github.com/paradedb/paradedb/blob/a059e3bab7135eab376717e2d8eb50d52147cbd4/tests/antithesis/singleton_driver_property-tests.sh
        - Tigris’ post covers total test time. We can provide some vaguely correct numbers here by extrapolating the numbers from a run, like here under “Utilization”:
            - https://paradedb.antithesis.com/report/IGmGhwJsT2XqpVmVe6NHcz3H/aujp6rxtITHhV8xS-iJ1qNoPlNCfXu4IPIr7yovVcwI.html?auth=v2.public.eyJuYmYiOiIyMDI2LTA2LTA0VDEwOjQ2OjQ5LjMyNjU5NDE1MVoiLCJzY29wZSI6eyJSZXBvcnRTY29wZVYxIjp7ImFzc2V0IjoiYXVqcDZyeHRJVEhoVjh4Uy1pSjFxTm9QbE5DZlh1NElQSXI3eW92VmN3SS5odG1sIiwicmVwb3J0X2lkIjoiSUdtR2h3SnNUMlhxcFZtVmU2TkhjejNIIn19fQZY1pNfTfBcMEZ6FsypGfmglMjjC5TSm9M_t5_RPSkFyfD9WNxq8_JQa8P89PRHc-Qw0r9D6b2DRyCXyF4U3gs
            - A single ~8 hours of wall clock time amounts to over 16 days (!!) of total testing time because we have 7 Stressgres suites and one proptests suites (8 suites total)
            - We started testing with Antithesis in December, but it took months to make it work well (so we can probably omit that). It’s been running consistently for a few months (at least 3, so can do the math 2x/week * 3 months)
- Results
    - Here are a few bugs reported by Antithesis that may be interesting to discuss:
        - https://github.com/paradedb/paradedb-enterprise/pull/636
            - This was probably the most important
        - https://github.com/paradedb/paradedb/pull/5072
            - This was probably the second most important
        - https://github.com/paradedb/paradedb-enterprise/pull/616
            - This one too
        - https://github.com/paradedb/paradedb/pull/5255
        - https://github.com/paradedb/paradedb/pull/4774
        - https://github.com/paradedb/paradedb/pull/5238
    - Example: https://antithesis.com/blog/2026/tigris_report/#results
- Takeaways & Ongoing efforts
    - That part I would leave to you (James). I think you’ll have very interesting things to say based on writing the post itself
    - For ongoing efforts, we are:
        - Adding more TOML Stressgres suite as we encounter new production use cases from customers. We recently added `logical-replication-merge.toml` which exposed new TOAST issues (even though it is disabled yet cuz the bug it surfaced hasn’t been fixed yet)
            - https://github.com/paradedb/paradedb/blob/a059e3bab7135eab376717e2d8eb50d52147cbd4/stressgres/suites/antithesis/singleton_driver_logical-replication-merge.sh#L13
            - https://github.com/paradedb/paradedb/blob/a059e3bab7135eab376717e2d8eb50d52147cbd4/.github/workflows/benchmark-pg_search-stressgres.yml#L278
        - Curious what @Stu Hood and @Moe think we should mention we are planning this whole MPP DSM features, which will have a huge impact on multi-process handling in ParadeDB (likely to lead to races) and this index partitioning feature (which will change the storage format, likely to cause issues like the initial FSM issue that brought us to Antithesis) and working on those with Antithesis present is giving us more confidence
            - See MPP Plan Partitioning for JoinScan
            - See Segment Partitioning

### Option B

The second option is more of a narrative about the initial issue with the FSM corruption bug linked above, rather than following the Tigris Data article format. That may read better from the ParadeDB perspective. The reasons I did not default to this are:

- That bug was fixed prior to us buying Antithesis, and in fact, we were not able to reproduce it in Antithesis (which is the primary reason it took us so long to convert from POC to paid)
- Writing from Antithesis’ perspective might help get them to publish us, which would be better than having it just on our website
- That bug was how we got to Antithesis, but it wasn’t a big part of our journey to use it effectively.

But up to you!

---
