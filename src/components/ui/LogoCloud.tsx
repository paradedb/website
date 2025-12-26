import { Logos } from "./Logos";

export default function LogoCloud() {
  return (
    <div className="bg-[#4f46e5] grid grid-cols-2 md:grid-cols-4 border-t border-indigo-500">
      <div className="flex items-center justify-center px-4 py-6 md:p-8 border-b border-r border-indigo-500">
        <Logos.BiltRewards className="w-16 md:w-20 brightness-0 invert opacity-70" />
      </div>
      <div className="flex items-center justify-center px-4 py-6 md:p-8 border-b border-r border-indigo-500">
        <Logos.ModernTreasury className="w-28 md:w-36 brightness-0 invert opacity-70" />
      </div>
      <div className="flex items-center justify-center px-4 py-6 md:p-8 border-b border-r border-indigo-500">
        <Logos.Alibaba className="w-16 md:w-24 brightness-0 invert opacity-70" />
      </div>
      <div className="flex items-center justify-center px-4 py-6 md:p-8 border-b border-indigo-500 md:border-r-0">
        <Logos.Unify className="w-16 md:w-20 brightness-0 invert opacity-70" />
      </div>
      <div className="flex items-center justify-center px-4 py-6 md:p-8 border-r border-indigo-500 border-b md:border-b-0">
        <Logos.Tcdi className="w-10 md:w-12 brightness-0 invert opacity-70" />
      </div>
      <div className="flex items-center justify-center px-4 py-6 md:p-8 border-r border-indigo-500 border-b md:border-b-0">
        <Logos.DemandScience className="w-28 md:w-36 brightness-0 invert opacity-70" />
      </div>
      <div className="flex items-center justify-center px-4 py-6 md:p-8 border-r border-indigo-500">
        <Logos.RxVantage className="w-20 md:w-28 brightness-0 invert opacity-70" />
      </div>
      <div className="flex items-center justify-center px-4 py-6 md:p-8">
        <Logos.Cofactr className="w-16 md:w-24 brightness-0 invert opacity-70" />
      </div>
    </div>
  );
}
