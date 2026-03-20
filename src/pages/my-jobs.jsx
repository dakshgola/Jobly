import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Briefcase, FileText, Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getResumeFeedback } from "@/services/aiResumeFeedback";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#8b5cf6" />;
  }

  const isCandidate = user?.unsafeMetadata?.role !== "recruiter";

  const [feedback, setFeedback] = useState(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  const handleGetFeedback = async () => {
    setIsFeedbackLoading(true);
    try {
      const result = await getResumeFeedback(user?.unsafeMetadata);
      setFeedback(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  return (
    <div className="pb-10">
      {/* Hero Title with Icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          {isCandidate ? (
            <FileText className="w-10 h-10 text-[var(--accent-primary)]" />
          ) : (
            <Briefcase className="w-10 h-10 text-[var(--accent-primary)]" />
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

      {true && (
        <div className="max-w-7xl mx-auto mb-10 px-4">
          <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[#0B0F14]/40 relative overflow-hidden group shadow-sm transition-all duration-300 hover:bg-[#0B0F14]/80">
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div>
                <h3 className="text-xl font-bold text-[var(--accent-primary)] flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5" /> AI Profile Feedback
                </h3>
                <p className="text-[var(--text-secondary)]">Get actionable advice from Gemini AI on how to improve your hired potential.</p>
              </div>
              
              {!feedback && !isFeedbackLoading && (
                <Button onClick={handleGetFeedback} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm transition-transform hover:scale-[1.02] border-0">
                  <Sparkles className="w-4 h-4 mr-2" /> Get Expert Feedback
                </Button>
              )}

              {isFeedbackLoading && (
                 <div className="flex items-center gap-3 text-purple-400 font-medium">
                   <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                   Analyzing your profile...
                 </div>
              )}
            </div>

            {feedback && (
              <div className="relative z-10 mt-6 pt-6 border-t border-[var(--border-color)] grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                {/* Strengths */}
                <div className="flex flex-col p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                   <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                     <TrendingUp className="w-4 h-4" /> Strong Points
                   </h4>
                   <ul className="space-y-2">
                     {feedback.strengths?.map((item, i) => (
                       <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                         <span className="text-green-500 mt-0.5">•</span> {item}
                       </li>
                     ))}
                   </ul>
                </div>

                {/* Weaknesses */}
                <div className="flex flex-col p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                   <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4" /> Missing Links
                   </h4>
                   <ul className="space-y-2">
                     {feedback.weaknesses?.map((item, i) => (
                       <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                         <span className="text-red-500 mt-0.5">•</span> {item}
                       </li>
                     ))}
                   </ul>
                </div>

                {/* Suggestions */}
                <div className="flex flex-col p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                   <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                     <Lightbulb className="w-4 h-4" /> Next Steps
                   </h4>
                   <ul className="space-y-2">
                     {feedback.suggestions?.map((item, i) => (
                       <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                         <span className="text-blue-500 mt-0.5">→</span> {item}
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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