import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon, Sparkles, CheckCircle2, XCircle } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";
import { Button } from "@/components/ui/button";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob } from "@/api/apiJobs";
import { getMatchScore } from "@/services/aiMatch";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  const [matchData, setMatchData] = useState(null);
  const [isMatchLoading, setIsMatchLoading] = useState(false);

  const handleCheckMatch = async () => {
    setIsMatchLoading(true);
    try {
      const result = await getMatchScore(job, user?.unsafeMetadata);
      setMatchData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsMatchLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);



  if (!isLoaded || loadingJob) {
    return (
      <div className="flex flex-col gap-8 mt-5 animate-pulse">
        <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
          <div className="h-16 w-3/4 bg-gray-800/50 rounded-xl" />
          <div className="h-12 w-12 bg-gray-800/50 rounded-xl" />
        </div>
        <div className="flex justify-between">
          <div className="h-6 w-1/4 bg-gray-800/50 rounded-md" />
          <div className="h-6 w-1/4 bg-gray-800/50 rounded-md" />
          <div className="h-6 w-1/4 bg-gray-800/50 rounded-md" />
        </div>
        <div className="h-40 w-full bg-gray-800/40 rounded-2xl" />
        <div className="h-64 w-full bg-gray-800/40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        {job?.company?.logo_url ? (
          <img src={job?.company?.logo_url} className="h-12 object-contain" alt={job?.company?.name || job?.title} />
        ) : (
          <span className="text-lg font-bold text-blue-400 border border-blue-500/10 bg-blue-500/5 px-4 py-2 rounded-xl">
            {job?.company?.name || "External Company"}
          </span>
        )}
      </div>

      <div className="flex justify-between ">
        <div className="flex gap-2">
          <MapPinIcon /> {job?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase /> {job?.applications?.length} Applicants
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <span className="badge-open px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <DoorOpen size={16} /> Open
            </span>
          ) : (
            <span className="badge-closed px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <DoorClosed size={16} /> Closed
            </span>
          )}
        </div>
      </div>



      {/* AI MATCH SCORE SECTION */}
      <div className="mt-2 p-6 rounded-2xl border border-[var(--border-color)] bg-[#0B0F14]/40 relative overflow-hidden group shadow-sm transition-all">
          <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
              <h3 className="text-xl font-bold text-[var(--accent-primary)] flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" /> AI Profile Match
              </h3>
              <p className="text-[var(--text-secondary)]">See how well your skills align with this role using Gemini AI.</p>
            </div>
            
            {!matchData && !isMatchLoading && (
              <Button onClick={handleCheckMatch} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-transform hover:scale-[1.02] border-0">
                <Sparkles className="w-4 h-4 mr-2" /> Check My Match
              </Button>
            )}

            {isMatchLoading && (
               <div className="flex items-center gap-3 text-blue-400 font-medium">
                 <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                 Analyzing profile fit...
               </div>
            )}
          </div>

          {matchData && (
            <div className="relative z-10 mt-6 pt-6 border-t border-[var(--border-color)] grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#0a0118] border border-[var(--border-color)]">
                 <span className={`text-4xl font-extrabold ${matchData.score >= 75 ? "text-green-500" : matchData.score >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                   {matchData.score}%
                 </span>
                 <span className="text-sm text-[var(--text-secondary)] mt-1 font-medium">Match Score</span>
              </div>
              <div className="md:col-span-3 flex flex-col justify-center">
                 <p className="text-[var(--text-primary)] mb-4 leading-relaxed">{matchData.summary}</p>
                 <div className="flex flex-wrap gap-2">
                   {matchData.matched_skills?.map(skill => (
                     <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1 font-medium shadow-sm">
                       <CheckCircle2 className="w-3 h-3" /> {skill}
                     </span>
                   ))}
                   {matchData.missing_skills?.map(skill => (
                     <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1 font-medium shadow-sm">
                       <XCircle className="w-3 h-3" /> {skill}
                     </span>
                   ))}
                 </div>
              </div>
            </div>
          )}
        </div>

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      {job?.requirements && (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold">
            What we are looking for
          </h2>
          <MDEditor.Markdown
            source={job?.requirements}
            className="bg-transparent sm:text-lg"
          />
        </>
      )}
      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user?.id)}
        />
      )}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
          {job?.applications.map((application) => {
            return (
              <ApplicationCard 
                key={application.id} 
                application={application} 
                onStatusChange={fnJob}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobPage;