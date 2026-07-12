import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "./theme-provider";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);

  const [search, setSearch] = useSearchParams();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <nav className="relative py-4 sm:py-6 flex justify-between items-center navbar px-4 sm:px-6 rounded-xl sm:rounded-2xl mb-6 sm:mb-8">
        <Link to="/" className="transition-transform hover:scale-105 z-10 w-24 sm:w-32">
          <img src="/logo.png" className="h-12 sm:h-16" alt="Jobly Logo" />
        </Link>
        
        {/* Centered Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass border border-[var(--border-color)] text-[10px] sm:text-sm shadow-sm z-10 pointer-events-none whitespace-nowrap">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--accent-primary)]" />
          <span className="text-[var(--text-secondary)] font-medium">Find jobs instantly.</span>
        </div>

        <div className="flex gap-3 sm:gap-4 items-center z-10 justify-end w-24 sm:w-32">
          <SignedOut>
            <Button
              variant="outline"
              onClick={() => setShowSignIn(true)}
              className="glass text-[var(--text-primary)] border-[var(--border-color)] hover:border-blue-500/50 hover:bg-blue-500/10 text-sm sm:text-base px-4 sm:px-6 py-2"
            >
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 sm:w-10 sm:h-10 ring-2 ring-blue-500/30",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          style={{ zIndex: 999999 }}
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/jobs"
            fallbackRedirectUrl="/jobs"
          />
        </div>
      )}
    </>
  );
};

export default Header;