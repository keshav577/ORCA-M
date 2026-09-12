import { type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Anchor, ArrowRight, Bell, Bot, Check, CircleHelp, CloudLightning, Compass, Database, Fish, Gauge, Globe2, Info, Layers3, Map as MapIcon, Menu, MessageCircle, Navigation, PanelTop, RefreshCw, Route as RouteIcon, Send, ShieldCheck, Ship, Thermometer, Waves, Wind, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

type Freshness = 'LIVE' | 'CACHED' | 'STALE' | 'UNAVAILABLE';
type AlertSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

const navItems = [
  { href: '/', label: 'Overview', icon: PanelTop },
  { href: '/assistant', label: 'Ask ORCA', icon: MessageCircle },
  { href: '/map', label: 'Ocean map', icon: MapIcon },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/route', label: 'Route planner', icon: RouteIcon },
];

const alerts = [
  { id: 'wind-01', severity: 'HIGH' as AlertSeverity, icon: Wind, title: 'Strong winds building offshore', body: 'Wind may reach 28 km/h after 16:00. Keep the return leg close to shore.', time: '12 min ago', source: 'IMD coastal forecast' },
  { id: 'lightning-02', severity: 'HIGH' as AlertSeverity, icon: CloudLightning, title: 'Lightning cell 42 km south-east', body: 'A fast-moving cell is tracking north-east. ORCA recommends returning before 15:30.', time: '31 min ago', source: 'INSAT-3D nowcast' },
  { id: 'boundary-03', severity: 'MEDIUM' as AlertSeverity, icon: Globe2, title: 'Seasonal boundary ahead of PFZ 04', body: 'The selected zone sits 3.8 nautical miles from a regulated fishing boundary.', time: '1 hr ago', source: 'Coastal authority notice' },
  { id: 'visibility-04', severity: 'LOW' as AlertSeverity, icon: Waves, title: 'Visibility is clear near shore', body: 'Visibility is 8.4 km at the departure point and remains suitable for navigation.', time: '2 hr ago', source: 'Buoy KA-07' },
];

const traces = [
  { label: 'Planner agent', note: 'Framed the question for a 06:00–16:00 trip', icon: Compass },
  { label: 'Weather agent', note: 'Wind and lightning cell checked against coastal forecast', icon: Wind },
  { label: 'Ocean agent', note: 'Wave, swell and visibility combined', icon: Waves },
  { label: 'Geospatial agent', note: 'PFZ 04 and boundary distance verified', icon: Globe2 },
  { label: 'Risk agent', note: 'Issued a GO with a return-before window', icon: ShieldCheck },
];

function FreshnessBadge({ status, text }: { status: Freshness; text?: string }) {
  const className = status.toLowerCase();
  return <span className={`orca-status orca-status-${className}`} data-testid={`status-freshness-${className}`}><span className="orca-dot" />{text ?? status}</span>;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [language, setLanguage] = useState('English');
  const [refreshedAt, setRefreshedAt] = useState('09:42 IST');
  const refresh = () => setRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  return (
    <div className="orca-shell">
      <aside className="orca-sidebar">
        <Link href="/" className="orca-logo" data-testid="link-logo">
          <span className="orca-mark"><Fish size={19} strokeWidth={2.2} /></span>
          <span>ORCA<span style={{ color: '#1ab5b1' }}>.</span></span>
        </Link>
        <div className="orca-nav">
          <div className="orca-eyebrow" style={{ padding: '0 13px', marginBottom: 9 }}>Your sea companion</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location === item.href;
            return <Link key={item.href} href={item.href} className={`orca-nav-link ${active ? 'active' : ''}`} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={16} strokeWidth={active ? 2.4 : 1.9} /><span className="orca-nav-label">{item.label}</span>{item.href === '/alerts' && <span style={{ background: '#e85e4f', color: '#fff', borderRadius: 99, padding: '2px 5px', fontSize: 9 }}>2</span>}</Link>;
          })}
        </div>
        <div style={{ marginTop: 25 }}>
          <Link href="/about" className={`orca-nav-link ${location === '/about' ? 'active' : ''}`} data-testid="link-nav-about"><CircleHelp size={16} /><span className="orca-nav-label">About ORCA</span></Link>
        </div>
        <div className="orca-sidebar-foot">
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', color: '#3b7880', fontWeight: 800, marginBottom: 5 }}><span className="orca-dot orca-dot-pulse" style={{ color: '#27b59b' }} />Demo data mode</div>
          Local preview fixtures only.<br />No live decision is being made.
        </div>
      </aside>
      <main className="orca-main">
        <header className="orca-topbar">
          <Link href="/" className="orca-mobile-brand" data-testid="link-mobile-logo">
            <span className="orca-mark"><Fish size={16} strokeWidth={2.2} /></span>
            <span>ORCA<span style={{ color: '#1ab5b1' }}>.</span></span>
          </Link>
          <div className="orca-statusline"><span className="orca-dot orca-dot-pulse" />Coastal Karnataka · <span className="font-mono-orca">12°58'N 74°50'E</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="orca-icon-button" onClick={refresh} title="Refresh preview data" data-testid="button-refresh-data"><RefreshCw size={14} /></button>
            <span className="font-mono-orca" style={{ color: '#78919a', fontSize: 10 }} data-testid="text-last-refresh">Updated {refreshedAt}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} style={{ border: '1px solid #d7e7e8', borderRadius: 9, background: '#fff', color: '#315d6a', padding: '7px 8px', fontSize: 11, fontWeight: 700 }} data-testid="select-language">
              <option>English</option><option>हिन्दी</option><option>తెలుగు</option>
            </select>
            <button className="orca-icon-button" style={{ display: 'none' }} aria-label="Open menu" data-testid="button-open-menu"><Menu size={16} /></button>
          </div>
        </header>
        <div className="orca-content">{children}</div>
      </main>
      <nav className="orca-mobile-nav">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return <Link key={item.href} href={item.href} className={`orca-mobile-link ${location === item.href ? 'active' : ''}`} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={18} /><span>{item.label === 'Overview' ? 'Home' : item.label.replace(' planner', '')}</span></Link>;
        })}
        <Link href="/about" className={`orca-mobile-link ${location === '/about' ? 'active' : ''}`} data-testid="link-mobile-about"><CircleHelp size={18} /><span>About</span></Link>
      </nav>
    </div>
  );
}

function DemoBanner() {
  return <div className="orca-demo-banner" data-testid="banner-demo-mode"><span><strong>Preview workspace</strong> · Readings and verdicts below are realistic local demo fixtures, not live safety guidance.</span><FreshnessBadge status="CACHED" text="Local fixtures" /></div>;
}

function Overview() {
  return <div>
    <DemoBanner />
    <div className="orca-page-head">
      <div><div className="orca-eyebrow">Morning brief · Tuesday, 18 June 2024</div><h1 className="orca-h1">Good morning, Ravi.</h1><p className="orca-muted" style={{ margin: 0 }}>Here is what the sea is telling you before you leave Malpe harbour.</p></div>
      <div className="orca-page-actions"><Link href="/assistant" className="orca-button orca-button-primary" data-testid="link-ask-orca"><MessageCircle size={15} />Ask ORCA</Link><Link href="/route" className="orca-button orca-button-outline" data-testid="link-plan-trip"><Navigation size={14} />Plan a trip</Link></div>
    </div>
    <div className="orca-grid-home">
      <section className="orca-card orca-verdict" data-testid="card-safety-verdict">
        <div className="orca-verdict-content">
          <div className="orca-eyebrow">Departure safety verdict</div>
          <div className="orca-verdict-title">Can I go fishing today?</div>
          <div className="orca-go" data-testid="status-verdict-go">GO</div>
          <p className="orca-verdict-copy">Conditions are suitable for a nearshore trip from Malpe. Leave before 06:00 and return by 16:00 as winds strengthen offshore. Keep the radio watch active.</p>
          <div className="orca-meta-row"><span className="orca-meta-chip"><ShieldCheck size={13} />Confidence 87%</span><span className="orca-meta-chip"><FreshnessBadge status="LIVE" text="Evidence current" /></span><span className="orca-meta-chip"><ClockIcon />Valid for 6 hours</span></div>
          <div className="orca-location-line"><Navigation size={14} />Malpe, Karnataka <span style={{ opacity: .5 }}>·</span> 12°58'N 74°50'E</div>
        </div>
      </section>
      <section>
        <div className="orca-card orca-card-pad" data-testid="card-current-conditions">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div className="orca-eyebrow">Right now</div><div className="orca-h2" style={{ marginTop: 5 }}>Coastal conditions</div></div><FreshnessBadge status="LIVE" /></div>
          <div className="orca-mini-summary">
            <Metric icon={<Waves size={15} />} label="Wave height" value="0.8" unit="m" foot="Calm" />
            <Metric icon={<Wind size={15} />} label="Wind" value="14" unit="km/h" foot="ENE · steady" />
            <Metric icon={<Waves size={15} />} label="Swell" value="1.1" unit="m" foot="South-west" />
            <Metric icon={<Gauge size={15} />} label="Visibility" value="8.4" unit="km" foot="Clear" />
            <Metric icon={<Thermometer size={15} />} label="Sea temp" value="28.1" unit="°C" foot="Normal" />
            <Metric icon={<Database size={15} />} label="Chlorophyll" value="0.42" unit="mg/m³" foot="Good PFZ signal" />
          </div>
        </div>
      </section>
    </div>
    <div className="orca-columns">
      <section>
        <div className="orca-section-row"><div><div className="orca-h2">Signals to keep in mind</div><p className="orca-muted">Only the things that could change your plan.</p></div><Link href="/alerts" className="orca-button orca-button-ghost" data-testid="link-view-all-alerts">View all <ArrowRight size={13} /></Link></div>
        <div className="orca-card orca-card-pad" data-testid="list-priority-alerts">{alerts.slice(0, 3).map((alert) => <AlertItem key={alert.id} alert={alert} />)}</div>
      </section>
      <section>
        <div className="orca-section-row"><div><div className="orca-h2">Your water, at a glance</div><p className="orca-muted">PFZ and vessel activity around Malpe.</p></div><Link href="/map" className="orca-button orca-button-ghost" data-testid="link-open-map">Open map <ArrowRight size={13} /></Link></div>
        <div className="orca-card orca-card-pad" data-testid="card-map-overview"><div className="orca-map-preview"><span className="orca-map-label" style={{ left: 14, top: 18 }}>Malpe harbour</span><span className="orca-map-label" style={{ right: 17, bottom: 22 }}>Arabian sea</span><div className="orca-zone" /><div className="orca-vessel" /></div><div className="orca-map-legend"><span><i className="zone-dot" />Selected PFZ 04</span><span><i />Your vessel</span></div></div>
      </section>
    </div>
    <section>
      <div className="orca-section-row"><div><div className="orca-h2">How ORCA reached this answer</div><p className="orca-muted">Five specialist agents checked the same departure window.</p></div><Link href="/assistant" className="orca-button orca-button-ghost" data-testid="link-see-reasoning">See reasoning <ArrowRight size={13} /></Link></div>
      <div className="orca-card orca-card-pad" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 10 }} data-testid="list-agent-trace">{traces.map((trace, index) => <div key={trace.label} className="orca-trace" style={{ display: 'block', borderBottom: 0, padding: 0 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div className="orca-trace-icon"><trace.icon size={14} /></div><span className="font-mono-orca" style={{ color: '#9aaeb2', fontSize: 10 }}>0{index + 1}</span></div><div className="orca-trace-name" style={{ marginTop: 10 }}>{trace.label}</div><div className="orca-trace-note">{trace.note}</div></div>)}</div>
    </section>
  </div>;
}

function ClockIcon() { return <span style={{ width: 13, height: 13, border: '1px solid currentColor', borderRadius: '50%', display: 'inline-block', position: 'relative' }} />; }

function Metric({ icon, label, value, unit, foot }: { icon: ReactNode; label: string; value: string; unit: string; foot: string }) {
  return <div className="orca-metric" data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-')}`}><div style={{ color: '#159a99', display: 'flex', alignItems: 'center', gap: 6 }}><span>{icon}</span><span className="orca-metric-label">{label}</span></div><div className="orca-metric-value">{value}<span className="orca-metric-unit">{unit}</span></div><div className="orca-metric-foot">{foot}</div></div>;
}

function AlertItem({ alert }: { alert: typeof alerts[number] }) {
  const Icon = alert.icon;
  const tone = alert.severity === 'HIGH' ? 'danger' : alert.severity === 'MEDIUM' ? 'warn' : 'info';
  return <div className="orca-alert-item" data-testid={`alert-summary-${alert.id}`}><div className={`orca-alert-icon ${tone}`}><Icon size={15} /></div><div><div className="orca-alert-title">{alert.title}</div><div className="orca-alert-sub">{alert.body}</div></div><span className={`orca-status ${alert.severity === 'HIGH' ? 'orca-status-unavailable' : alert.severity === 'MEDIUM' ? 'orca-status-stale' : 'orca-status-cached'}`} style={{ alignSelf: 'flex-start' }}>{alert.severity}</span></div>;
}

function Assistant() {
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; text: string }[]>([
    { role: 'assistant', text: 'Good morning. I have checked the sea around Malpe for your usual nearshore trip. Ask me anything, or use one of the questions below.' },
    { role: 'assistant', text: 'The short answer is GO until 16:00. Winds build after that, and a lightning cell is moving north-east 42 km offshore.' },
  ]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || thinking) return;
    setMessages((current) => [...current, { role: 'user', text }]);
    setDraft('');
    setThinking(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, { role: 'assistant', text: 'For this demo, ORCA finds no new risk in that question. The current verdict remains GO for a nearshore trip, with a return-before window of 16:00. I would re-check the lightning cell before leaving.' }]);
      setThinking(false);
    }, 650);
  };
  const suggestions = ['Can I go to PFZ 04?', 'Why is the answer GO?', 'What should I watch for?', 'Plan a safe return'];
  return <div>
    <DemoBanner />
    <div className="orca-page-head"><div><div className="orca-eyebrow">Marine intelligence assistant</div><h1 className="orca-h1">Ask the sea a clearer question.</h1><p className="orca-muted" style={{ margin: 0 }}>ORCA brings weather, ocean, satellite and map evidence together — then shows its work.</p></div><FreshnessBadge status="LIVE" text="Agents ready" /></div>
    <div className="orca-assistant-layout">
      <section className="orca-card orca-chat" data-testid="panel-assistant-chat">
        <div className="orca-chat-head"><div className="orca-agent-chip"><div className="orca-agent-avatar"><Bot size={18} /></div><div><div style={{ fontSize: 13, color: '#244b5a', fontWeight: 800 }}>ORCA intelligence</div><div className="orca-statusline" style={{ marginTop: 3 }}><span className="orca-dot orca-dot-pulse" />Ready · Malpe context loaded</div></div></div><FreshnessBadge status="CACHED" text="Demo context" /></div>
        <div className="orca-chat-body">{messages.map((message, index) => <div className={`orca-msg ${message.role}`} key={`${message.role}-${index}`} data-testid={`message-${message.role}-${index}`}>{message.role === 'assistant' && <div className="orca-agent-avatar" style={{ width: 27, height: 27, borderRadius: 8 }}><Bot size={14} /></div>}<div><div className="orca-msg-label">{message.role === 'assistant' ? 'ORCA' : 'You'}</div><div className="orca-bubble">{message.text}</div></div></div>)}{thinking && <div className="orca-msg assistant"><div className="orca-agent-avatar" style={{ width: 27, height: 27, borderRadius: 8 }}><Bot size={14} /></div><div><div className="orca-msg-label">ORCA</div><div className="orca-bubble"><span className="orca-statusline"><span className="orca-dot orca-dot-pulse" />Checking the latest context…</span></div></div></div>}</div>
        <div className="orca-chat-footer"><div className="orca-suggested">{suggestions.map((suggestion) => <button key={suggestion} className="orca-suggestion" onClick={() => setDraft(suggestion)} data-testid={`button-suggestion-${suggestion.slice(0, 8).replaceAll(' ', '-').toLowerCase()}`}>{suggestion}</button>)}</div><form className="orca-compose" onSubmit={sendMessage}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about your trip, conditions or a place…" aria-label="Ask ORCA a question" data-testid="input-assistant-message" /><button className="orca-button orca-button-primary" type="submit" disabled={!draft.trim() || thinking} data-testid="button-send-message"><Send size={14} />Send</button></form></div>
      </section>
      <aside className="orca-card orca-card-pad" data-testid="panel-agent-reasoning"><div className="orca-eyebrow">Under the answer</div><div className="orca-h2" style={{ marginTop: 6, marginBottom: 5 }}>Agent reasoning</div><p className="orca-muted" style={{ fontSize: 11, marginTop: 0 }}>A collaborative trace, in plain language.</p>{traces.map((trace, index) => <div className="orca-reason-step" key={trace.label}><div className="orca-reason-number">{index + 1}</div><div><div className="orca-reason-name">{trace.label}</div><div className="orca-reason-copy">{trace.note}</div></div></div>)}<div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #e4eff0' }}><FreshnessBadge status="LIVE" text="Verdict signed by risk agent" /></div></aside>
    </div>
  </div>;
}

function MapWorkspace() {
  const [layers, setLayers] = useState({ zones: true, vessels: true, boundaries: true });
  const [selectedLayer, setSelectedLayer] = useState('All layers');
  const toggle = (key: keyof typeof layers) => setLayers((current) => ({ ...current, [key]: !current[key] }));
  return <div>
    <DemoBanner />
    <div className="orca-page-head"><div><div className="orca-eyebrow">Geospatial workspace</div><h1 className="orca-h1">See the water around you.</h1><p className="orca-muted" style={{ margin: 0 }}>A simple operational view for zones, vessels and boundaries near Malpe.</p></div><div className="orca-control-row"><div className="orca-segmented">{['All layers', 'PFZ zones', 'Vessels'].map((layer) => <button key={layer} className={selectedLayer === layer ? 'active' : ''} onClick={() => setSelectedLayer(layer)} data-testid={`button-map-layer-${layer.toLowerCase().replaceAll(' ', '-')}`}>{layer}</button>)}</div><FreshnessBadge status="CACHED" text="Map cache · 09:31" /></div></div>
    <div className="orca-map-workspace">
      <section className="orca-big-map" data-testid="map-canvas"><span className="orca-map-label" style={{ left: 24, top: 25 }}>Malpe harbour</span><span className="orca-map-label" style={{ left: 47, top: 17 }}>12°58'N</span><span className="orca-map-label" style={{ right: 25, bottom: 27 }}>Arabian sea</span><div className="orca-map-compass">N</div><div className="orca-big-zone" style={{ opacity: layers.zones ? 1 : .08 }}><span>PFZ 04 · SELECTED</span></div><div className="orca-big-vessel" style={{ opacity: layers.vessels ? 1 : .12 }} /><div style={{ position: 'absolute', zIndex: 2, right: 23, top: 77, width: 92, height: 54, border: '1px dashed rgba(194,111,37,.7)', background: 'rgba(255,204,116,.16)', borderRadius: '45% 55% 48% 60%', opacity: layers.boundaries ? 1 : .1 }} /><span className="orca-map-label" style={{ right: 22, top: 137, color: '#a47b44' }}>Boundary</span><div className="orca-map-zoom"><button onClick={() => undefined} data-testid="button-map-zoom-in">+</button><button onClick={() => undefined} data-testid="button-map-zoom-out">−</button></div></section>
      <aside className="orca-map-side">
        <div className="orca-card orca-card-pad"><div className="orca-eyebrow">Selected area</div><div className="orca-h2" style={{ marginTop: 6 }}>PFZ 04</div><p className="orca-muted" style={{ fontSize: 11, margin: '5px 0 14px' }}>A promising nearshore fishing zone, 8.2 nautical miles south-west of Malpe.</p><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><FreshnessBadge status="LIVE" text="Satellite signal" /><button className="orca-button orca-button-ghost" onClick={() => undefined} data-testid="button-zone-details">Details <ArrowRight size={12} /></button></div></div>
        <div className="orca-card orca-card-pad"><div className="orca-eyebrow">Map layers</div>{[['zones', 'PFZ zones', Layers3], ['vessels', 'Nearby vessels', Ship], ['boundaries', 'Regulated boundaries', ShieldCheck]].map(([key, label, Icon]) => <div className="orca-layer" key={key as string}><span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon size={14} color="#188f90" />{label as string}</span><button className={`orca-switch ${layers[key as keyof typeof layers] ? 'on' : ''}`} onClick={() => toggle(key as keyof typeof layers)} aria-label={`Toggle ${label}`} data-testid={`button-toggle-${key}`}><span /></button></div>)}</div>
        <div className="orca-card orca-card-pad"><div className="orca-eyebrow">Vessel activity</div><div className="orca-h2" style={{ marginTop: 6 }}>7 nearby</div><p className="orca-muted" style={{ fontSize: 11, margin: '5px 0 0' }}>Last position received 18 min ago. Your vessel is shown in navy.</p><div style={{ marginTop: 14 }}><FreshnessBadge status="STALE" text="AIS positions · 18 min" /></div></div>
      </aside>
    </div>
  </div>;
}

function AlertsPage() {
  const [filter, setFilter] = useState<'ALL' | AlertSeverity>('ALL');
  const [dismissed, setDismissed] = useState<string[]>([]);
  const shown = alerts.filter((alert) => (filter === 'ALL' || alert.severity === filter) && !dismissed.includes(alert.id));
  return <div>
    <DemoBanner />
    <div className="orca-page-head"><div><div className="orca-eyebrow">Proactive watch</div><h1 className="orca-h1">Alerts worth your attention.</h1><p className="orca-muted" style={{ margin: 0 }}>Signals are ordered by what could change a safe departure today.</p></div><FreshnessBadge status="LIVE" text="Monitoring 4 signals" /></div>
    <div className="orca-alerts-grid">
      <section className="orca-card"><div className="orca-filter-bar">{(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((item) => <button key={item} className={`orca-filter ${filter === item ? 'active' : ''}`} onClick={() => setFilter(item)} data-testid={`button-filter-${item.toLowerCase()}`}>{item === 'ALL' ? 'All alerts' : `${item[0]}${item.slice(1).toLowerCase()} priority`}</button>)}<span style={{ marginLeft: 'auto', color: '#8aa0a5', fontSize: 10 }} data-testid="text-alert-count">{shown.length} showing</span></div>{shown.length > 0 ? shown.map((alert) => <FeedAlert key={alert.id} alert={alert} onDismiss={() => setDismissed((current) => [...current, alert.id])} />) : <div className="orca-empty" data-testid="empty-alerts"><Check size={20} color="#1aa695" style={{ marginBottom: 8 }} /><div>Nothing else needs your attention.</div></div>}</section>
      <aside className="orca-card orca-card-pad"><div className="orca-eyebrow">Alert guidance</div><div className="orca-h2" style={{ margin: '6px 0 7px' }}>Read the signal, not just the colour.</div><p className="orca-muted" style={{ fontSize: 11 }}>A red alert is not automatically a no-go. ORCA weighs where it is, when it will arrive and whether your route intersects it.</p><div style={{ marginTop: 17, display: 'flex', flexDirection: 'column', gap: 8 }}><div><FreshnessBadge status="LIVE" text="Live" /><span style={{ marginLeft: 8, fontSize: 10, color: '#728a92' }}>newly observed</span></div><div><FreshnessBadge status="CACHED" text="Cached" /><span style={{ marginLeft: 8, fontSize: 10, color: '#728a92' }}>available offline</span></div><div><FreshnessBadge status="STALE" text="Stale" /><span style={{ marginLeft: 8, fontSize: 10, color: '#728a92' }}>use with caution</span></div></div></aside>
    </div>
  </div>;
}

function FeedAlert({ alert, onDismiss }: { alert: typeof alerts[number]; onDismiss: () => void }) {
  const Icon = alert.icon;
  const tone = alert.severity.toLowerCase();
  return <div className="orca-feed-item" data-testid={`alert-row-${alert.id}`}><div className={`orca-feed-severity ${tone}`}><Icon size={17} /></div><div><div className="orca-feed-title">{alert.title}</div><div className="orca-feed-copy">{alert.body}</div><div style={{ marginTop: 7, color: '#8aa0a5', fontSize: 9 }}>{alert.source}</div></div><div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}><span className="orca-feed-time">{alert.time}</span><button className="orca-icon-button" onClick={onDismiss} aria-label={`Dismiss ${alert.title}`} data-testid={`button-dismiss-${alert.id}`}><X size={13} /></button></div></div>;
}

function RoutePlanner() {
  const [origin, setOrigin] = useState('Malpe Harbour');
  const [destination, setDestination] = useState('PFZ 04');
  const [departure, setDeparture] = useState('05:30');
  const [result, setResult] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); setResult(true); };
  return <div>
    <DemoBanner />
    <div className="orca-page-head"><div><div className="orca-eyebrow">Trip planning</div><h1 className="orca-h1">Know the route before you cast off.</h1><p className="orca-muted" style={{ margin: 0 }}>Compare departure time, destination and conditions in one calm view.</p></div><div className="orca-statusline"><span className="orca-dot orca-dot-pulse" />Risk engine ready</div></div>
    <div className="orca-route-grid">
      <section className="orca-card orca-card-pad"><div className="orca-eyebrow">Build a trip</div><div className="orca-h2" style={{ marginTop: 6, marginBottom: 19 }}>Where are you heading?</div><form className="orca-form" onSubmit={submit}><div className="orca-field"><label htmlFor="origin">Departure point</label><div style={{ position: 'relative' }}><Navigation size={14} color="#159b99" style={{ position: 'absolute', left: 12, top: 12 }} /><input id="origin" value={origin} onChange={(event) => setOrigin(event.target.value)} style={{ paddingLeft: 35 }} data-testid="input-route-origin" /></div></div><div className="orca-route-line"><span>to</span></div><div className="orca-field"><label htmlFor="destination">Destination or fishing zone</label><div style={{ position: 'relative' }}><Anchor size={14} color="#159b99" style={{ position: 'absolute', left: 12, top: 12 }} /><input id="destination" value={destination} onChange={(event) => setDestination(event.target.value)} style={{ paddingLeft: 35 }} data-testid="input-route-destination" /></div></div><div className="orca-field-row"><div className="orca-field"><label htmlFor="departure">Leave at</label><input id="departure" type="time" value={departure} onChange={(event) => setDeparture(event.target.value)} data-testid="input-route-departure" /></div><div className="orca-field"><label htmlFor="duration">Trip duration</label><select id="duration" defaultValue="8 hours" data-testid="select-route-duration"><option>4 hours</option><option>8 hours</option><option>12 hours</option></select></div></div><button className="orca-button orca-button-primary" type="submit" data-testid="button-check-route"><RouteIcon size={15} />Check route safety</button></form></section>
      <section className="orca-card orca-card-pad" data-testid="card-route-result"><div className="orca-eyebrow">Route safety result</div>{result ? <><div className="orca-result-verdict" style={{ marginTop: 15 }}><div className="orca-result-word">GO</div><div className="orca-result-text">Your route from {origin} to {destination} is suitable if you leave at {departure}. Return before 16:00 as winds build offshore.</div></div><div className="orca-route-stat"><div><strong>18.4</strong><span>nautical miles</span></div><div><strong>0.8 m</strong><span>peak wave</span></div><div><strong>16:00</strong><span>return by</span></div></div><div style={{ marginTop: 18 }}><div className="orca-eyebrow">Why this route works</div><div className="orca-trace"><div className="orca-trace-icon"><Check size={14} /></div><div><div className="orca-trace-name">Clear departure window</div><div className="orca-trace-note">The first 4 hours remain below the caution threshold for wind and wave height.</div></div></div><div className="orca-trace"><div className="orca-trace-icon"><ShieldCheck size={14} /></div><div><div className="orca-trace-name">Boundary distance checked</div><div className="orca-trace-note">The route keeps 3.8 nautical miles from the seasonal regulated boundary.</div></div></div></div></> : <div className="orca-empty" style={{ paddingTop: 100, paddingBottom: 100 }}><RouteIcon size={27} color="#74bdbb" style={{ marginBottom: 9 }} /><div>Enter your trip details to see a route safety answer.</div><div style={{ fontSize: 10, marginTop: 5 }}>ORCA will check the same evidence as your overview.</div></div>}</section>
    </div>
  </div>;
}

function About() {
  return <div>
    <div className="orca-page-head"><div><div className="orca-eyebrow">The ORCA field guide</div><h1 className="orca-h1">Clarity at the water’s edge.</h1><p className="orca-muted" style={{ margin: 0 }}>The short version of how ORCA helps you make a safer call.</p></div><div className="orca-mark" style={{ width: 46, height: 46, borderRadius: 14 }}><Fish size={24} /></div></div>
    <div className="orca-about-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <section className="orca-card orca-about-block"><div className="orca-eyebrow">01 · Plain language first</div><h3>ORCA answers “Can I go?”</h3><p>ORCA turns many separate signals — weather, waves, ocean colour, satellite nowcasts and mapped boundaries — into one clear operational answer. You see the verdict, the time window and the reasons behind it.</p></section>
        <section className="orca-card orca-about-block"><div className="orca-eyebrow">02 · Verdicts</div><h3>GO, CAUTION or NO-GO are signed outputs.</h3><p>The safety verdict is produced by the risk service after specialist agents compare evidence. The app does not calculate a verdict in your browser. Every answer has a place, a validity window and a confidence level.</p><div style={{ display: 'flex', gap: 8, marginTop: 15, flexWrap: 'wrap' }}><span className="orca-status orca-status-live">GO · suitable</span><span className="orca-status orca-status-stale">CAUTION · plan carefully</span><span className="orca-status orca-status-unavailable">NO-GO · stay ashore</span></div></section>
        <section className="orca-card orca-about-block"><div className="orca-eyebrow">03 · When signal drops</div><h3>Useful offline, honest about limits.</h3><p>The latest trusted verdict and a compact set of safety signals can remain available when you lose coverage. ORCA clearly labels each piece of evidence as LIVE, CACHED, STALE or UNAVAILABLE. It never makes stale data look current.</p></section>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <section className="orca-card orca-about-block"><div className="orca-eyebrow">Evidence in the brief</div><div style={{ marginTop: 9 }}><SourceRow icon={CloudLightning} title="Weather and lightning" source="IMD coastal forecast · INSAT-3D" freshness="LIVE" /><SourceRow icon={Waves} title="Ocean conditions" source="Buoy observations · wave model" freshness="LIVE" /><SourceRow icon={Globe2} title="Satellite and PFZ" source="Ocean colour · chlorophyll signal" freshness="CACHED" /><SourceRow icon={ShieldCheck} title="Boundaries and notices" source="Coastal authority datasets" freshness="STALE" /></div></section>
        <section className="orca-card orca-about-block"><div className="orca-eyebrow">The role of AI</div><h3>Helpful like a trusted colleague.</h3><p>AI is used to coordinate specialist checks and explain their result. It does not invent observations or replace an official warning. When evidence conflicts, ORCA says so and takes the safer path.</p><div style={{ marginTop: 16, display: 'flex', gap: 9, alignItems: 'flex-start', padding: 12, background: '#eff8f7', borderRadius: 10, color: '#42717a', fontSize: 10, lineHeight: 1.5 }}><Info size={15} color="#168d8c" style={{ flex: '0 0 auto' }} />Always use official local instructions and your own seamanship alongside ORCA.</div></section>
        <section className="orca-card orca-about-block"><div className="orca-eyebrow">Made for the coast</div><h3>Small screen. Big consequence.</h3><p>Built for fishermen, coastal authorities and maritime operators who need the useful answer quickly — in English, हिन्दी or తెలుగు, with a clear explanation when there is time to ask why.</p></section>
      </div>
    </div>
  </div>;
}

function SourceRow({ icon: Icon, title, source, freshness }: { icon: typeof CloudLightning; title: string; source: string; freshness: Freshness }) {
  return <div className="orca-source-row" data-testid={`source-row-${title.toLowerCase().replaceAll(' ', '-')}`}><Icon size={17} className="orca-source-icon" /><div className="orca-source-copy" style={{ flex: 1 }}><strong>{title}</strong><span>{source}</span></div><FreshnessBadge status={freshness} /></div>;
}

function Router() {
  const [location] = useLocation();
  return <Shell><ErrorBoundary resetKey={location}><Switch><Route path="/" component={Overview} /><Route path="/assistant" component={Assistant} /><Route path="/map" component={MapWorkspace} /><Route path="/alerts" component={AlertsPage} /><Route path="/route" component={RoutePlanner} /><Route path="/about" component={About} /><Route component={NotFound} /></Switch></ErrorBoundary></Shell>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;