import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "./job-card";
import { useEffect } from "react";
import { FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const CreatedJobs = () => {
  const { user } = useUser();

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fnCreatedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {loadingCreatedJobs ? (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
             <div key={i} className="h-48 bg-gray-800/40 animate-pulse rounded-2xl border border-[var(--border-color)]" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {createdJobs?.length ? (
            createdJobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  onJobAction={fnCreatedJobs}
                  isMyJob
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 animate-in fade-in">
              <div className="glass-card p-10 rounded-2xl inline-block border-[var(--border-color)] shadow-sm max-w-md w-full">
                <FolderOpen className="w-12 h-12 text-[var(--accent-primary)] mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Posted Jobs</h3>
                <p className="text-gray-400 text-sm mb-6">You haven't posted any jobs yet. Start attracting top talent today.</p>
                <Link to="/post-job">
                  <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-800 transition-transform hover:scale-[1.02]">
                    Post a Job
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;