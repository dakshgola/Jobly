import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { TestExternalFetch } from "@/components/test-external-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { 
  Briefcase, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  X,
  GraduationCap,
  MapPin,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getResumeFeedback } from "@/services/aiResumeFeedback";
import { getCandidateProfile, upsertCandidateProfile } from "@/api/apiCandidateProfile";
import { extractProfileFromResume } from "@/services/aiProfileExtract";
import { extractTextFromPdf, extractTextFromDocx } from "@/utils/textExtractor";
import { calculateCompleteness, getMissingItems } from "@/utils/completeness";
import useFetch from "@/hooks/use-fetch";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  const isCandidate = user?.unsafeMetadata?.role !== "recruiter";

  // Profile data state
  const {
    loading: loadingProfile,
    data: profileData,
    fn: fnGetProfile,
  } = useFetch(getCandidateProfile, {
    user_id: user?.id,
  });

  const {
    loading: loadingUpsertProfile,
    fn: fnUpsertProfile,
  } = useFetch(upsertCandidateProfile);

  const [feedback, setFeedback] = useState(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [extractingStep, setExtractingStep] = useState(null);

  // Inline editing states
  const [editingSection, setEditingSection] = useState(null); // 'info' | 'summary' | 'skills' | 'education' | 'experience' | null
  const [infoForm, setInfoForm] = useState({ full_name: "", headline: "", location: "" });
  const [summaryForm, setSummaryForm] = useState("");
  const [skillsForm, setSkillsForm] = useState("");
  const [eduForm, setEduForm] = useState({ institution: "", degree: "", start_year: "", end_year: "" });
  const [expForm, setExpForm] = useState({ company: "", role: "", start_date: "", end_date: "", description: "" });

  useEffect(() => {
    if (isLoaded && user?.id && isCandidate) {
      fnGetProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user, isCandidate]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#8b5cf6" />;
  }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const fileExt = file.name.split(".").pop().toLowerCase();
    if (fileExt !== "pdf" && fileExt !== "docx") {
      showToast("Only PDF and DOCX files are allowed", "error");
      return;
    }

    setExtractingStep("Reading resume content...");
    try {
      let text = "";
      if (fileExt === "pdf") {
        text = await extractTextFromPdf(file);
      } else {
        text = await extractTextFromDocx(file);
      }

      if (!text || text.trim().length === 0) {
        throw new Error("No text content could be extracted from the file.");
      }

      setExtractingStep("Analyzing profile details with Gemini AI...");
      const extractedProfile = await extractProfileFromResume(text);

      setExtractingStep("Syncing profile with database...");
      
      const parsedEducation = Array.isArray(extractedProfile.education) ? extractedProfile.education : [];
      const parsedExperience = Array.isArray(extractedProfile.experience) ? extractedProfile.experience : [];
      const parsedSkills = Array.isArray(extractedProfile.skills) ? extractedProfile.skills : [];
      const parsedCertifications = Array.isArray(extractedProfile.certifications) ? extractedProfile.certifications : [];

      await fnUpsertProfile({
        profileData: {
          user_id: user.id,
          full_name: extractedProfile.full_name || user.fullName || "",
          headline: extractedProfile.headline || "",
          location: extractedProfile.location || "",
          summary: extractedProfile.summary || "",
          education: parsedEducation,
          experience: parsedExperience,
          skills: parsedSkills,
          certifications: parsedCertifications,
          profile_completeness: 0 // Will be automatically calculated on the server layer
        },
        resumeFile: file
      });

      showToast("Profile successfully extracted and synced!");
      fnGetProfile();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to process resume", "error");
    } finally {
      setExtractingStep(null);
    }
  };

  const handleStartEdit = (section) => {
    setEditingSection(section);
    if (section === "info") {
      setInfoForm({
        full_name: profileData?.full_name || user?.fullName || "",
        headline: profileData?.headline || "",
        location: profileData?.location || ""
      });
    } else if (section === "summary") {
      setSummaryForm(profileData?.summary || "");
    } else if (section === "skills") {
      setSkillsForm(profileData?.skills?.join(", ") || "");
    } else if (section === "education") {
      setEduForm({ institution: "", degree: "", start_year: "", end_year: "" });
    } else if (section === "experience") {
      setExpForm({ company: "", role: "", start_date: "", end_date: "", description: "" });
    }
  };

  const handleSaveInlineEdit = async (e) => {
    e.preventDefault();

    try {
      let updatedProfile = {
        user_id: user.id,
        full_name: profileData?.full_name || user.fullName || "",
        headline: profileData?.headline || "",
        location: profileData?.location || "",
        summary: profileData?.summary || "",
        education: Array.isArray(profileData?.education) ? profileData.education : [],
        experience: Array.isArray(profileData?.experience) ? profileData.experience : [],
        skills: Array.isArray(profileData?.skills) ? profileData.skills : [],
        certifications: Array.isArray(profileData?.certifications) ? profileData.certifications : [],
        resume_url: profileData?.resume_url || null
      };

      if (editingSection === "info") {
        updatedProfile.full_name = infoForm.full_name;
        updatedProfile.headline = infoForm.headline;
        updatedProfile.location = infoForm.location;
      } else if (editingSection === "summary") {
        updatedProfile.summary = summaryForm;
      } else if (editingSection === "skills") {
        updatedProfile.skills = skillsForm.split(",")
          .map(s => s.trim())
          .filter(Boolean);
      } else if (editingSection === "education") {
        if (!eduForm.institution || !eduForm.degree) {
          showToast("Institution and Degree are required", "error");
          return;
        }
        updatedProfile.education = [...updatedProfile.education, eduForm];
      } else if (editingSection === "experience") {
        if (!expForm.company || !expForm.role) {
          showToast("Company and Role are required", "error");
          return;
        }
        updatedProfile.experience = [...updatedProfile.experience, expForm];
      }

      await fnUpsertProfile({
        profileData: updatedProfile
      });

      showToast("Profile details updated successfully!");
      setEditingSection(null);
      fnGetProfile();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to update profile", "error");
    }
  };

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

      {/* Profile Completeness Alert Banner */}
      {isCandidate && profileData && profileData.profile_completeness < 100 && (
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
            <p className="text-sm font-medium">
              Complete your profile — a complete profile improves match accuracy.
            </p>
          </div>
        </div>
      )}

      {isCandidate && (
        <div className="max-w-7xl mx-auto mb-10 px-4 flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Left Column: AI Profile Feedback Card */}
            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[#0B0F14]/40 relative overflow-hidden group shadow-sm transition-all duration-300 hover:bg-[#0B0F14]/80 flex flex-col justify-between min-h-[350px]">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-[var(--accent-primary)] flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5" /> AI Profile Feedback
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-6">
                  Get actionable advice from Gemini AI on how to improve your hiring potential.
                </p>

                {feedback && (
                  <div className="grid grid-cols-1 gap-4 text-left max-h-[350px] overflow-y-auto pr-1">
                    {/* Strengths */}
                    <div className="flex flex-col p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                       <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2 text-sm">
                         <TrendingUp className="w-4 h-4" /> Strong Points
                       </h4>
                       <ul className="space-y-2">
                         {feedback.strengths?.map((item, i) => (
                           <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                             <span className="text-green-500 mt-0.5">•</span> {item}
                           </li>
                         ))}
                       </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="flex flex-col p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                       <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2 text-sm">
                         <AlertTriangle className="w-4 h-4" /> Missing Links
                       </h4>
                       <ul className="space-y-2">
                         {feedback.weaknesses?.map((item, i) => (
                           <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                             <span className="text-red-500 mt-0.5">•</span> {item}
                           </li>
                         ))}
                       </ul>
                    </div>

                    {/* Suggestions */}
                    <div className="flex flex-col p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                       <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2 text-sm">
                         <Lightbulb className="w-4 h-4" /> Next Steps
                       </h4>
                       <ul className="space-y-2">
                         {feedback.suggestions?.map((item, i) => (
                           <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                             <span className="text-blue-500 mt-0.5">→</span> {item}
                           </li>
                         ))}
                       </ul>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative z-10 mt-6 pt-4 border-t border-[var(--border-color)] flex justify-end">
                {!feedback && !isFeedbackLoading && (
                  <Button onClick={handleGetFeedback} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm transition-transform hover:scale-[1.02] border-0">
                    <Sparkles className="w-4 h-4 mr-2" /> Get Expert Feedback
                  </Button>
                )}

                {isFeedbackLoading && (
                   <div className="flex items-center gap-3 text-purple-400 font-medium text-sm">
                     <Loader2 className="animate-spin w-4 h-4" />
                     Analyzing your profile...
                   </div>
                )}
              </div>
            </div>

            {/* Right Column: Stacked AI Resume Extractor and Complete Profile Cards */}
            <div className="flex flex-col gap-6 w-full">
              
              {/* Card 1: AI Resume Extractor */}
              <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[#0B0F14]/40 relative overflow-hidden group shadow-sm transition-all duration-300 hover:bg-[#0B0F14]/80 flex flex-col justify-between min-h-[300px]">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--accent-primary)] flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5" /> AI Resume Extractor
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm">
                        Upload your resume to extract details and build your premium candidate profile.
                      </p>
                    </div>
                    {profileData && (
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400 font-semibold mb-1">Completeness</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${profileData.profile_completeness || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-blue-400">{profileData.profile_completeness || 0}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {loadingProfile ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <Loader2 className="animate-spin w-8 h-8 text-blue-400" />
                      <span className="text-sm text-gray-400">Loading profile data...</span>
                    </div>
                  ) : extractingStep ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                      <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
                      <div className="text-center">
                        <p className="text-blue-400 font-semibold text-sm animate-pulse">{extractingStep}</p>
                        <p className="text-xs text-gray-500 mt-1">This might take a few seconds...</p>
                      </div>
                    </div>
                  ) : profileData ? (
                    <div className="mt-4 space-y-4 text-left max-h-[350px] overflow-y-auto pr-1">
                      <div className="flex justify-between items-start border-b border-[var(--border-color)] pb-3">
                        <div>
                          <h4 className="text-lg font-bold text-white">{profileData.full_name || user.fullName}</h4>
                          <p className="text-blue-400 text-sm">{profileData.headline || "No Headline (Add via Resume)"}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5" /> {profileData.location || "Location not set"}
                          </p>
                        </div>
                        {profileData.resume_url && (
                          <a 
                            href={profileData.resume_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all font-medium flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" /> Resume
                          </a>
                        )}
                      </div>

                      {profileData.summary && (
                        <div>
                          <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider block mb-1">Professional Summary</span>
                          <p className="text-sm text-gray-300 leading-relaxed bg-black/20 p-3 rounded-xl border border-[var(--border-color)]">
                            {profileData.summary}
                          </p>
                        </div>
                      )}

                      {profileData.skills && profileData.skills.length > 0 && (
                        <div>
                          <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider block mb-1">Key Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            {profileData.skills.map((skill, index) => (
                              <span 
                                key={index} 
                                className="text-xs px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--border-color)]">
                        <div>
                          <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider flex items-center gap-1 mb-2">
                            <GraduationCap className="w-4 h-4 text-blue-400" /> Education
                          </span>
                          {profileData.education && profileData.education.length > 0 ? (
                            <div className="space-y-2">
                              {profileData.education.slice(0, 2).map((edu, i) => (
                                <div key={i} className="text-xs bg-black/10 p-2 rounded border border-[var(--border-color)]">
                                  <p className="font-bold text-gray-200 line-clamp-1">{edu.degree}</p>
                                  <p className="text-gray-400 line-clamp-1">{edu.institution}</p>
                                  <p className="text-[10px] text-gray-500">{edu.start_year || ""} - {edu.end_year || "Present"}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500">Not specified</p>
                          )}
                        </div>

                        <div>
                          <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider flex items-center gap-1 mb-2">
                            <Briefcase className="w-4 h-4 text-purple-400" /> Experience
                          </span>
                          {profileData.experience && profileData.experience.length > 0 ? (
                            <div className="space-y-2">
                              {profileData.experience.slice(0, 2).map((exp, i) => (
                                <div key={i} className="text-xs bg-black/10 p-2 rounded border border-[var(--border-color)]">
                                  <p className="font-bold text-gray-200 line-clamp-1">{exp.role}</p>
                                  <p className="text-gray-400 line-clamp-1">{exp.company}</p>
                                  <p className="text-[10px] text-gray-500">{exp.start_date || ""} - {exp.end_date || "Present"}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500">Not specified</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] hover:border-blue-500/50 bg-black/20 hover:bg-blue-500/5 rounded-2xl p-8 cursor-pointer transition-all group duration-300">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center transition-all duration-300">
                            <Upload className="w-6 h-6 text-blue-400" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-white">Click or drag resume here</p>
                            <p className="text-xs text-gray-500 mt-1">PDF or DOCX files up to 5MB</p>
                          </div>
                        </div>
                        <input 
                          type="file" 
                          accept=".pdf, .docx" 
                          className="hidden" 
                          onChange={handleResumeUpload}
                          disabled={loadingUpsertProfile}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {profileData && !extractingStep && (
                  <div className="relative z-10 mt-6 pt-4 border-t border-[var(--border-color)] flex justify-between items-center">
                    <span className="text-[10px] text-gray-500">
                      Last updated: {profileData.created_at ? new Date(profileData.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                    </span>
                    <label className="text-xs font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer transition-transform hover:scale-[1.02] inline-block shadow-sm">
                      Re-extract Resume
                      <input 
                        type="file" 
                        accept=".pdf, .docx" 
                        className="hidden" 
                        onChange={handleResumeUpload}
                        disabled={loadingUpsertProfile}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Card 2: Complete Your Profile */}
              {profileData && (
                <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[#0B0F14]/40 relative overflow-hidden group shadow-sm transition-all duration-300 hover:bg-[#0B0F14]/80 flex flex-col justify-between">
                  <div className="relative z-10 w-full text-left">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" /> Complete Your Profile
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm mb-4">
                      Fill in your missing profile details to reach 100% and get better job matches.
                    </p>

                    {/* Progress bar */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-gray-400">Profile Strength</span>
                        <span className="text-blue-400">{profileData.profile_completeness || 0}%</span>
                      </div>
                      <Progress value={profileData.profile_completeness || 0} />
                    </div>

                    {/* Inline Editors or Missing List */}
                    {editingSection ? (
                      <form onSubmit={handleSaveInlineEdit} className="space-y-4 bg-black/35 p-4 rounded-xl border border-[var(--border-color)] animate-in fade-in duration-300">
                        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2 mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            Edit {editingSection === "info" ? "Basic Info" : editingSection}
                          </span>
                          <button type="button" onClick={() => setEditingSection(null)} className="text-gray-400 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {editingSection === "info" && (
                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] text-gray-400 font-semibold block mb-1">Full Name</label>
                              <input 
                                type="text" 
                                value={infoForm.full_name} 
                                onChange={(e) => setInfoForm({...infoForm, full_name: e.target.value})}
                                className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 font-semibold block mb-1">Professional Headline</label>
                              <input 
                                type="text" 
                                value={infoForm.headline} 
                                placeholder="e.g. Senior Frontend Developer"
                                onChange={(e) => setInfoForm({...infoForm, headline: e.target.value})}
                                className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 font-semibold block mb-1">Location</label>
                              <input 
                                type="text" 
                                value={infoForm.location} 
                                placeholder="e.g. Mumbai, India"
                                onChange={(e) => setInfoForm({...infoForm, location: e.target.value})}
                                className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none"
                              />
                            </div>
                          </div>
                        )}

                        {editingSection === "summary" && (
                          <div>
                            <label className="text-[10px] text-gray-400 font-semibold block mb-1">Summary</label>
                            <textarea 
                              value={summaryForm} 
                              rows={4}
                              placeholder="Write a brief professional summary about yourself..."
                              onChange={(e) => setSummaryForm(e.target.value)}
                              className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none resize-none"
                            />
                          </div>
                        )}

                        {editingSection === "skills" && (
                          <div>
                            <label className="text-[10px] text-gray-400 font-semibold block mb-1">Skills (Comma-separated)</label>
                            <input 
                              type="text" 
                              value={skillsForm} 
                              placeholder="React, JavaScript, CSS, HTML5"
                              onChange={(e) => setSkillsForm(e.target.value)}
                              className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none"
                            />
                          </div>
                        )}

                        {editingSection === "education" && (
                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] text-gray-400 font-semibold block mb-1">Institution</label>
                              <input 
                                type="text" 
                                value={eduForm.institution} 
                                placeholder="e.g. Stanford University"
                                onChange={(e) => setEduForm({...eduForm, institution: e.target.value})}
                                className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 font-semibold block mb-1">Degree</label>
                              <input 
                                type="text" 
                                value={eduForm.degree} 
                                placeholder="e.g. Master of Computer Science"
                                onChange={(e) => setEduForm({...eduForm, degree: e.target.value})}
                                className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] text-gray-400 font-semibold block mb-1">Start Year</label>
                                <input 
                                  type="text" 
                                  value={eduForm.start_year} 
                                  placeholder="e.g. 2018"
                                  onChange={(e) => setEduForm({...eduForm, start_year: e.target.value})}
                                  className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-gray-400 font-semibold block mb-1">End Year</label>
                                <input 
                                  type="text" 
                                  value={eduForm.end_year} 
                                  placeholder="e.g. 2020 or Present"
                                  onChange={(e) => setEduForm({...eduForm, end_year: e.target.value})}
                                  className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {editingSection === "experience" && (
                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] text-gray-400 font-semibold block mb-1">Company</label>
                              <input 
                                type="text" 
                                value={expForm.company} 
                                placeholder="e.g. Google"
                                onChange={(e) => setExpForm({...expForm, company: e.target.value})}
                                className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 font-semibold block mb-1">Role</label>
                              <input 
                                type="text" 
                                value={expForm.role} 
                                placeholder="e.g. Senior Product Designer"
                                onChange={(e) => setExpForm({...expForm, role: e.target.value})}
                                className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] text-gray-400 font-semibold block mb-1">Start Date</label>
                                <input 
                                  type="text" 
                                  value={expForm.start_date} 
                                  placeholder="e.g. Jan 2021"
                                  onChange={(e) => setExpForm({...expForm, start_date: e.target.value})}
                                  className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-gray-400 font-semibold block mb-1">End Date</label>
                                <input 
                                  type="text" 
                                  value={expForm.end_date} 
                                  placeholder="e.g. Present"
                                  onChange={(e) => setExpForm({...expForm, end_date: e.target.value})}
                                  className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 font-semibold block mb-1">Description</label>
                              <textarea 
                                value={expForm.description} 
                                rows={3}
                                placeholder="Describe your achievements and key responsibilities..."
                                onChange={(e) => setExpForm({...expForm, description: e.target.value})}
                                className="w-full text-sm bg-black/40 border border-[var(--border-color)] rounded-lg p-2.5 text-white focus:border-blue-500/50 outline-none resize-none"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 justify-end pt-2">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => setEditingSection(null)} 
                            className="text-gray-400 hover:text-white text-xs h-9 px-3 rounded-lg border border-[var(--border-color)]"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={loadingUpsertProfile} 
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 px-4 rounded-lg shadow-sm border-0"
                          >
                            {loadingUpsertProfile ? (
                              <span className="flex items-center gap-1.5">
                                <Loader2 className="animate-spin w-3.5 h-3.5" /> Saving...
                              </span>
                            ) : "Save"}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-3">
                        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider block mb-2">Pending Items</span>
                        {getMissingItems(profileData).length === 0 ? (
                          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-center animate-in fade-in">
                            <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <p className="text-sm font-bold text-white">Your profile is 100% complete!</p>
                            <p className="text-xs text-gray-400 mt-1">Excellent! Gemini can now calculate job matches with maximum precision.</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {getMissingItems(profileData).map((item) => (
                              <div key={item.key} className="flex justify-between items-center p-3 rounded-xl bg-black/25 border border-[var(--border-color)]">
                                <span className="text-xs text-gray-300 font-medium flex items-center gap-2">
                                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                                  {item.label}
                                </span>
                                {item.key !== "resume" ? (
                                  <button 
                                    onClick={() => handleStartEdit(item.key)}
                                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all"
                                  >
                                    Edit
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-gray-400 italic">Upload resume above</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Test Integration Pipeline */}
      <div className="max-w-7xl mx-auto mb-8 px-4">
        <TestExternalFetch />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {isCandidate ? (
          <CreatedApplications />
        ) : (
          <CreatedJobs />
        )}
      </div>

      {/* Sleek Custom Glassmorphic Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
          toast.type === "error" 
            ? "bg-red-500/10 border-red-500/20 text-red-200" 
            : "bg-green-500/10 border-green-500/20 text-green-200"
        }`}>
          {toast.type === "error" ? (
            <XCircle className="w-5 h-5 text-red-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MyJobs;