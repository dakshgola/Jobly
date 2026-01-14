import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { UserCircle, Briefcase } from "lucide-react";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const navigateUser = (role) => {
    navigate(role === "recruiter" ? "/post-job" : "/jobs");
  };

  const handleRoleSelection = async (role) => {
    try {
      await user.update({
        unsafeMetadata: { role },
      });
      navigateUser(role);
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  useEffect(() => {
    if (isLoaded && user?.unsafeMetadata?.role) {
      navigateUser(user.unsafeMetadata.role);
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width="100%" color="#8b5cf6" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="font-black text-5xl sm:text-6xl lg:text-7xl text-white mb-4">
          I am a...
        </h2>
        <p className="text-gray-400 text-lg">
          Choose your role to get started
        </p>
      </div>

      {/* Role Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Candidate */}
        <button
          onClick={() => handleRoleSelection("candidate")}
          className="glass-card p-8 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 hover:scale-105 transition-all duration-300"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <UserCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Candidate
              </h3>
              <p className="text-gray-400 text-sm">
                Looking for job opportunities
              </p>
            </div>
          </div>
        </button>

        {/* Recruiter */}
        <button
          onClick={() => handleRoleSelection("recruiter")}
          className="glass-card p-8 rounded-2xl border border-blue-500/30 hover:border-blue-500/60 hover:scale-105 transition-all duration-300"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Recruiter
              </h3>
              <p className="text-gray-400 text-sm">
                Hiring top talent for your company
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
