import { call, showInView } from "@dev-agents/sdk-client";
import { useQuery } from "@tanstack/react-query";
import { Radio } from "lucide-react";
import type { getAlertCounts, getWatches } from "./server";

export default function Widget() {
  const { data: counts } = useQuery({
    queryKey: ["alertCounts"],
    queryFn: () => call<typeof getAlertCounts>("getAlertCounts", {}),
  });

  const { data: watchList } = useQuery({
    queryKey: ["watches"],
    queryFn: () => call<typeof getWatches>("getWatches", {}),
  });

  const unread = counts?.unreadCount ?? 0;
  const activeCount = watchList?.filter((w: { status: string }) => w.status === "active").length ?? 0;

  return (
    <div
      className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 cursor-default"
      onClick={() => showInView("/", "app")}
    >
      <Radio className="w-10 h-10 text-white/90 mb-2" />

      {unread > 0 ? (
        <>
          <p className="text-4xl font-bold text-white font-['DM_Sans']">{unread}</p>
          <p className="text-xs text-white/70 font-['DM_Sans'] mt-1">
            new alert{unread === 1 ? "" : "s"}
          </p>
        </>
      ) : (
        <>
          <p className="text-sm text-white/80 font-['DM_Sans'] font-medium">All clear</p>
          <p className="text-xs text-white/60 font-['DM_Sans'] mt-1">
            {activeCount} watch{activeCount === 1 ? "" : "es"} active
          </p>
        </>
      )}
    </div>
  );
}
