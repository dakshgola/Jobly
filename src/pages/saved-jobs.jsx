import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { Heart } from "lucide-react";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#8b5cf6" />;
  }

  return (
    <div className="pb-10">
      {/* Hero Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <Heart className="w-10 h-10 text-pink-400" fill="#ec4899" />
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white">
          Saved <span className="gradient-text-animated">Jobs</span>
        </h1>
        <p className="text-gray-400 mt-4 text-sm sm:text-base">
          Your bookmarked opportunities for future reference
        </p>
      </div>

      {/* Job Cards Grid */}
      {loadingSavedJobs === false && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs?.length ? (
            savedJobs?.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  onJobAction={fnSavedJobs}
                  savedInit={true}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="glass-card p-12 rounded-2xl inline-block">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No Saved Jobs Yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Start saving jobs you're interested in!
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;