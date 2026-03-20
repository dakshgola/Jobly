import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./application-card";
import { useEffect } from "react";
import { getApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { FolderOpen } from "lucide-react";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingApplications) {
    return (
      <div className="flex flex-col gap-4 mt-4 w-full">
        <div className="h-28 w-full bg-gray-800/40 animate-pulse rounded-2xl border border-[var(--border-color)]" />
        <div className="h-28 w-full bg-gray-800/40 animate-pulse rounded-2xl border border-[var(--border-color)]" />
        <div className="h-28 w-full bg-gray-800/40 animate-pulse rounded-2xl border border-[var(--border-color)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {applications?.length > 0 ? (
        applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        ))
      ) : (
        <div className="text-center py-20 animate-in fade-in">
          <div className="glass-card p-10 rounded-2xl inline-block border-[var(--border-color)] shadow-sm max-w-md w-full">
            <FolderOpen className="w-12 h-12 text-[var(--accent-primary)] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Applications Yet</h3>
            <p className="text-gray-400 text-sm">You haven't applied to any jobs yet. Start exploring opportunities to build your career.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatedApplications;