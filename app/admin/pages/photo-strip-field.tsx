"use client";

import { useState } from "react";
import { Field, Input } from "@/components/admin/field";

export function PhotoStripField({ initial }: { initial: string[] }) {
  const seed = [0, 1, 2, 3].map((i) => initial[i] ?? "");
  const [urls, setUrls] = useState<string[]>(seed);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {urls.map((u, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Field label={`Foto ${i + 1} — URL`}>
            <Input
              name={`photo_${i}`}
              value={u}
              onChange={(e) =>
                setUrls((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))
              }
              placeholder="https://… (URL pubblico)"
            />
          </Field>
          {u && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={u}
              alt=""
              className="h-32 w-full object-cover border border-[var(--color-line)]"
            />
          )}
        </div>
      ))}
    </div>
  );
}
