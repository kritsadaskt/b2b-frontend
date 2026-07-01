'use client';

import { useState } from 'react';
import { CopyIcon } from 'lucide-react';

const NON_COPYABLE_VALUES = new Set(['—', 'N/A', '']);

export default function CopyableText({
  value,
  className = '',
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const trimmed = value.trim();
  const canCopy = trimmed.length > 0 && !NON_COPYABLE_VALUES.has(trimmed);

  const handleCopy = async () => {
    if (!canCopy) return;
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!canCopy) {
    return <span className={`text-sm text-gray-900 ${className}`}>{value}</span>;
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`text-sm text-left transition-colors rounded px-0.5 -mx-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#123F6D] flex items-center gap-2 ${
        copied
          ? 'text-green-700 font-medium'
          : 'text-gray-900 hover:text-[#123F6D]'
      } ${className}`}
      title={copied ? 'คัดลอกแล้ว' : 'คลิกเพื่อคัดลอก'}
    >
      {copied ? 'คัดลอกแล้ว' : value}
      <CopyIcon className="h-3 w-3" />
    </button>
  );
}
