"use client";

import { Button } from "@/components/ui/button";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";

export default function Header({ onAddShowClick }) {
  const { isSignedIn, user } = useUser();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50">
      <div className="px-6 sm:px-8 lg:px-12 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              CoinShows
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
              Discover coin shows nationwide.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              Browse
            </a>
            <a
              href="#"
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              Events
            </a>
            <a
              href="#"
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              About
            </a>

            <ThemeToggle />

            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Button
                  size="sm"
                  onClick={onAddShowClick}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 shadow-md"
                >
                  Add Show
                </Button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Welcome,{" "}
                    {user?.firstName ||
                      user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
                  </span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
