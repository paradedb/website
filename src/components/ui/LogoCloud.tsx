import { Logos } from "./Logos"
import classNames from "classnames"

const logoCellStyle = "px-4 sm:px-12 flex justify-center h-16 sm:h-20"
const bottomDotted = "border-dotted border-b border-slate-200"
const rightDotted = "border-dotted border-r border-slate-200"

export default function LogoCloud() {
  return (
    <section
      aria-label="Company logos"
      className="mx-auto mt-24 flex max-w-6xl animate-slide-up-fade flex-col items-center justify-center gap-y-6 text-center"
      style={{ animationDuration: "1500ms" }}
    >
      <div className="text-md mx-auto font-medium text-gray-900">
        Trusted by enterprises, loved by developers
      </div>
      <div className="grid grid-cols-3">
        <div className={classNames(logoCellStyle, bottomDotted, rightDotted)}>
          <Logos.BiltRewards className="mx-auto w-12 sm:w-16" />
        </div>
        <div className={classNames(logoCellStyle, bottomDotted, rightDotted)}>
          <Logos.ModernTreasury className="mx-auto w-36 sm:w-40" />
        </div>
        <div className={classNames(logoCellStyle, bottomDotted)}>
          <Logos.Alibaba className="mx-auto w-20 sm:w-24" />
        </div>
        <div className={classNames(logoCellStyle, rightDotted)}>
          <Logos.DemandScience className="mx-auto w-24 sm:w-36" />
        </div>
        <div className={classNames(logoCellStyle, rightDotted)}>
          <Logos.Zulip className="mx-auto w-12 sm:w-16" />
        </div>
        <div className={logoCellStyle}>
          <Logos.Insa className="mx-auto w-12 sm:w-16 my-auto" />
        </div>
      </div>
    </section>
  )
}
