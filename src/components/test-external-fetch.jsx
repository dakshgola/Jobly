import { useState } from "react";
import { fetchJSearchJobs } from "@/services/jobFetchService";
import { upsertExternalJobs } from "@/api/apiExternalJobs";
import useFetch from "@/hooks/use-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Database, CheckCircle2, Search, MapPin } from "lucide-react";

export function TestExternalFetch() {
  const [titleQuery, setTitleQuery] = useState("React Developer");
  const [locQuery, setLocQuery] = useState("Delhi");
  const [statusMsg, setStatusMsg] = useState("");
  const [results, setResults] = useState([]);

  const { loading: loadingSync, fn: fnUpsertExternalJobs } = useFetch(upsertExternalJobs);

  const handleTestSync = async (e) => {
    e.preventDefault();
    if (!titleQuery) {
      setStatusMsg("Error: Please provide a job title keyword query");
      return;
    }

    setStatusMsg("Fetching live jobs from JSearch API...");
    setResults([]);
    
    try {
      // 1. Fetch live jobs
      const normalizedJobs = await fetchJSearchJobs(titleQuery, locQuery);
      
      if (normalizedJobs.length === 0) {
        setStatusMsg("No jobs found matching your criteria.");
        return;
      }

      setStatusMsg(`Fetched ${normalizedJobs.length} jobs. Syncing with Supabase db...`);

      // 2. Upsert into external_jobs table
      const response = await fnUpsertExternalJobs(null, normalizedJobs);
      
      setResults(response || []);
      setStatusMsg(`Successfully synced and saved ${response?.length || 0} jobs into Supabase 'external_jobs' table!`);
    } catch (err) {
      console.error(err);
      setStatusMsg(`Error: ${err.message || "Failed to complete fetch pipeline sync"}`);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[#0B0F14]/40 relative overflow-hidden group shadow-sm transition-all duration-300 hover:bg-[#0B0F14]/80 flex flex-col justify-between text-left">
      <div className="relative z-10 w-full">
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
          <Database className="w-5 h-5 text-blue-400" /> Pipeline Isolation Tester
        </h3>
        <p className="text-[var(--text-secondary)] text-sm mb-6">
          Test live external API fetches from JSearch and confirm they normalize and write correctly to Supabase.
        </p>

        <form onSubmit={handleTestSync} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-gray-400 font-semibold block mb-1">Keywords / Title</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  type="text" 
                  value={titleQuery} 
                  onChange={(e) => setTitleQuery(e.target.value)}
                  className="pl-9 h-11 bg-black/40 border border-[var(--border-color)] text-white rounded-lg focus:border-blue-500/50 outline-none w-full"
                  placeholder="e.g. React Developer"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-semibold block mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  type="text" 
                  value={locQuery} 
                  onChange={(e) => setLocQuery(e.target.value)}
                  className="pl-9 h-11 bg-black/40 border border-[var(--border-color)] text-white rounded-lg focus:border-blue-500/50 outline-none w-full"
                  placeholder="e.g. Delhi, IN"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={loadingSync} 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-transform hover:scale-[1.01] border-0 h-11 px-6 font-semibold"
            >
              {loadingSync ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Syncing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Sync External Jobs
                </span>
              )}
            </Button>
          </div>
        </form>

        {statusMsg && (
          <div className={`p-4 rounded-xl text-xs mb-6 border ${
            statusMsg.startsWith("Error") 
              ? "bg-red-500/5 border-red-500/10 text-red-300"
              : statusMsg.startsWith("Successfully")
                ? "bg-green-500/5 border-green-500/10 text-green-300 flex items-center gap-2"
                : "bg-blue-500/5 border-blue-500/10 text-blue-300 animate-pulse"
          }`}>
            {statusMsg.startsWith("Successfully") && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
            {statusMsg}
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3 animate-in fade-in duration-300 border-t border-[var(--border-color)] pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Synced Jobs Preview (Database Rows)</h4>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {results.map((job) => (
                <div key={job.id} className="p-3 rounded-lg bg-black/20 border border-[var(--border-color)] text-xs flex justify-between items-center gap-4">
                  <div>
                    <p className="font-bold text-white">{job.title}</p>
                    <p className="text-gray-400 mt-0.5">{job.company} — <span className="text-[10px] italic">{job.location}</span></p>
                  </div>
                  <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-black shrink-0">
                    {job.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
