import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";

import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRecommendedJobs } from "@/services/aiRecommendations";
import { getJobMatchRankings } from "@/services/aiJobMatchRanking";
import { getCandidateProfile } from "@/api/apiCandidateProfile";
import { Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import { Search, MapPin, Building2, X } from "lucide-react";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [recommendedIds, setRecommendedIds] = useState([]);
  const [isRecommending, setIsRecommending] = useState(false);

  // AI matches state
  const [activeTab, setActiveTab] = useState("all");
  const [rankings, setRankings] = useState([]);
  const [isRanking, setIsRanking] = useState(false);

  const { isLoaded, user } = useUser();
  const isCandidate = user?.unsafeMetadata?.role !== "recruiter";

  // Fetch candidate profile for AI matching
  const {
    loading: loadingProfile,
    data: profileData,
    fn: fnGetProfile,
  } = useFetch(getCandidateProfile, {
    user_id: user?.id,
  });

  useEffect(() => {
    if (isLoaded && user?.id && isCandidate) {
      fnGetProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user, isCandidate]);

  const handleGetRecommendations = async () => {
    if (!jobs?.length) return;
    setIsRecommending(true);
    try {
      const recs = await getRecommendedJobs(jobs, user?.unsafeMetadata);
      console.log("Setting recommended IDs:", recs);
      setRecommendedIds(recs || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRecommending(false);
    }
  };

  const handleRankJobs = async () => {
    if (!jobs?.length || !profileData) return;
    setIsRanking(true);
    try {
      const rankedResults = await getJobMatchRankings(jobs, profileData);
      setRankings(rankedResults || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRanking(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ai-matches" && profileData && jobs?.length > 0 && rankings.length === 0 && !isRanking) {
      handleRankJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, profileData, jobs]);

  const {
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    setSearchQuery(query || "");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  if (!isLoaded) {
    return (
      <div className="pb-10 max-w-7xl mx-auto px-4 w-full">
        <div className="h-16 w-1/3 bg-gray-800/50 animate-pulse rounded-xl mb-8 mx-auto" />
        <div className="h-12 w-full bg-gray-800/50 animate-pulse rounded-xl mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
             <div key={i} className="h-48 bg-gray-800/50 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* Hero Title */}
      <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-center mb-8 text-white">
        Latest <span className="gradient-text-animated">Jobs</span>
      </h1>

      {/* Tabs Selector (Candidate Only) */}
      {isCandidate && (
        <div className="flex gap-4 border-b border-[var(--border-color)] mb-8 justify-center">
          <button 
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-6 text-lg font-bold border-b-2 transition-all ${
              activeTab === "all" 
                ? "border-blue-500 text-white font-extrabold" 
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            All Jobs
          </button>
          <button 
            onClick={() => setActiveTab("ai-matches")}
            className={`pb-3 px-6 text-lg font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "ai-matches" 
                ? "border-blue-500 text-white font-extrabold" 
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-5 h-5 text-purple-400" /> AI Matches
          </button>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === "all" ? (
        <>
          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row w-full gap-3 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search Jobs by Title..."
                name="search-query"
                className="h-12 pl-12 pr-4 glass-card text-white placeholder:text-gray-500 border-[var(--border-color)] focus:border-[var(--border-color)] text-base"
              />
            </div>
            <Button 
              type="submit" 
              className="gradient-button h-12 px-8 text-base font-semibold rounded-xl"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Select value={location || undefined} onValueChange={(value) => setLocation(value)}>
              <SelectTrigger className="glass-card border-[var(--border-color)] text-white h-12">
                <MapPin className="w-4 h-4 mr-2 text-[var(--accent-primary)]" />
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent className="glass-card border-[var(--border-color)]">
                <SelectGroup>
                  {State.getStatesOfCountry("IN").map(({ name }) => {
                    return (
                      <SelectItem 
                        key={name} 
                        value={name}
                        className="text-white hover:bg-blue-500/20"
                      >
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={company_id || undefined}
              onValueChange={(value) => setCompany_id(value)}
            >
              <SelectTrigger className="glass-card border-[var(--border-color)] text-white h-12">
                <Building2 className="w-4 h-4 mr-2 text-[var(--accent-primary)]" />
                <SelectValue placeholder="Filter by Company" />
              </SelectTrigger>
              <SelectContent className="glass-card border-[var(--border-color)]">
                <SelectGroup>
                  {companies?.map(({ name, id }) => {
                    return (
                      <SelectItem 
                        key={name} 
                        value={id}
                        className="text-white hover:bg-blue-500/20"
                      >
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              className="glass-card border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 text-white h-12 px-6 rounded-xl font-semibold"
              variant="outline"
              onClick={clearFilters}
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          {/* Loading State */}
          {loadingJobs && (
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="h-48 bg-gray-800/40 animate-pulse rounded-2xl border border-[var(--border-color)]" />
              ))}
            </div>
          )}

          {/* AI Recommendations Section */}
          {jobs?.length > 0 && !loadingJobs && (
            <div className="mt-6 mb-8 p-6 rounded-2xl border border-[var(--border-color)] bg-[#0B0F14]/40 hover:bg-[#0B0F14]/80 shadow-sm transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-purple-400" /> Recommended For You
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Let Gemini analyze your profile against all open positions.</p>
                </div>
                
                {!recommendedIds.length && !isRecommending && (
                  <Button onClick={handleGetRecommendations} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all">
                    <Sparkles className="w-4 h-4 mr-2" /> Uncover Perfect Matches
                  </Button>
                )}

                {isRecommending && (
                  <div className="flex items-center gap-2 text-purple-400 font-medium">
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> Find matches...
                  </div>
                )}
              </div>

              {recommendedIds.length > 0 && (
                 <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500 border-t border-[var(--border-color)] pt-6">
                   {jobs.filter(j => recommendedIds.map(String).includes(String(j.id))).map(job => (
                     <div key={`rec-${job.id}`} className="relative group">
                       <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                       <div className="relative">
                         <JobCard job={job} savedInit={job?.saved?.length > 0} />
                       </div>
                     </div>
                   ))}
                 </div>
              )}
            </div>
          )}

          {/* Main Job Cards Grid */}
          {loadingJobs === false && (
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs?.length ? (
                <>
                  {jobs[0]?.isSeed && (
                    <div className="col-span-full flex justify-center mb-6">
                      <span className="text-sm bg-blue-500/20 border border-[var(--border-color)] text-[var(--accent-primary)] px-4 py-2 rounded-full flex items-center gap-2">
                        🌟 Showing demo jobs for preview
                      </span>
                    </div>
                  )}
                  {jobs.filter(job => !recommendedIds.map(String).includes(String(job.id))).map((job) => {
                    return (
                    <JobCard
                      key={job.id}
                      job={job}
                      savedInit={job?.saved?.length > 0}
                    />
                  );
                })}
                </>
              ) : (
                <div className="col-span-full text-center py-20 animate-in fade-in">
                  <div className="glass-card p-10 rounded-2xl inline-block border-[var(--border-color)] shadow-sm max-w-md w-full">
                    <Search className="w-12 h-12 text-[var(--accent-primary)] mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No matching jobs found</h3>
                    <p className="text-gray-400 text-sm mb-6">We couldn't find any positions matching your current filters. Try adjusting your search criteria or clearing filters.</p>
                    <Button onClick={clearFilters} variant="outline" className="text-white border-gray-600 hover:bg-gray-800 transition-transform hover:scale-[1.02]">
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* AI Matches Tab */
        <div className="space-y-6">
          {loadingProfile ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500/20 border-t-purple-500 rounded-full" />
              <span className="text-sm text-gray-400">Loading candidate profile...</span>
            </div>
          ) : !profileData ? (
            <div className="text-center py-16 animate-in fade-in">
              <div className="glass-card p-10 rounded-2xl inline-block border-[var(--border-color)] shadow-sm max-w-md w-full text-left">
                <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Profile Found</h3>
                <p className="text-gray-400 text-sm mb-6">
                  To match your skills against open jobs, you need to upload a resume or complete your candidate profile first.
                </p>
                <Link to="/my-jobs">
                  <Button className="gradient-button text-white rounded-xl h-11 px-6 border-0">
                    Go to Profile
                  </Button>
                </Link>
              </div>
            </div>
          ) : isRanking ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-purple-400 font-semibold text-base animate-pulse">Running AI Job Matching...</p>
                <p className="text-xs text-gray-500 mt-1">Comparing your profile to all open listings using Gemini Pro.</p>
              </div>
            </div>
          ) : rankings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">No open jobs found to rank.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {jobs
                ?.filter(job => job.isOpen)
                .map(job => {
                  const match = rankings.find(r => String(r.id) === String(job.id));
                  const score = match ? match.score : 0;
                  const bullets = match ? match.why_matches : [];
                  return { job, score, bullets };
                })
                .sort((a, b) => b.score - a.score)
                .map(({ job, score, bullets }) => (
                  <div key={`ranked-${job.id}`} className="flex flex-col h-full relative group">
                    {score >= 80 && (
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                    )}
                    <div className="relative flex flex-col h-full bg-[#0B0F14]/40 border border-[var(--border-color)] rounded-2xl p-1 overflow-hidden transition-all duration-300 hover:border-blue-500/30">
                      <div className="flex-1">
                        <JobCard job={job} savedInit={job?.saved?.length > 0} />
                      </div>
                      
                      {/* Match Analysis sub-card */}
                      <div className="mx-4 mb-4 p-4 rounded-xl border border-[var(--border-color)] bg-[#0B0F14]/80 text-left space-y-2.5">
                        <div className="flex justify-between items-center border-b border-gray-800/60 pb-2">
                          <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> AI Match Analysis
                          </span>
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                            score >= 80 
                              ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                              : score >= 60 
                                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" 
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            {score}% Match
                          </span>
                        </div>
                        {bullets.length > 0 ? (
                          <ul className="space-y-1.5">
                            {bullets.map((bullet, i) => (
                              <li key={i} className="text-[11px] text-gray-300 leading-relaxed flex items-start gap-1.5">
                                <span className="text-purple-400 shrink-0 mt-1">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[10px] text-gray-500 italic">No analysis description available.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;