import {Text} from '@astryxdesign/core/Text';
import {Heading} from '@astryxdesign/core/Heading';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Badge} from '@astryxdesign/core/Badge';
import {Banner as StatusBanner} from '@astryxdesign/core/Banner';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Switch} from '@astryxdesign/core/Switch';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';

/**
 * The README banner: real components in the theme, arranged around the name.
 * Rendered at `?view=banner` and captured by `SCREENSHOTS=1 npx playwright test`
 * into docs/banner.png. Fixed 1280×640 frame; cards are allowed to run off
 * its edges.
 */
const noop = () => {};

export function ReadmeBanner() {
  return (
    <div className="banner-frame">
      <div className="banner-glow" />

      <div className="banner-card" style={{left: 48, top: 24, width: 300}}>
        <Card padding={4}>
          <div className="banner-stack">
            <Heading level={4}>Appearance</Heading>
            <Switch label="Follow the system" value onChange={noop} />
            <Switch label="Compact rows" value onChange={noop} />
            <Switch label="Reduce motion" value={false} onChange={noop} />
          </div>
        </Card>
      </div>

      <div className="banner-card" style={{left: 380, top: 48, width: 280}}>
        <Card padding={4}>
          <div className="banner-stack">
            <Text type="supporting">Storage used</Text>
            <Heading level={2}>7.4 of 12 GB</Heading>
            <ProgressBar label="Storage used" value={62} isLabelHidden />
          </div>
        </Card>
      </div>

      <div className="banner-card banner-code" style={{left: 692, top: 24, width: 340}}>
        <Card padding={4}>
          <pre>
            <Text type="code">{'<Theme theme={obsidianTheme}\n       mode="dark">\n  <App />\n</Theme>'}</Text>
          </pre>
        </Card>
      </div>

      <div className="banner-card" style={{left: 1064, top: 64, width: 250}}>
        <Card padding={4}>
          <div className="banner-stack">
            <Text type="supporting">Release</Text>
            <div className="banner-badges">
              <Badge label="Stable" variant="success" />
              <Badge label="Beta" variant="purple" />
              <Badge label="Dark" />
            </div>
          </div>
        </Card>
      </div>

      <div className="banner-title">
        <span className="banner-wordmark">obsidian</span>
        <Text color="secondary">A dark theme for the Astryx design system</Text>
      </div>

      <div className="banner-card" style={{left: 24, top: 420, width: 300}}>
        <Card padding={4}>
          <div className="banner-stack">
            <TextInput label="Search" placeholder="Name or ID" value="" onChange={noop} />
            <CheckboxInput label="Only active" value onChange={noop} />
            <Button label="Apply filters" variant="primary" />
          </div>
        </Card>
      </div>

      <div className="banner-card" style={{left: 356, top: 474, width: 384}}>
        <StatusBanner status="warning" title="Two certificates expire soon" description="Renew them before the end of the month." />
      </div>

      <div className="banner-card" style={{left: 772, top: 448, width: 330}}>
        <Card padding={4}>
          <div className="banner-table">
            {[
              ['API gateway', '42 ms', 'success', 'Healthy'],
              ['Search', '118 ms', 'warning', 'Degraded'],
              ['Billing', '—', 'error', 'Down'],
            ].map(([name, latency, variant, label]) => (
              <div key={name} className="banner-table-row">
                <Text>{name}</Text>
                <Text color="secondary">{latency}</Text>
                <Badge label={label} variant={variant as 'success' | 'warning' | 'error'} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="banner-card" style={{left: 1134, top: 436, width: 220}}>
        <Card padding={4}>
          <div className="banner-stack">
            <Text type="supporting">Uptime</Text>
            <Heading level={2}>99.9%</Heading>
          </div>
        </Card>
      </div>
    </div>
  );
}
