import {StrictMode, useEffect, useState, type ReactNode} from 'react';
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
import {Table} from '@astryxdesign/core/Table';

import {obsidianTheme} from '../themes/obsidian/obsidian.js';
import {ReadmeBanner} from './ReadmeBanner';
import {ColumnChart, Heatmap, LineChart} from './charts';

/**
 * The theme's showcase. The side navigation is the page's own table of
 * contents — a working menu that also shows how the component looks — and
 * every section says what it demonstrates.
 *
 * `?theme=<name>` switches to another built theme found in demo/.compare/
 * (gitignored), to compare a revision against the previous one locally.
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
const view = new URLSearchParams(location.search).get('view');

const REPO = 'https://github.com/Creative-Context/astryx-theme-obsidian';

const SECTIONS = [
  {group: 'Foundations', id: 'colors', label: 'Colors'},
  {group: 'Foundations', id: 'typography', label: 'Typography'},
  {group: 'Foundations', id: 'data', label: 'Data visualization'},
  {group: 'Components', id: 'buttons', label: 'Buttons'},
  {group: 'Components', id: 'cards', label: 'Cards'},
  {group: 'Components', id: 'forms', label: 'Form controls'},
  {group: 'Components', id: 'status', label: 'Status'},
  {group: 'Components', id: 'avatars', label: 'Avatars'},
  {group: 'Components', id: 'table', label: 'Table'},
] as const;

/** Marks the section being read, so the menu shows where you are. */
function useCurrentSection(): string {
  const [current, setCurrent] = useState<string>(SECTIONS[0].id);
  useEffect(() => {
    const tops = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) tops.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : Infinity);
        const visible = [...tops.entries()].filter(([, top]) => top !== Infinity);
        if (visible.length) setCurrent(visible.sort((a, b) => a[1] - b[1])[0][0]);
      },
      {rootMargin: '0px 0px -60% 0px'},
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return current;
}

function Section({id, title, note, children}: {id: string; title: string; note: string; children: ReactNode}) {
  return (
    <section id={id} className="demo-section" aria-labelledby={`${id}-title`}>
      <div className="demo-section-head">
        <Heading level={2} id={`${id}-title`}>
          {title}
        </Heading>
        <Text color="secondary">{note}</Text>
      </div>
      {children}
    </section>
  );
}

const parse = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
const luminance = (rgb: number[]) =>
  rgb
    .slice(0, 3)
    .map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);

/** The value a token resolves to, and its contrast against the body. */
function useTokenContrast(token: string) {
  const [info, setInfo] = useState({value: '', ratio: ''});
  useEffect(() => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;background:var(--color-background-body)';
    const sample = document.createElement('div');
    sample.style.cssText = `width:1px;height:1px;background:var(${token})`;
    probe.appendChild(sample);
    document.body.appendChild(probe);
    const body = parse(getComputedStyle(probe).backgroundColor);
    const [r, g, b, a = 1] = parse(getComputedStyle(sample).backgroundColor);
    probe.remove();
    const seen = [r, g, b].map((c, i) => c * a + body[i] * (1 - a));
    const [hi, lo] = [luminance(seen), luminance(body)].sort((x, y) => y - x);
    setInfo({value, ratio: ((hi + 0.05) / (lo + 0.05)).toFixed(1)});
  }, [token]);
  return info;
}

function Swatch({token, label, text, surface}: {token: string; label: string; text?: boolean; surface?: boolean}) {
  const {value, ratio} = useTokenContrast(token);
  return (
    <div className="demo-swatch">
      <div className="demo-swatch-chip" style={{background: text ? undefined : `var(${token})`}}>
        {text ? <span style={{color: `var(${token})`}}>Aa</span> : null}
      </div>
      <div className="demo-swatch-meta">
        <Text type="label">{label}</Text>
        <Text type="supporting">
          {value}
          {!surface && ratio && ` · ${ratio}:1 on the body`}
        </Text>
      </div>
    </div>
  );
}

const CATEGORICAL = ['blue', 'orange', 'purple', 'green', 'pink', 'cyan', 'red', 'teal', 'brown', 'indigo'];
const RAMPS = ['blue', 'shamrock', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow', 'gray'];

const ROWS = [
  {service: 'API gateway', region: 'eu-west', latency: '42 ms', status: 'Healthy'},
  {service: 'Search', region: 'us-east', latency: '118 ms', status: 'Degraded'},
  {service: 'Billing', region: 'ap-south', latency: '—', status: 'Down'},
];

function Showcase() {
  const current = useCurrentSection();
  const [notify, setNotify] = useState(true);
  const [digest, setDigest] = useState(false);
  const [agree, setAgree] = useState(true);
  const [copy, setCopy] = useState(false);
  const [region, setRegion] = useState('central');
  const [query, setQuery] = useState('');

  const groups = [...new Set(SECTIONS.map((s) => s.group))];

  return (
    <AppShell
      height="auto"
      sideNav={
        <SideNav
          header={
            <div className="demo-brand">
              <Text type="label">Obsidian</Text>
              <Text type="supporting">Astryx theme · 0.2.0</Text>
            </div>
          }
          footer={<SideNavItem label="View on GitHub" href={REPO} />}>
          {groups.map((group) => (
            <SideNavSection key={group} title={group}>
              {SECTIONS.filter((s) => s.group === group).map((s) => (
                <SideNavItem key={s.id} label={s.label} href={`#${s.id}`} isSelected={current === s.id} />
              ))}
            </SideNavSection>
          ))}
        </SideNav>
      }>
      <div className="demo-page">
        <header className="demo-hero">
          <Heading level={1}>Obsidian</Heading>
          <Text color="secondary">
            A dark-only theme for the Astryx design system. Depth comes from light, not shadow, and
            brightness carries the hierarchy. Everything on this page is a real Astryx component
            wearing the theme.
          </Text>
          <pre className="demo-install">
            <Text type="code">npm install github:Creative-Context/astryx-theme-obsidian</Text>
          </pre>
          <div className="demo-row">
            <Button label="View on GitHub" variant="primary" href={REPO} />
            <Button label="How to install" variant="ghost" href={`${REPO}#install`} />
          </div>
        </header>

        <Section
          id="colors"
          title="Colors"
          note="Surfaces are veils of light over a near-black body. Each sample shows its contrast against that body.">
          <Text type="label">Surfaces</Text>
          <div className="demo-swatches">
            <Swatch token="--color-background-body" label="Body" surface />
            <Swatch token="--color-background-surface" label="Surface" surface />
            <Swatch token="--color-background-card" label="Card · 3% white veil" surface />
            <Swatch token="--color-background-popover" label="Popover" surface />
          </div>
          <Text type="label">Text and lines</Text>
          <div className="demo-swatches">
            <Swatch token="--color-text-primary" label="Primary text" text />
            <Swatch token="--color-text-secondary" label="Secondary text" text />
            <Swatch token="--color-text-accent" label="Accent text" text />
            <Swatch token="--color-border-emphasized" label="Control edge" />
          </div>
          <Text type="label">Accent and status</Text>
          <div className="demo-swatches">
            <Swatch token="--color-accent" label="Accent" />
            <Swatch token="--color-success" label="Success" />
            <Swatch token="--color-warning" label="Warning" />
            <Swatch token="--color-error" label="Error" />
          </div>
        </Section>

        <Section
          id="typography"
          title="Typography"
          note="Space Grotesk for headings, Inter for text, Space Mono for code. Nothing renders below 10px.">
          <div className="demo-stack">
            <Heading level={1}>Heading 1</Heading>
            <Heading level={2}>Heading 2</Heading>
            <Heading level={3}>Heading 3</Heading>
            <Heading level={4}>Heading 4</Heading>
            <Heading level={5}>Heading 5</Heading>
            <Heading level={6}>Heading 6</Heading>
            <Text>Body text, the primary step of the brightness ladder.</Text>
            <Text type="supporting">Supporting text, one step down.</Text>
            <Text type="code">{"const theme = 'obsidian'"}</Text>
          </div>
        </Section>

        <Section
          id="data"
          title="Data visualization"
          note="Chart colors fitted to this dark body and tested for colour-blind readers. Use the categorical colors in this order; every word in a chart uses text tokens.">
          <Text type="label">Categorical, in order</Text>
          <div className="demo-data-row">
            {CATEGORICAL.map((c, i) => (
              <div key={c} className="demo-data-slot">
                <div className="demo-data-chip" style={{background: `var(--color-data-categorical-${c})`}} />
                <Text type="supporting">
                  {i + 1} · {c}
                </Text>
              </div>
            ))}
          </div>
          <Text type="label">Sequential ramps</Text>
          <div className="demo-ramps">
            {RAMPS.map((r) => (
              <div key={r} className="demo-data-slot">
                <div className="demo-ramp">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} style={{background: `var(--color-data-${r}-${step})`}} />
                  ))}
                </div>
                <Text type="supporting">{r}</Text>
              </div>
            ))}
          </div>
          <div className="demo-charts">
            <Card padding={4}>
              <LineChart />
            </Card>
            <div className="demo-grid-2">
              <Card padding={4}>
                <ColumnChart />
              </Card>
              <Card padding={4}>
                <Heatmap />
              </Card>
            </div>
          </div>
        </Section>

        <Section id="buttons" title="Buttons" note="Every variant, and the disabled state.">
          <div className="demo-row">
            <Button label="Primary" variant="primary" />
            <Button label="Secondary" variant="secondary" />
            <Button label="Ghost" variant="ghost" />
            <Button label="Delete" variant="destructive" />
            <Button label="Disabled" isDisabled />
          </div>
        </Section>

        <Section id="cards" title="Cards" note="A veil with no border and no shadow. Hover one: it brightens a step.">
          <div className="demo-grid">
            {[
              ['Active users', '1,284'],
              ['Open issues', '7'],
              ['Uptime', '99.9%'],
            ].map(([label, value]) => (
              <Card key={label} padding={4}>
                <div className="demo-stack">
                  <Text type="supporting">{label}</Text>
                  <Text size="2xl" weight="medium">
                    {value}
                  </Text>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          id="forms"
          title="Form controls"
          note="The edge of every control reaches 3:1, so an empty input or an unchecked box is still visible.">
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
              <CheckboxInput label="Send me a copy" value={copy} onChange={setCopy} />
            </div>
            <ProgressBar label="Storage used" value={62} hasValueLabel />
          </div>
        </Section>

        <Section id="status" title="Status" note="Badges and banners for each status, plus categorical badges.">
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
        </Section>

        <Section id="avatars" title="Avatars" note="Round at every size.">
          <div className="demo-row">
            <Avatar name="Ana Ortiz" size="sm" />
            <Avatar name="Ben Kim" />
            <Avatar name="Chen Li" size="lg" />
          </div>
        </Section>

        <Section id="table" title="Table" note="Rows, dividers and status badges in cells.">
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
        </Section>
      </div>
    </AppShell>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme theme={themes[active] as typeof obsidianTheme} mode="dark">
      {view === 'banner' ? <ReadmeBanner /> : <Showcase />}
    </Theme>
  </StrictMode>,
);
