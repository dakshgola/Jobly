/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, Download, School, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false, onStatusChange }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
      id: application.id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status).then(() => {
      if (onStatusChange) onStatusChange();
    });
  };

  return (
    <Card className="rounded-xl border border-[var(--border-color)] bg-[#0B0F14]/40 hover:bg-[#0B0F14]/60 shadow-sm transition-all duration-300">
      {loadingHiringStatus && <BarLoader width={"100%"} color="#8b5cf6" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold text-white text-lg animate-in fade-in">
          {isCandidate
            ? application?.external_job_id
              ? `${application?.external_job?.title} at ${application?.external_job?.company}`
              : `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1 text-[var(--text-secondary)]">
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <div className="flex gap-2 items-center text-sm">
            <BriefcaseBusiness size={15} className="text-purple-400" /> {application?.experience} years of
            experience
          </div>
          <div className="flex gap-2 items-center text-sm">
            <School size={15} className="text-blue-400" />
            {application?.education}
          </div>
          <div className="flex gap-2 items-center text-sm">
            <Boxes size={15} className="text-green-400" /> Skills: {application?.skills}
          </div>
        </div>
        <hr className="border-[var(--border-color)] opacity-50" />
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-gray-400">
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        {isCandidate ? (
          <span className={`capitalize font-black px-3 py-1.5 rounded-full text-[10px] border flex items-center gap-1.5 ${
            application.status === "applied"
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : application.status === "interviewing"
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                : application.status === "hired"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>
            {application.status === "hired" && <Check className="w-3.5 h-3.5" />}
            {application.status === "hired" ? "Selected" : application.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52 bg-black/40 border-[var(--border-color)] text-white rounded-xl">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent className="glass-card border-[var(--border-color)] text-white">
              <SelectItem value="applied" className="hover:bg-blue-500/20">Applied</SelectItem>
              <SelectItem value="interviewing" className="hover:bg-blue-500/20">Interviewing</SelectItem>
              <SelectItem value="hired" className="hover:bg-blue-500/20">Hired (Selected)</SelectItem>
              <SelectItem value="rejected" className="hover:bg-blue-500/20">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;