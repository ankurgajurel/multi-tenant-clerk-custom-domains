"use client";

import { useState } from "react";
import { updateDomain } from "@/lib/actions";
import DnsConfig from "./dns-config";

interface DomainProps {
  initialDomain?: string;
}

export default function Domain({ initialDomain = "" }: DomainProps) {
  const [domain, setDomain] = useState(initialDomain);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updateDomain(domain);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border rounded p-5 w-fit"
      >
        <div className="grid gap-1">
          <label
            htmlFor="domain"
            className="block text-sm font-medium text-gray-700"
          >
            Domain
          </label>
          <input
            type="text"
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="yourdomain.com"
            className="outline px-5 py-1 rounded-sm w-full"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-1 outline rounded-sm text-xs bg-gray-100 hover:bg-gray-200"
          >
            {submitting ? "Saving..." : "Save Domain"}
          </button>
          {domain && (
            <a
              href={domain.startsWith("http") ? domain : `https://${domain}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="px-4 py-1 outline rounded-sm text-xs bg-gray-100 hover:bg-gray-200">
                view page
              </div>
            </a>
          )}
        </div>
      </form>

      {domain && <DnsConfig domain={domain} />}
    </div>
  );
}
