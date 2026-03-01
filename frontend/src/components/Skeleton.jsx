import { motion } from "framer-motion";

const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
);

export const NoteSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <Skeleton className="w-20 h-6 rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-1/2 h-4" />
    </div>
    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-24 h-4" />
      </div>
      <Skeleton className="w-10 h-10 rounded-xl" />
    </div>
  </div>
);

export const AnnouncementSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
    <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex justify-between">
        <Skeleton className="w-1/3 h-5" />
        <Skeleton className="w-20 h-4" />
      </div>
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-2/3 h-4" />
    </div>
  </div>
);

export default Skeleton;
