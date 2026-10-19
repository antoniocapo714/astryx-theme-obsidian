import {useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type RefObject} from 'react';
import {Text} from '@astryxdesign/core/Text';
import {Table} from '@astryxdesign/core/Table';

/**
 * Three reference charts drawn straight in SVG against the theme's tokens, so
 * any chart library can copy the same decisions:
 *   - marks carry the data colours; every word uses text tokens;
 *   - columns ≤ 24px with a 4px rounded end, square at the baseline;
 *   - 2px lines, 8px end dots with a 2px ring in the surface colour;
 *   - hairline solid gridlines in the divider token;
 *   - a tooltip on hover and keyboard focus, and a table behind every chart.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const compact = (n: number) => (n >= 1000 ? `${+(n / 1000).toFixed(1)}K` : `${n}`);

function niceMax(max: number) {
  const step = 10 ** Math.floor(Math.log10(max));
  return Math.ceil(max / step) * step;
}

/**
 * Charts are drawn at the pixel width of their container, never scaled: a
 * scaled SVG scales its text too, and tick labels fell to 8px in a narrow card.
 */
function useWidth(ref: RefObject<HTMLDivElement | null>, fallback = 640) {
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.floor(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

/** Sits beside the point it reads, and flips to the other side near the right edge. */
function Tooltip({x, width, children}: {x: number; width: number; children: ReactNode}) {
  const flip = x > width * 0.62;
  return (
    <div className={flip ? 'chart-tooltip is-flipped' : 'chart-tooltip'} style={{left: x}} role="status">
      {children}
    </div>
  );
}

function TableView({columns, rows}: {columns: {key: string; header: string}[]; rows: Record<string, unknown>[]}) {
  return (
    <details className="chart-table">
      <summary>
        <Text type="supporting">Show as a table</Text>
      </summary>
      <Table data={rows} idKey={columns[0].key} columns={columns} density="compact" />
    </details>
  );
}

// ---------------------------------------------------------------------------
// Columns: one series, so no legend — the title names it.

const SIGNUPS = [820, 940, 1010, 980, 1180, 1320, 1290, 1410, 1560, 1490, 1710, 1880];

export function ColumnChart() {
  const plot = useRef<HTMLDivElement>(null);
  const W = useWidth(plot), H = 240, pad = {t: 24, r: 8, b: 28, l: 40};
  const max = niceMax(Math.max(...SIGNUPS));
  const band = (W - pad.l - pad.r) / SIGNUPS.length;
  const bar = Math.min(24, band * 0.6);
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max];
  const peak = SIGNUPS.indexOf(Math.max(...SIGNUPS));
  const [hover, setHover] = useState<number | null>(null);

  return (
    <figure className="chart">
      <figcaption>
        <Text type="label">New sign-ups per month</Text>
      </figcaption>
      <div className="chart-plot" ref={plot}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Column chart of new sign-ups per month">
          {ticks.map((v) => (
            <g key={v}>
              <line className="chart-grid" x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} />
              <text className="chart-tick" x={pad.l - 8} y={y(v)} textAnchor="end" dominantBaseline="middle">
                {compact(v)}
              </text>
            </g>
          ))}
          {SIGNUPS.map((v, i) => {
            const cx = pad.l + band * i + band / 2, top = y(v), base = y(0), r = 4;
            return (
              <g
                key={i}
                tabIndex={0}
                aria-label={`${MONTHS[i]}: ${v.toLocaleString()} sign-ups`}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="chart-hit">
                {/* The hit target is the whole band, not the painted column. */}
                <rect x={cx - band / 2} y={pad.t} width={band} height={base - pad.t} fill="transparent" />
                <path
                  className={hover === i ? 'chart-mark is-hover' : 'chart-mark'}
                  fill="var(--color-data-categorical-blue)"
                  d={`M${cx - bar / 2},${base} V${top + r} Q${cx - bar / 2},${top} ${cx - bar / 2 + r},${top} H${cx + bar / 2 - r} Q${cx + bar / 2},${top} ${cx + bar / 2},${top + r} V${base} Z`}
                />
                <text className="chart-tick" x={cx} y={H - 8} textAnchor="middle">
                  {MONTHS[i]}
                </text>
                {i === peak && (
                  <text className="chart-value" x={cx} y={top - 8} textAnchor="middle">
                    {v.toLocaleString()}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <Tooltip x={pad.l + band * hover + band / 2} width={W}>
            <strong>{SIGNUPS[hover].toLocaleString()}</strong>
            <span>{MONTHS[hover]} sign-ups</span>
          </Tooltip>
        )}
      </div>
      <TableView
        columns={[{key: 'month', header: 'Month'}, {key: 'signups', header: 'Sign-ups'}]}
        rows={SIGNUPS.map((v, i) => ({month: MONTHS[i], signups: v.toLocaleString()}))}
      />
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Lines: three series, so a legend plus direct end labels.

const SERIES = [
  {name: 'Europe', token: '--color-data-categorical-blue', values: [42, 45, 47, 51, 50, 55, 58, 60, 63, 66, 70, 74]},
  {name: 'Americas', token: '--color-data-categorical-orange', values: [30, 31, 35, 34, 38, 40, 39, 43, 45, 44, 48, 51]},
  {name: 'Asia Pacific', token: '--color-data-categorical-purple', values: [12, 14, 15, 18, 20, 22, 25, 27, 26, 29, 31, 33]},
];

export function LineChart() {
  const plot = useRef<HTMLDivElement>(null);
  const W = useWidth(plot), H = 260, pad = {t: 16, r: 112, b: 28, l: 40};
  const max = niceMax(Math.max(...SERIES.flatMap((s) => s.values)));
  const x = (i: number) => pad.l + ((W - pad.l - pad.r) * i) / (MONTHS.length - 1);
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max];
  const [at, setAt] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const box = svg.current!.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (MONTHS.length - 1));
    setAt(Math.max(0, Math.min(MONTHS.length - 1, i)));
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    setAt((cur) => Math.max(0, Math.min(MONTHS.length - 1, (cur ?? MONTHS.length - 1) + (e.key === 'ArrowRight' ? 1 : -1))));
  };

  return (
    <figure className="chart">
      <figcaption>
        <Text type="label">Monthly requests by region, in millions</Text>
        <ul className="chart-legend">
          {SERIES.map((s) => (
            <li key={s.name}>
              <span className="chart-key-line" style={{background: `var(${s.token})`}} />
              <Text type="supporting">{s.name}</Text>
            </li>
          ))}
        </ul>
      </figcaption>
      <div className="chart-plot" ref={plot}>
        <svg
          ref={svg}
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          tabIndex={0}
          aria-label="Line chart of monthly requests by region. Use the left and right arrow keys to read each month."
          onPointerMove={onMove}
          onPointerLeave={() => setAt(null)}
          onKeyDown={onKey}
          onFocus={() => setAt(MONTHS.length - 1)}
          onBlur={() => setAt(null)}>
          {ticks.map((v) => (
            <g key={v}>
              <line className="chart-grid" x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} />
              <text className="chart-tick" x={pad.l - 8} y={y(v)} textAnchor="end" dominantBaseline="middle">
                {v}
              </text>
            </g>
          ))}
          {MONTHS.map((m, i) =>
            i % 2 === 0 ? (
              <text key={m} className="chart-tick" x={x(i)} y={H - 8} textAnchor="middle">
                {m}
              </text>
            ) : null,
          )}
          {at !== null && <line className="chart-crosshair" x1={x(at)} x2={x(at)} y1={pad.t} y2={H - pad.b} />}
          {SERIES.map((s) => (
            <g key={s.name}>
              <polyline
                className="chart-line"
                stroke={`var(${s.token})`}
                points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
              />
              <circle className="chart-dot" cx={x(11)} cy={y(s.values[11])} r={4} fill={`var(${s.token})`} />
              <text className="chart-end-label" x={x(11) + 10} y={y(s.values[11])} dominantBaseline="middle">
                {s.name} {s.values[11]}
              </text>
              {at !== null && <circle className="chart-dot" cx={x(at)} cy={y(s.values[at])} r={4} fill={`var(${s.token})`} />}
            </g>
          ))}
        </svg>
        {at !== null && (
          <Tooltip x={x(at)} width={W}>
            <span className="chart-tooltip-title">{MONTHS[at]}</span>
            {SERIES.map((s) => (
              <span key={s.name} className="chart-tooltip-row">
                <span className="chart-key-line" style={{background: `var(${s.token})`}} />
                <strong>{s.values[at]}M</strong>
                <span>{s.name}</span>
              </span>
            ))}
          </Tooltip>
        )}
      </div>
      <TableView
        columns={[{key: 'month', header: 'Month'}, ...SERIES.map((s) => ({key: s.name, header: s.name}))]}
        rows={MONTHS.map((m, i) => ({month: m, ...Object.fromEntries(SERIES.map((s) => [s.name, `${s.values[i]}M`]))}))}
      />
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Heatmap: one sequential ramp. On a dark surface the anchor flips: the
// darkest step means "least" and recedes toward the surface; light means more.

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'];

export function Heatmap() {
  const values = useMemo(
    () =>
      DAYS.map((_, d) =>
        HOURS.map((_, h) => {
          const workday = d < 5 ? 1 : 0.45;
          const daytime = Math.max(0, Math.sin(((h - 3) / 12) * Math.PI));
          return Math.round(100 * workday * (0.15 + 0.85 * daytime) * (0.9 + ((d * 7 + h * 3) % 5) * 0.025));
        }),
      ),
    [],
  );
  // Quintiles, so all five steps carry data: equal-width bins put most of a
  // working week into the lightest step and the ramp reads as two colours.
  const breaks = useMemo(() => {
    const sorted = values.flat().sort((a, b) => a - b);
    return [0.2, 0.4, 0.6, 0.8].map((q) => sorted[Math.floor(q * (sorted.length - 1))]);
  }, [values]);
  const step = (v: number) => 5 - breaks.filter((b) => v > b).length; // lowest fifth → step 5 (darkest)
  const plot = useRef<HTMLDivElement>(null);
  const width = useWidth(plot);
  const gap = 2, left = 40, top = 4;
  const cell = Math.min(36, Math.floor((width - left) / HOURS.length) - gap);
  const [hover, setHover] = useState<{d: number; h: number} | null>(null);
  const W = left + HOURS.length * (cell + gap), H = top + DAYS.length * (cell + gap) + 20;

  return (
    <figure className="chart">
      <figcaption>
        <Text type="label">Activity by day and hour</Text>
        <div className="chart-scale" aria-hidden>
          <Text type="supporting">Less</Text>
          {[5, 4, 3, 2, 1].map((s) => (
            <span key={s} style={{background: `var(--color-data-blue-${s})`}} />
          ))}
          <Text type="supporting">More</Text>
        </div>
      </figcaption>
      <div className="chart-plot" ref={plot}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Heatmap of activity by day of week and hour">
          {DAYS.map((day, d) => (
            <text key={day} className="chart-tick" x={left - 8} y={top + d * (cell + gap) + cell / 2} textAnchor="end" dominantBaseline="middle">
              {day}
            </text>
          ))}
          {HOURS.map((hour, h) => (
            <text key={hour} className="chart-tick" x={left + h * (cell + gap) + cell / 2} y={H - 4} textAnchor="middle">
              {hour}
            </text>
          ))}
          {values.map((row, d) =>
            row.map((v, h) => (
              <rect
                key={`${d}-${h}`}
                tabIndex={0}
                aria-label={`${DAYS[d]} ${HOURS[h]}:00, activity ${v}`}
                className={hover?.d === d && hover?.h === h ? 'chart-cell is-hover' : 'chart-cell'}
                x={left + h * (cell + gap)}
                y={top + d * (cell + gap)}
                width={cell}
                height={cell}
                rx={4}
                fill={`var(--color-data-blue-${step(v)})`}
                onPointerEnter={() => setHover({d, h})}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover({d, h})}
                onBlur={() => setHover(null)}
              />
            )),
          )}
        </svg>
        {hover && (
          <Tooltip x={left + hover.h * (cell + gap) + cell / 2} width={W}>
            <strong>{values[hover.d][hover.h]}</strong>
            <span>
              {DAYS[hover.d]} {HOURS[hover.h]}:00
            </span>
          </Tooltip>
        )}
      </div>
      <TableView
        columns={[{key: 'day', header: 'Day'}, ...HOURS.map((h) => ({key: h, header: `${h}:00`}))]}
        rows={DAYS.map((day, d) => ({day, ...Object.fromEntries(HOURS.map((h, i) => [h, values[d][i]]))}))}
      />
    </figure>
  );
}
