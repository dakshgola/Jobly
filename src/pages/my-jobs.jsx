import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Briefcase, FileText } from "lucide-react";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#8b5cf6" />;
  }

  const isCandidate = user?.unsafeMetadata?.role === "candidate";

  return (
    <div className="pb-10">
      {/* Hero Title with Icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          {isCandidate ? (
            <FileText className="w-10 h-10 text-purple-400" />
          ) : (
            <Briefcase className="w-10 h-10 text-purple-400" />
          )}
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white">
          {isCandidate ? (
            <>
              My <span className="gradient-text-animated">Applications</span>
            </>
          ) : (
            <>
              My <span className="gradient-text-animated">Jobs</span>
            </>
          )}
        </h1>
        <p className="text-gray-400 mt-4 text-sm sm:text-base">
          {isCandidate 
            ? "Track and manage your job applications" 
            : "Manage your posted jobs and applications"}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {isCandidate ? (
          <CreatedApplications />
        ) : (
          <CreatedJobs />
        )}
      </div>
    </div>
  );
};

export default MyJobs;