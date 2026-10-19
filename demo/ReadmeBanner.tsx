import {Text} from '@astryxdesign/core/Text';
import {Heading} from '@astryxdesign/core/Heading';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Badge} from '@astryxdesign/core/Badge';
import {SideNav, SideNavItem} from '@astryxdesign/core/SideNav';
import {Table} from '@astryxdesign/core/Table';

/**
 * The README banner: the name, and beside it the theme as it is used — one app
 * window built from the real components, cut by the frame's edge.
 *
 * Drawn at the size GitHub shows it — an 880×440 frame, captured at 3× by
 * `SCREENSHOTS=1 npx playwright test` into docs/banner.png — so every word is
 * at its real type size. The first version scattered four cards around the
 * name on a blue glow; it read as a sticker sheet, not a product.
 */
const REQUESTS = [820, 940, 1010, 980, 1180, 1320, 1290, 1410, 1560, 1490, 1710, 1880];

const SERVICES = [
  {service: 'API gateway', latency: '42 ms', status: 'Healthy'},
  {service: 'Search', latency: '310 ms', status: 'Degraded'},
  {service: 'Billing', latency: '—', status: 'Down'},
  {service: 'Auth', latency: '38 ms', status: 'Healthy'},
];

/** Columns at the chart spec: 4px rounded tops on the baseline, a gap between bars. */
function Columns({width, height}: {width: number; height: number}) {
  const max = Math.max(...REQUESTS);
  const band = width / REQUESTS.length;
  const bar = band - 6;
  const r = 4;
  return (
    <svg width={width} height={height} aria-hidden="true">
      {REQUESTS.map((v, i) => {
        const x = band * i + 3;
        const top = height - (height * v) / max;
        return (
          <path
            key={i}
            fill="var(--color-data-categorical-blue)"
            d={`M${x},${height} V${top + r} Q${x},${top} ${x + r},${top} H${x + bar - r} Q${x + bar},${top} ${x + bar},${top + r} V${height} Z`}
          />
        );
      })}
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
          A dark theme for the Astryx design system
        </Text>
      </div>

      <div className="banner-window" aria-hidden="true">
        <div className="banner-rail">
          <SideNav>
            <SideNavItem label="Overview" href="#" />
            <SideNavItem label="Services" href="#" isSelected />
            <SideNavItem label="Deploys" href="#" />
            <SideNavItem label="Settings" href="#" />
          </SideNav>
        </div>

        <div className="banner-page">
          <div className="banner-page-head">
            <Heading level={3}>Services</Heading>
            <Button label="Deploy" variant="primary" size="sm" />
          </div>

          <Card padding={4}>
            <div className="banner-stack">
              <Text type="supporting">Requests per day</Text>
              <div className="banner-figure">
                <Heading level={2}>1.88M</Heading>
                <Text color="secondary">+10% this month</Text>
              </div>
              <Columns width={288} height={44} />
            </div>
          </Card>

          <Table
            data={SERVICES}
            idKey="service"
            columns={[
              {key: 'service', header: 'Service'},
              {key: 'latency', header: 'Latency'},
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
    </div>
  );
}
