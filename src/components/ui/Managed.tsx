import { documentation } from "@/lib/links";
import Image from "next/image";
import Link from "next/link";
import RdsImage from "../../../public/rds.png";
import S3Image from "../../../public/s3.png";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { ArrowAnimated } from "./ArrowAnimated";

export default function SearchAnalytics() {
  return (
    <section
      aria-labelledby="code-example-title"
      className="mx-auto mt-28 w-full max-w-6xl px-3"
    >
      <Badge>Zero ETL</Badge>
      <h2 className="mt-2 inline-block bg-clip-text py-2 text-4xl font-bold tracking-tighter text-gray-900 sm:text-6xl md:text-6xl">
        Integrates with your
        <br />
        existing infra
      </h2>
      <p className="mt-2 max-w-2xl text-gray-600 md:mt-6 md:text-lg">
        ParadeDB integrates with managed Postgres services and data lakes using
        native Postgres replication and APIs. Zero ETL required.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4">
        <div
          className="relative col-span-2 mx-auto h-max max-w-2xl animate-slide-up-fade rounded-2xl hover:shadow-xl hover:shadow-indigo-200 sm:ml-auto sm:w-full md:col-span-1"
          style={{ animationDuration: "1400ms" }}
        >
          <div className="rounded-2xl bg-slate-50 p-2">
            <div className="rounded-xl bg-white ring-1 ring-indigo-900/5">
              <div className="rounded-xl bg-slate-50 p-2 ring-1 ring-slate-300/50">
                <div className="relative rounded-t-xl">
                  <Image src={RdsImage} className="max-h-60 w-full" alt="rds" />
                </div>
                <div className="px-6 py-6 md:px-8">
                  <p className="text-lg font-semibold tracking-tight text-gray-900 transition-all md:text-xl">
                    RDS Compatible
                  </p>
                  <p className="mt-2 text-gray-600">
                    ParadeDB uses logical replication to consume data from
                    Amazon RDS, Azure Postgres and Google Cloud SQL.
                  </p>
                  <Link href={documentation.REPLICATION} target="_blank">
                    <Button
                      className="group mt-4 bg-transparent px-0 text-indigo-600 hover:bg-transparent"
                      variant="light"
                    >
                      Read Docs
                      <ArrowAnimated
                        className="stroke-indigo-600"
                        aria-hidden="true"
                      />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative col-span-2 mx-auto h-max max-w-2xl animate-slide-up-fade rounded-2xl hover:shadow-xl hover:shadow-indigo-200 sm:ml-auto sm:w-full md:col-span-1"
          style={{ animationDuration: "1400ms" }}
        >
          <div className="rounded-2xl bg-slate-50 p-2">
            <div className="rounded-xl bg-white ring-1 ring-indigo-900/5">
              <div className="rounded-xl bg-slate-50 p-2 ring-1 ring-slate-300/50">
                <div className="relative rounded-t-xl">
                  <Image
                    src={S3Image}
                    className="max-h-60 w-full"
                    alt="datalake"
                  />
                </div>
                <div className="px-6 py-6 md:px-8">
                  <p className="text-lg font-semibold tracking-tight text-gray-900 transition-all md:text-xl">
                    S3 Compatible
                  </p>
                  <p className="mt-2 text-gray-600">
                    ParadeDB can directly query and ingest data from S3, GCS,
                    and Azure Blob Storage.
                  </p>
                  <Link href={documentation.INGEST} target="_blank">
                    <Button
                      className="group mt-4 bg-transparent px-0 text-indigo-600 hover:bg-transparent"
                      variant="light"
                    >
                      Read Docs
                      <ArrowAnimated
                        className="stroke-indigo-600"
                        aria-hidden="true"
                      />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
