import JobCard from "./job-card";
import { seedJobs } from "@/data/seedJobs";

const FloatingJobCards = () => {
  // Use a subset of seed jobs for the floating animation
  const topJobs = seedJobs.slice(0, 3);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none hidden lg:block">
      {/* Top Left Card */}
      <div className="absolute top-[10%] left-[5%] animate-float scale-75 opacity-90">
        <div className="bg-[var(--card-bg)]/80 backdrop-blur border border-[var(--border-color)] rounded-xl shadow-2xl pointer-events-none">
          <JobCard job={topJobs[0]} isMyJob={false} />
        </div>
      </div>

      {/* Bottom Right Card */}
      <div className="absolute top-[50%] right-[2%] animate-float-delayed scale-[0.65] opacity-80">
        <div className="bg-[var(--card-bg)]/80 backdrop-blur border border-[var(--border-color)] rounded-xl shadow-2xl pointer-events-none">
          <JobCard job={topJobs[1]} isMyJob={false} />
        </div>
      </div>

      {/* Bottom Left Card */}
      <div className="absolute bottom-[-10%] left-[15%] animate-float scale-[0.6] opacity-70" style={{ animationDelay: '1.5s' }}>
        <div className="bg-[var(--card-bg)]/80 backdrop-blur border border-[var(--border-color)] rounded-xl shadow-2xl pointer-events-none">
          <JobCard job={topJobs[2]} isMyJob={false} />
        </div>
      </div>
    </div>
  );
};

export default FloatingJobCards;
