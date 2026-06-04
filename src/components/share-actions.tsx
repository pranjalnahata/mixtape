"use client";

import * as React from "react";

export function ShareActions({
  publicUrl,
}: {
  publicUrl: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function handleCopy() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function handleShare() {
    if (!navigator.share) {
      return;
    }

    await navigator.share({
      title: "A mixtape for you",
      text: "I made you a little mixtape.",
      url: publicUrl,
    });
  }

  return (
    <div className="paper-panel rounded-[1.8rem] p-5 shadow-frame">
      <p className="pixel-heading text-sm text-[var(--accent)]">Share This Mixtape</p>
      <p className="mt-4 break-all text-base leading-7 text-[var(--muted)]">{publicUrl}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleCopy}
          className="button-primary rounded-2xl border border-black/60 px-6 py-4 text-base font-semibold"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
        {canShare ? (
          <button
            type="button"
            onClick={() => void handleShare()}
            className="button-secondary rounded-2xl border border-black/15 px-6 py-4 text-base font-semibold"
          >
            Share sheet
          </button>
        ) : null}
      </div>
    </div>
  );
}
