import React from 'react';

export function Stats(props) {
  return (
    <dl class="xx-mt-10 xx-grid xx-grid-cols-2 xx-gap-4">
      {props.walletStats.map((stat) => (
        <div class="xx-overflow-hidden xx-rounded-lg xx-bg-grey-200 xx-px-2.5 xx-p-3 xx-border xx-border-slate-300">
          <dt
            key={stat.stat}
            class="xx-truncate xx-text-sm xx-font-medium xx-text-slate-400"
          >
            {stat.label}
          </dt>
          <dd className="xx-mt-0.5 xx-text-2xl xx-text-slate-200 xx-font-semibold xx-tracking-tight">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
