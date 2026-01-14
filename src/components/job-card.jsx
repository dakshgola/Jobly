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
import { deleteJob, saveJob } from "@/api/apiJobs";
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

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  return (
    <Card className="glass-card flex flex-col hover:scale-[1.02] transition-all duration-300 border-0 overflow-hidden group">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#8b5cf6" />
      )}
      
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-start font-bold text-white text-xl">
          <span className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-400" />
            {job.title}
          </span>
          {isMyJob && (
            <Trash2Icon
              size={18}
              className="text-red-400 hover:text-red-500 cursor-pointer transition-colors"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1 text-gray-300">
        <div className="flex justify-between items-center">
          {job.company && (
            <img 
              src={job.company.logo_url} 
              alt={job.company.name}
              className="h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
            />
          )}
          <div className="flex gap-2 items-center text-sm text-gray-400">
            <MapPinIcon size={14} className="text-purple-400" /> 
            {job.location}
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        
        <p className="text-sm text-gray-400 line-clamp-2">
          {job.description.substring(0, job.description.indexOf("."))}.
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button 
            className="w-full glass-card border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 text-white font-semibold rounded-xl"
            variant="outline"
          >
            View Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="glass-card border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 w-12 h-10 p-0 rounded-xl"
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