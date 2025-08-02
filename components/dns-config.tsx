"use client";

import { useState } from "react";

interface DnsConfigProps {
  domain: string;
}

export default function DnsConfig({ domain }: DnsConfigProps) {
  const [checking, setChecking] = useState(false);
  const [dnsStatus, setDnsStatus] = useState<
    "pending" | "success" | "error" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";

  const checkDnsPropagation = async () => {
    setChecking(true);
    setDnsStatus(null);
    setErrorMessage("");

    try {
      const response = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${domain}&type=CNAME`,
        {
          headers: {
            Accept: "application/dns-json",
          },
        }
      );

      const data = await response.json();

      if (data.Answer && data.Answer.length > 0) {
        const cnameRecord = data.Answer.find(
          (record: { type: number }) => record.type === 5
        );
        if (cnameRecord) {
          const target = cnameRecord.data.replace(/\.$/, "");
          if (target === appDomain) {
            setDnsStatus("success");
          } else {
            setDnsStatus("error");
            setErrorMessage(`CNAME points to ${target}, expected ${appDomain}`);
          }
        } else {
          setDnsStatus("error");
          setErrorMessage("No CNAME record found");
        }
      } else {
        setDnsStatus("error");
        setErrorMessage("No DNS records found for this domain");
      }
    } catch {
      setDnsStatus("error");
      setErrorMessage("Failed to check DNS records");
    } finally {
      setChecking(false);
    }
  };

  const getStatusColor = () => {
    switch (dnsStatus) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (dnsStatus) {
      case "success":
        return "😼";
      case "error":
        return "😿";
      default:
        return "🔄";
    }
  };

  return (
    <div className="border rounded p-5 bg-gray-50 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">DNS Configuration</h3>
        <button
          onClick={checkDnsPropagation}
          disabled={checking}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {checking ? "Checking..." : "Check DNS"}
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Add this CNAME record to your DNS provider to point your domain to our
        app:
      </p>

      <div className="bg-white border rounded p-3 font-mono text-sm">
        <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-gray-500 mb-2">
          <span>Type</span>
          <span>Name</span>
          <span>Value</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <span>CNAME</span>
          <span>{domain}</span>
          <span>{appDomain}</span>
        </div>
      </div>

      {dnsStatus && (
        <div className={`border rounded p-3 text-sm ${getStatusColor()}`}>
          <div className="flex items-center gap-2">
            <span>{getStatusIcon()}</span>
            <span className="font-medium">
              {dnsStatus === "success"
                ? "DNS Configuration Valid"
                : "DNS Configuration Issue"}
            </span>
          </div>
          {errorMessage && <p className="mt-1 text-xs">{errorMessage}</p>}
        </div>
      )}

      <p className="text-xs text-gray-500">
        DNS changes may take up to 24 hours to propagate globally.
      </p>
    </div>
  );
}
