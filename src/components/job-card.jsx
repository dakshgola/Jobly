/* eslint-disable react/prop-types */
import { Heart, MapPinIcon, Trash2Icon, Briefcase } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { saveJob } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);

  const { user } = useUser();



  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  const handleSaveJob = async () => {
    if (job?.isSeed) {
      alert("This is a demo job for preview purposes");
      return;
    }
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction();
  };



  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  return (
    <Card className="flex flex-col rounded-xl border border-[var(--border-color)] bg-[#0B0F14]/40 hover:bg-[#1A212D]/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 overflow-hidden group">

      
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-start font-bold text-[var(--text-primary)] text-xl">
          <span className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[var(--accent-primary)]" />
            {job.title}
          </span>
          <div className="flex items-center gap-2">
            {job.isSeed && (
              <span className="text-xs badge-demo px-2 py-1 rounded font-normal">
                Demo Job
              </span>
            )}

          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1 text-[var(--text-secondary)]">
        <div className="flex justify-between items-center gap-4">
          {job.company ? (
            typeof job.company === "object" ? (
              job.company.logo_url ? (
                <img 
                  src={job.company.logo_url} 
                  alt={job.company.name}
                  className="h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                />
              ) : (
                <span className="text-xs font-bold text-blue-400 border border-blue-500/10 bg-blue-500/5 px-2 py-1 rounded">
                  {job.company.name}
                </span>
              )
            ) : (
              <span className="text-xs font-bold text-blue-400 border border-blue-500/10 bg-blue-500/5 px-2 py-1 rounded">
                {job.company}
              </span>
            )
          ) : (
            <span className="text-xs font-bold text-gray-500">Anonymous Company</span>
          )}
          <div className="flex gap-2 items-center text-sm text-[var(--text-secondary)]">
            <MapPinIcon size={14} className="text-[var(--accent-primary)]" /> 
            {job.location}
          </div>
        </div>
        
        <div className="h-px bg-[var(--border-color)] w-full opacity-50" />
        
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
          {job.description && (
            job.description.includes(".") 
              ? job.description.substring(0, job.description.indexOf(".") + 1)
              : job.description
          )}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button 
            className="w-full glass-card border-[var(--border-color)] hover:border-blue-500/50 hover:bg-blue-500/10 text-[var(--text-primary)] font-semibold rounded-xl"
            variant="outline"
          >
            View Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="glass-card border-[var(--border-color)] hover:border-blue-500/50 hover:bg-blue-500/10 w-12 h-10 p-0 rounded-xl"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={18} fill="#ec4899" stroke="#ec4899" />
            ) : (
              <Heart size={18} className="text-gray-400" />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;