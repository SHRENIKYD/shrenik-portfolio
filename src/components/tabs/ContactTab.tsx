"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/resume";
import { withBasePath } from "@/lib/basePath";
import Gutter from "@/components/Gutter";
import { Mail, Phone, Download, Copy, Check } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";

function CopyableRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable, ignore */
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#1c2621] bg-[#0d1310] px-4 py-3 hover:border-[#39ff8e]/40 transition-colors">
      <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 min-w-0">
        <Icon size={16} className="text-[#39ff8e] shrink-0" />
        <div className="min-w-0">
          <div className="text-[11px] font-mono uppercase tracking-wide text-[#6b7a72]">
            {label}
          </div>
          <div className="text-sm text-[#c9d1d9] truncate">{value}</div>
        </div>
      </a>
      <button
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="shrink-0 rounded-md p-1.5 text-[#6b7a72] hover:text-[#39ff8e] hover:bg-[#132018] transition-colors"
      >
        {copied ? <Check size={14} className="text-[#39ff8e]" /> : <Copy size={14} />}
      </button>
    </div>
  );
}

export default function ContactTab() {
  return (
    <div className="flex min-h-full">
      <Gutter />
      <div className="flex-1 min-w-0 min-h-full px-4 sm:px-8 py-8 max-w-3xl bg-[#0a0e0c]">
        <div className="font-mono text-sm text-[#6b7a72] mb-6">
          <span className="text-[#556058]">01</span> // #!/usr/bin/env bash
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-[#1c2621] bg-[#0d1310] p-4 sm:p-6 font-mono text-sm mb-8"
        >
          <div className="text-[#556058]">$ cat contact.txt</div>
          <div className="mt-2 text-[#c9d1d9] leading-relaxed">
            Open to interesting conversations, collaborations, and problems worth
            solving. Reach out any of the ways below — I read everything.
          </div>
          <div className="mt-3 text-[#556058]">
            $ echo &quot;response time&quot;{" "}
            <span className="text-[#39ff8e]">→ usually within a day</span>
          </div>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2">
          <CopyableRow
            icon={Mail}
            label="email"
            value={profile.email}
            href={`mailto:${profile.email}`}
          />
          <CopyableRow
            icon={Phone}
            label="phone"
            value={profile.phone}
            href={`tel:${profile.phone.replace(/\s/g, "")}`}
          />
          <CopyableRow
            icon={LinkedinIcon}
            label="linkedin"
            value="linkedin.com/in/shrenik-yd"
            href={profile.linkedin}
          />
          <CopyableRow
            icon={GithubIcon}
            label="github"
            value={`github.com/${profile.github.split("/").pop()}`}
            href={profile.github}
          />
        </div>

        <a
          href={withBasePath(`/${profile.resumeFile}`)}
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-[#39ff8e]/40 bg-[#39ff8e]/10 px-4 py-3 font-mono text-sm text-[#39ff8e] hover:bg-[#39ff8e]/20 transition-colors"
        >
          <Download size={16} />
          ./download_resume.pdf
        </a>
      </div>
    </div>
  );
}
