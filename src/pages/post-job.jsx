import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
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
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";
import { Briefcase, MapPin, Building2, FileText, Send } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [loadingCreateJob]);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#8b5cf6" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="pb-10">
      {/* Hero Title */}
      <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-center mb-10 text-white">
        Post a <span className="gradient-text-animated">Job</span>
      </h1>

      {/* Form Card */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {/* Job Title */}
          <div>
            <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              Job Title
            </label>
            <Input 
              placeholder="e.g. Senior Frontend Developer" 
              {...register("title")}
              className="glass-card border-purple-500/20 focus:border-purple-500/40 text-white placeholder:text-gray-500 h-12"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <span className="text-red-400">⚠</span> {errors.title.message}
              </p>
            )}
          </div>

          {/* Job Description */}
          <div>
            <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Job Description
            </label>
            <Textarea 
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              {...register("description")}
              className="glass-card border-purple-500/20 focus:border-purple-500/40 text-white placeholder:text-gray-500 min-h-32 resize-none"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <span className="text-red-400">⚠</span> {errors.description.message}
              </p>
            )}
          </div>

          {/* Location & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                Location
              </label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="glass-card border-purple-500/20 focus:border-purple-500/40 text-white h-12">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-purple-500/30 bg-[#1a0b2e]">
                      <SelectGroup>
                        {State.getStatesOfCountry("IN").map(({ name }) => (
                          <SelectItem 
                            key={name} 
                            value={name}
                            className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20"
                          >
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.location && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="text-red-400">⚠</span> {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                Company
              </label>
              <div className="flex gap-2">
                <Controller
                  name="company_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="glass-card border-purple-500/20 focus:border-purple-500/40 text-white h-12 flex-1">
                        <SelectValue placeholder="Select Company">
                          {field.value
                            ? companies?.find((com) => com.id === Number(field.value))
                                ?.name
                            : "Select Company"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="glass-card border-purple-500/30 bg-[#1a0b2e]">
                        <SelectGroup>
                          {companies?.map(({ name, id }) => (
                            <SelectItem 
                              key={name} 
                              value={id}
                              className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20"
                            >
                              {name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <AddCompanyDrawer fetchCompanies={fnCompanies} />
              </div>
              {errors.company_id && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="text-red-400">⚠</span> {errors.company_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Requirements Editor */}

<div>
  <label className="text-white text-sm font-semibold mb-2 block">
    Requirements (Markdown Supported)
  </label>
  <div className="rounded-xl overflow-hidden border border-purple-500/20" data-color-mode="dark">
    <Controller
      name="requirements"
      control={control}
      render={({ field }) => (
        <MDEditor 
          value={field.value} 
          onChange={field.onChange}
          preview="edit"
          height={300}
          visibleDragbar={false}
          textareaProps={{
            placeholder: "Enter job requirements in markdown format..."
          }}
          previewOptions={{
            className: "bg-transparent text-white"
          }}
          className="!bg-transparent !text-white"
        />
      )}
    />
  </div>
  {errors.requirements && (
    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
      <span className="text-red-400">⚠</span> {errors.requirements.message}
    </p>
  )}
</div>

          {/* Error Messages */}
          {errorCreateJob?.message && (
            <div className="glass-card border-red-500/30 bg-red-500/10 p-4 rounded-xl">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <span className="text-red-400">⚠</span> {errorCreateJob?.message}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loadingCreateJob && (
            <BarLoader width={"100%"} color="#8b5cf6" />
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="gradient-button h-14 text-lg font-semibold rounded-xl"
            disabled={loadingCreateJob}
          >
            <Send className="w-5 h-5 mr-2" />
            {loadingCreateJob ? "Posting..." : "Post Job"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;