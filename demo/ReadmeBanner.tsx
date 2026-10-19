import {Text} from '@astryxdesign/core/Text';
import {Heading} from '@astryxdesign/core/Heading';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Badge} from '@astryxdesign/core/Badge';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Switch} from '@astryxdesign/core/Switch';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';

/**
 * The README banner: real components in the theme, around the name.
 *
 * Drawn at the size GitHub shows it — an 880×440 frame, captured at 3× by
 * `SCREENSHOTS=1 npx playwright test` into docs/banner.png — so every word is
 * at its real type size. Drawn at 1280 and scaled to the README's width, the
 * text inside the cards fell to about 9px. Four cards, not more: the
 * components are the subject, and a crowd of them is noise.
 */
const noop = () => {};

export function ReadmeBanner() {
  return (
    <div className="banner-frame">
      <div className="banner-glow" />

      <div className="banner-card" style={{left: 24, top: 24, width: 232}}>
        <Card padding={4}>
          <div className="banner-stack">
            <Heading level={4}>Appearance</Heading>
            <Switch label="Compact rows" value onChange={noop} />
            <Switch label="Reduce motion" value={false} onChange={noop} />
          </div>
        </Card>
      </div>

      <div className="banner-card" style={{left: 624, top: 36, width: 232}}>
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
        <Heading level={1} type="display-1">
          Obsidian
        </Heading>
        <Text type="large" weight="normal" color="secondary">
          A dark theme for the Astryx design system
        </Text>
      </div>

      <div className="banner-card" style={{left: 24, top: 252, width: 244}}>
        <Card padding={4}>
          <div className="banner-stack">
            <TextInput label="Search" placeholder="Name or ID" value="" onChange={noop} />
            <CheckboxInput label="Only active" value onChange={noop} />
            <Button label="Apply filters" variant="primary" />
          </div>
        </Card>
      </div>

      <div className="banner-card" style={{left: 596, top: 276, width: 260}}>
        <Card padding={4}>
          <div className="banner-table">
            {[
              ['API gateway', 'success', 'Healthy'],
              ['Search', 'warning', 'Degraded'],
              ['Billing', 'error', 'Down'],
            ].map(([name, variant, label]) => (
              <div key={name} className="banner-table-row">
                <Text>{name}</Text>
                <Badge label={label} variant={variant as 'success' | 'warning' | 'error'} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
