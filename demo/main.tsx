import {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import './demo.css';

import {Theme} from '@astryxdesign/core/theme';
import {AppShell} from '@astryxdesign/core/AppShell';
import {SideNav, SideNavItem, SideNavSection} from '@astryxdesign/core/SideNav';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Badge} from '@astryxdesign/core/Badge';
import {Banner} from '@astryxdesign/core/Banner';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Selector} from '@astryxdesign/core/Selector';
import {Switch} from '@astryxdesign/core/Switch';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Divider} from '@astryxdesign/core/Divider';
import {Table} from '@astryxdesign/core/Table';

import {obsidianTheme} from '../themes/obsidian/obsidian.js';

/**
 * A one-page specimen of the theme: the shell, type, buttons, cards, form
 * controls, status, and a table. It is what the README screenshots are taken
 * from, and what the contrast e2e measures.
 *
 * `?theme=<name>` switches to another built theme found in demo/.compare/
 * (gitignored) — used locally to compare a revision against the previous one.
 */
import.meta.glob('./.compare/*-context.css', {eager: true});
const compare = import.meta.glob('./.compare/*.js', {eager: true}) as Record<
  string,
  Record<string, unknown>
>;
const themes: Record<string, unknown> = {obsidian: obsidianTheme};
for (const mod of Object.values(compare)) {
  for (const value of Object.values(mod)) {
    const t = value as {name?: string; __built?: boolean};
    if (t?.__built && t.name) themes[t.name] = t;
  }
}
const requested = new URLSearchParams(location.search).get('theme') ?? 'obsidian';
const active = themes[requested] ? requested : 'obsidian';
document.documentElement.dataset.astryxTheme = active;

const ROWS = [
  {service: 'API gateway', region: 'eu-west', latency: '42 ms', status: 'Healthy'},
  {service: 'Search', region: 'us-east', latency: '118 ms', status: 'Degraded'},
  {service: 'Billing', region: 'ap-south', latency: '—', status: 'Down'},
];

function Specimen() {
  const [notify, setNotify] = useState(true);
  const [digest, setDigest] = useState(false);
  const [agree, setAgree] = useState(true);
  const [region, setRegion] = useState('central');
  const [query, setQuery] = useState('');

  return (
    <AppShell
      height="auto"
      sideNav={
        <SideNav header={<Text type="label">Workspace</Text>}>
          <SideNavSection title="Overview">
            <SideNavItem label="Home" href="#" />
            <SideNavItem label="Projects" href="#" isSelected />
            <SideNavItem label="Updates" href="#" />
          </SideNavSection>
          <SideNavSection title="Recent">
            <SideNavItem label="A long project name that wraps onto a second line" href="#" />
            <SideNavItem label="Archived" href="#" isDisabled />
          </SideNavSection>
        </SideNav>
      }>
      <div className="demo-page">
        <section className="demo-section">
          <Heading level={1}>Obsidian</Heading>
          <Text color="secondary">
            A dark-only theme for Astryx. Depth comes from light, not shadow, and brightness carries
            the hierarchy.
          </Text>
        </section>

        <section className="demo-section" aria-label="Type">
          <Heading level={2}>Heading 2</Heading>
          <Heading level={3}>Heading 3</Heading>
          <Heading level={4}>Heading 4</Heading>
          <Heading level={5}>Heading 5</Heading>
          <Heading level={6}>Heading 6</Heading>
          <Text>Body text at the base size, in the primary step of the brightness ladder.</Text>
          <Text type="supporting">Supporting text, one step down.</Text>
          <Text type="code">{"const theme = 'obsidian'"}</Text>
        </section>

        <Divider />

        <section className="demo-section" aria-label="Buttons">
          <div className="demo-row">
            <Button label="Primary" variant="primary" />
            <Button label="Secondary" variant="secondary" />
            <Button label="Ghost" variant="ghost" />
            <Button label="Delete" variant="destructive" />
            <Button label="Disabled" isDisabled />
          </div>
        </section>

        <section className="demo-section" aria-label="Cards">
          <div className="demo-grid">
            {[
              ['Active users', '1,284'],
              ['Open issues', '7'],
              ['Uptime', '99.9%'],
            ].map(([label, value]) => (
              <Card key={label} padding={4}>
                <div className="demo-stack">
                  <Text type="supporting">{label}</Text>
                  <Heading level={2}>{value}</Heading>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="demo-section" aria-label="Form">
          <div className="demo-form">
            <TextInput label="Search" placeholder="Name or ID" value={query} onChange={setQuery} />
            <Selector
              label="Region"
              value={region}
              onChange={setRegion}
              options={[
                {value: 'north', label: 'North'},
                {value: 'central', label: 'Central'},
                {value: 'south', label: 'South'},
              ]}
            />
            <div className="demo-stack">
              <Switch label="Notifications" value={notify} onChange={setNotify} />
              <Switch label="Weekly digest" value={digest} onChange={setDigest} />
            </div>
            <div className="demo-stack">
              <CheckboxInput label="I have read the terms" value={agree} onChange={setAgree} />
              <CheckboxInput label="Send me a copy" value={false} onChange={() => {}} />
            </div>
            <ProgressBar label="Storage used" value={62} hasValueLabel />
          </div>
        </section>

        <section className="demo-section" aria-label="Status">
          <div className="demo-row">
            <Badge label="Neutral" />
            <Badge label="Info" variant="info" />
            <Badge label="Success" variant="success" />
            <Badge label="Warning" variant="warning" />
            <Badge label="Error" variant="error" />
            <Badge label="Purple" variant="purple" />
            <Badge label="Teal" variant="teal" />
          </div>
          <Banner status="info" title="Build finished" description="Three packages were published overnight." />
          <Banner status="warning" title="Two certificates expire soon" description="Renew them before the end of the month." />
          <Banner status="error" title="One job failed" description="The nightly export returned an error." />
          <Banner status="success" title="Changes saved" />
        </section>

        <section className="demo-section" aria-label="People">
          <div className="demo-row">
            <Avatar name="Ana Ortiz" />
            <Avatar name="Ben Kim" size="lg" />
            <Avatar name="Chen Li" size="sm" />
          </div>
        </section>

        <section className="demo-section" aria-label="Table">
          <Table
            data={ROWS}
            idKey="service"
            columns={[
              {key: 'service', header: 'Service'},
              {key: 'region', header: 'Region'},
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
        </section>
      </div>
    </AppShell>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme theme={themes[active] as typeof obsidianTheme} mode="dark">
      <Specimen />
    </Theme>
  </StrictMode>,
);
