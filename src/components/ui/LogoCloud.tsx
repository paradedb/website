import { Logos } from "./Logos"

export default function LogoCloud() {
  return (
    <section
      id="logo cloud"
      aria-label="Company logos"
      className="mt-24 flex animate-slide-up-fade flex-col items-center justify-center gap-y-6 text-center"
      style={{ animationDuration: "1500ms" }}
    >
      <div className="grid grid-cols-2 gap-10 gap-y-4 text-gray-900 md:grid-cols-4 md:gap-x-20">
        <Logos.Biosynthesis className="w-28" />
        <Logos.AltShift className="w-28" />
        <Logos.Capsule className="w-28" />
        <Logos.Catalog className="w-28" />
        <Logos.Cloudwatch className="w-28" />
        <Logos.FocalPoint className="w-28" />
        <Logos.Interlock className="w-28" />
        <Logos.Sisyphus className="w-28" />
      </div>
    </section>
  )
}
