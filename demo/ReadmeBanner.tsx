import {Text} from '@astryxdesign/core/Text';
import {Heading} from '@astryxdesign/core/Heading';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Badge} from '@astryxdesign/core/Badge';
import {Table} from '@astryxdesign/core/Table';

/**
 * The README banner: the name, and beside it what the theme is for — a dense,
 * data-heavy screen built from the real components, cut by the frame's edge.
 * Figures, a three-series chart in the categorical colours and a compact table:
 * the jobs the theme was tuned for, at the density it was tuned at.
 *
 * Drawn at the size GitHub shows it — an 880×440 frame, captured at 3× by
 * `SCREENSHOTS=1 npx playwright test` into docs/banner.png — so every word is
 * at its real type size. Earlier versions scattered cards around the name, then
 * showed a sparse app; neither said "data".
 */

const MONTHS = 12;

const KPIS = [
  {label: 'Requests', value: '1.88M', trend: [820, 940, 1010, 980, 1180, 1320, 1290, 1410, 1560, 1490, 1710, 1880]},
  {label: 'p95 latency', value: '212 ms', trend: [260, 251, 248, 255, 240, 236, 238, 229, 224, 220, 216, 212]},
  {label: 'Error rate', value: '0.42%', trend: [0.61, 0.58, 0.6, 0.55, 0.52, 0.5, 0.53, 0.49, 0.47, 0.45, 0.44, 0.42]},
];

const REGIONS = [
  {name: 'Europe', token: '--color-data-categorical-blue', values: [42, 45, 47, 51, 50, 55, 58, 60, 63, 66, 70, 74]},
  {name: 'Americas', token: '--color-data-categorical-orange', values: [30, 31, 35, 34, 38, 40, 39, 43, 45, 44, 48, 51]},
  {name: 'Asia Pacific', token: '--color-data-categorical-purple', values: [12, 14, 15, 18, 20, 22, 25, 27, 26, 29, 31, 33]},
];

const SERVICES = [
  {service: 'API gateway', region: 'eu-west', p95: '42 ms', errors: '0.1%', status: 'Healthy'},
  {service: 'Search', region: 'us-east', p95: '310 ms', errors: '2.4%', status: 'Degraded'},
  {service: 'Billing', region: 'eu-west', p95: '—', errors: '—', status: 'Down'},
  {service: 'Auth', region: 'ap-south', p95: '38 ms', errors: '0.0%', status: 'Healthy'},
  {service: 'Ingest', region: 'us-east', p95: '88 ms', errors: '0.3%', status: 'Healthy'},
];

/** A polyline through `values`, scaled into a width × height box. */
function path(values: number[], width: number, height: number, min: number, max: number) {
  const step = width / (values.length - 1);
  return values.map((v, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)},${(height - ((v - min) / (max - min)) * height).toFixed(1)}`).join(' ');
}

function Sparkline({values}: {values: number[]}) {
  const W = 56, H = 20;
  const min = Math.min(...values), max = Math.max(...values);
  return (
    <svg width={W} height={H + 4} viewBox={`0 -2 ${W} ${H + 4}`} aria-hidden="true">
      <path d={path(values, W, H, min, max)} className="banner-line" stroke="var(--color-data-categorical-blue)" />
    </svg>
  );
}

/** Three series on one axis, a recessive grid, a legend: the chart spec at banner size. */
function RegionChart() {
  const W = 460, H = 44, max = 80;
  return (
    <svg width={W} height={H + 4} viewBox={`0 -2 ${W} ${H + 4}`} aria-hidden="true">
      {[0, 0.5, 1].map((t) => (
        <line key={t} className="banner-grid" x1={0} x2={W} y1={H * t} y2={H * t} />
      ))}
      {REGIONS.map((r) => (
        <path key={r.name} d={path(r.values, W, H, 0, max)} className="banner-line" stroke={`var(${r.token})`} />
      ))}
    </svg>
  );
}

export function ReadmeBanner() {
  return (
    <div className="banner-frame">
      <div className="banner-title">
        <Heading level={1} type="display-1">
          Obsidian
        </Heading>
        <Text type="large" weight="normal" color="secondary">
          A dark theme for Astryx, built for dense, <span className="banner-nowrap">data-heavy</span> interfaces
        </Text>
      </div>

      <div className="banner-window" aria-hidden="true">
        <div className="banner-page-head">
          <div>
            <Heading level={3}>Services</Heading>
            <Text type="supporting">Last {MONTHS} months · 3 regions</Text>
          </div>
          <Button label="Deploy" variant="primary" size="sm" />
        </div>

        <div className="banner-kpis">
          {KPIS.map((k) => (
            <Card key={k.label} padding={3}>
              <div className="banner-kpi">
                <Text type="supporting">{k.label}</Text>
                <div className="banner-kpi-row">
                  <Heading level={4}>{k.value}</Heading>
                  <Sparkline values={k.trend} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card padding={3}>
          <div className="banner-chart">
            <div className="banner-chart-head">
              <Text type="label">Requests by region</Text>
              <ul className="banner-legend">
                {REGIONS.map((r) => (
                  <li key={r.name}>
                    <span className="banner-legend-key" style={{background: `var(${r.token})`}} />
                    <Text type="supporting">{r.name}</Text>
                  </li>
                ))}
              </ul>
            </div>
            <RegionChart />
          </div>
        </Card>

        <Table
          data={SERVICES}
          idKey="service"
          density="compact"
          columns={[
            {key: 'service', header: 'Service'},
            {key: 'region', header: 'Region'},
            {key: 'p95', header: 'p95'},
            {key: 'errors', header: 'Errors'},
            {
              key: 'status',
              header: 'Status',
              renderCell: (row) => (
                <Badge
                  label={row.status}
                  variant={row.status === 'Healthy' ? 'success' : row.status === 'Degraded' ? 'warning' : 'error'}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
