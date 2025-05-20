import { Logos } from "./Logos";
import classNames from "classnames";

const logoCellStyle = "flex justify-center";
const bottomDotted = "";
const rightDotted = "";

export default function LogoCloud() {
  return (
    <section
      aria-label="Company logos"
      className="mx-auto mt-24 flex max-w-6xl animate-slide-up-fade flex-col items-center justify-center text-center px-4"
      style={{ animationDuration: "1500ms" }}
    >
      <div className="text-md mx-auto font-medium text-gray-900">
        Trusted by enterprises, loved by developers
      </div>
      <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-12 mt-6 gap-y-2">
        <div className={classNames(logoCellStyle, bottomDotted, rightDotted)}>
          <Logos.BiltRewards className="mx-auto w-12 sm:w-16" />
        </div>
        <div className={classNames(logoCellStyle, bottomDotted, rightDotted)}>
          <Logos.ModernTreasury className="mx-auto w-32 sm:w-40" />
        </div>
        <div className={classNames(logoCellStyle, bottomDotted)}>
          <Logos.Alibaba className="mx-auto w-20 sm:w-24" />
        </div>
        <div className={classNames(logoCellStyle, bottomDotted, rightDotted)}>
          <Logos.Tcdi className="mx-auto w-8 sm:w-10 pb-1" />
        </div>
        <div className={classNames(logoCellStyle, rightDotted)}>
          <Logos.DemandScience className="mx-auto w-24 sm:w-36" />
        </div>
        <div className={classNames(logoCellStyle, bottomDotted)}>
          <Logos.RxVantage className="mx-auto w-24 sm:w-28 pt-0.5" />
        </div>
        <div className={logoCellStyle}>
          <Logos.Cofactr className="mx-auto w-16 sm:w-20 my-auto" />
        </div>
        <div className={classNames(logoCellStyle, rightDotted)}>
          <Logos.Zulip className="mx-auto w-12 sm:w-16" />
        </div>
      </div>
    </section>
  );
}
