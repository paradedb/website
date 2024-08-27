import { Logos } from "./Logos"

export default function LogoCloud() {
  return (
    <section
      aria-label="Company logos"
      className="mt-24 flex animate-slide-up-fade flex-col items-center justify-center gap-y-6 text-center"
      style={{ animationDuration: "1500ms" }}
    >
      <div className="text-md mx-auto font-medium text-gray-900">
        Trusted by enterprises, loved by developers
      </div>
      <div className="-mt-2 mr-8 flex space-x-6 sm:space-x-10 md:mr-0 md:mt-0">
        <Logos.Alibaba className="w-20 sm:w-28" />
        <Logos.Insa className="w-20 sm:w-28" />
        <Logos.Sweetspot className="w-28 sm:w-36" />
      </div>
    </section>
  )
}
