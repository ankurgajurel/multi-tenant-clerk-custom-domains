import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="px-5 py-3 max-w-5xl mx-auto flex justify-between">
      <span>Multi Tenant Sample</span>
      <div>
        <SignedOut>
          <SignInButton mode="modal" fallbackRedirectUrl="/app">
            <button className="px-4 py-1 outline rounded-sm text-xs bg-gray-100 hover:bg-gray-200">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
