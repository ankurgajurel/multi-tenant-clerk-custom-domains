import { clerkClient } from "@clerk/nextjs/server";
import { getUserByDomain } from "@/lib/actions";
import { notFound } from "next/navigation";

interface DomainPageProps {
  params: Promise<{ domain: string }>;
}

export default async function DomainPage({ params }: DomainPageProps) {
  const { domain } = await params;
  
  // Get user ID from domain
  const userId = await getUserByDomain(domain);
  
  if (!userId) {
    notFound();
  }

  // Get user details from Clerk
  const user = await clerkClient().users.getUser(userId);

  if (!user) {
    notFound();
  }

  const userName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.username || user.emailAddresses[0]?.emailAddress || "User";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt={userName}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {userName}'s Profile
          </h1>
          <p className="text-gray-600">
            Welcome to {domain}
          </p>
        </div>
        
        <div className="border-t pt-6">
          <p className="text-sm text-gray-500">
            This is a custom domain powered by our multi-tenant platform
          </p>
        </div>
      </div>
    </div>
  );
}