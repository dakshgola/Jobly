import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";

import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const { isLoaded } = useUser();

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
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#8b5cf6" />;
  }

  return (
    <div className="pb-10">
      {/* Hero Title */}
      <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-center mb-8 text-white">
        Latest <span className="gradient-text-animated">Jobs</span>
      </h1>

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
            className="h-12 pl-12 pr-4 glass-card text-white placeholder:text-gray-500 border-purple-500/30 focus:border-purple-500 text-base"
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
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="glass-card border-purple-500/30 text-white h-12">
            <MapPin className="w-4 h-4 mr-2 text-purple-400" />
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent className="glass-card border-purple-500/30">
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem 
                    key={name} 
                    value={name}
                    className="text-white hover:bg-purple-500/20"
                  >
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger className="glass-card border-purple-500/30 text-white h-12">
            <Building2 className="w-4 h-4 mr-2 text-purple-400" />
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent className="glass-card border-purple-500/30">
            <SelectGroup>
              {companies?.map(({ name, id }) => {
                return (
                  <SelectItem 
                    key={name} 
                    value={id}
                    className="text-white hover:bg-purple-500/20"
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
        <BarLoader className="mt-4" width={"100%"} color="#8b5cf6" />
      )}

      {/* Job Cards Grid */}
      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="glass-card p-12 rounded-2xl inline-block">
                <p className="text-gray-400 text-lg">No Jobs Found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;