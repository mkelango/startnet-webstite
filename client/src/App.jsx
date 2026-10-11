import { Component, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { LangProvider, useLang } from './lib/i18n.jsx';
import SiteLayout from './layout/SiteLayout.jsx';
import BrandLayout from './layout/BrandLayout.jsx';
import { usePageCta } from './layout/shell.jsx';
import PageLoader from './components/PageLoader.jsx';

// Home is the most common landing page (LCP), so it ships in the entry bundle instead of a route chunk.
import Home from './pages/Home.jsx';

// Route table. Every other page is code-split. File ownership is listed in /docs/CONTRACT.md.
const Join = lazy(() => import('./pages/Join.jsx'));

const About = lazy(() => import('./pages/about/About.jsx'));
const Mission = lazy(() => import('./pages/about/Mission.jsx'));
const HowWeWork = lazy(() => import('./pages/about/HowWeWork.jsx'));
const Leadership = lazy(() => import('./pages/about/Leadership.jsx'));
const EvidenceStandard = lazy(() => import('./pages/about/EvidenceStandard.jsx'));
const Governance = lazy(() => import('./pages/about/Governance.jsx'));
const ThinkTN = lazy(() => import('./pages/about/ThinkTN.jsx'));

const OurBrands = lazy(() => import('./pages/brands/OurBrands.jsx'));
const ResearchHome = lazy(() => import('./pages/brands/research/ResearchHome.jsx'));
const ResearchSub = lazy(() => import('./pages/brands/research/ResearchSub.jsx'));
const VibeHome = lazy(() => import('./pages/brands/vibe/VibeHome.jsx'));
const VibeSub = lazy(() => import('./pages/brands/vibe/VibeSub.jsx'));
const Vibathon = lazy(() => import('./pages/brands/vibe/Vibathon.jsx'));
const ConnectHome = lazy(() => import('./pages/brands/connect/ConnectHome.jsx'));
const ConnectSub = lazy(() => import('./pages/brands/connect/ConnectSub.jsx'));
const WomenHome = lazy(() => import('./pages/brands/women/WomenHome.jsx'));
const WomenSub = lazy(() => import('./pages/brands/women/WomenSub.jsx'));

const Programmes = lazy(() => import('./pages/programmes/Programmes.jsx'));
const ProgrammeDetail = lazy(() => import('./pages/programmes/ProgrammeDetail.jsx'));
const Events = lazy(() => import('./pages/events/Events.jsx'));
const PastEvents = lazy(() => import('./pages/events/PastEvents.jsx'));

const Insights = lazy(() => import('./pages/insights/Insights.jsx'));
const FounderLedger = lazy(() => import('./pages/insights/FounderLedger.jsx'));
const Stories = lazy(() => import('./pages/insights/Stories.jsx'));
const StoryDetail = lazy(() => import('./pages/insights/StoryDetail.jsx'));
const Reports = lazy(() => import('./pages/insights/Reports.jsx'));

const StartNetX = lazy(() => import('./pages/snx/StartNetX.jsx'));
const SnxModules = lazy(() => import('./pages/snx/Modules.jsx'));
const SnxPricing = lazy(() => import('./pages/snx/Pricing.jsx'));
const SnxTrust = lazy(() => import('./pages/snx/Trust.jsx'));

const Partner = lazy(() => import('./pages/partner/Partner.jsx'));
const PartnerType = lazy(() => import('./pages/partner/PartnerType.jsx'));
const Enquire = lazy(() => import('./pages/partner/Enquire.jsx'));
const OurPartners = lazy(() => import('./pages/partner/OurPartners.jsx'));

const Media = lazy(() => import('./pages/utility/Media.jsx'));
const Careers = lazy(() => import('./pages/utility/Careers.jsx'));
const Contact = lazy(() => import('./pages/utility/Contact.jsx'));
const Search = lazy(() => import('./pages/utility/Search.jsx'));
const Legal = lazy(() => import('./pages/utility/Legal.jsx'));
const Sitemap = lazy(() => import('./pages/utility/Sitemap.jsx'));
const NotFound = lazy(() => import('./pages/utility/NotFound.jsx'));

// Pages added after the first build (Book routes linked from menus/footer). Resolved through a glob so a
// page that has not landed yet falls back to NotFound instead of breaking the build.
const newPages = import.meta.glob('./pages/new/*.jsx');
const newPage = (name) =>
  lazy(() => (newPages[`./pages/new/${name}.jsx`] || (() => import('./pages/utility/NotFound.jsx')))());
const OpenCalls = newPage('OpenCalls');
const SpeakMentor = newPage('SpeakMentor');
const Corrections = newPage('Corrections');
const Districts = newPage('Districts');

// Mega-menu pages (client/src/pages/mega/<group>/; each group's routes.js is its manifest).
// StartNet X: Built for (snx-audiences); The platform and Developers (snx-extras)
const SnxFounders = lazy(() => import('./pages/mega/snx-audiences/Founders.jsx'));
const SnxInstitutions = lazy(() => import('./pages/mega/snx-audiences/Institutions.jsx'));
const SnxIncubators = lazy(() => import('./pages/mega/snx-audiences/Incubators.jsx'));
const SnxGccs = lazy(() => import('./pages/mega/snx-audiences/Gccs.jsx'));
const SnxGovernment = lazy(() => import('./pages/mega/snx-audiences/Government.jsx'));
const SnxInvestors = lazy(() => import('./pages/mega/snx-audiences/Investors.jsx'));
const SnxAgents = lazy(() => import('./pages/mega/snx-extras/Agents.jsx'));
const SnxDevelopers = lazy(() => import('./pages/mega/snx-extras/Developers.jsx'));
const SnxUpdates = lazy(() => import('./pages/mega/snx-extras/Updates.jsx'));
// Insights (insights-ledger, insights-reports)
const LedgerMethodology = lazy(() => import('./pages/mega/insights-ledger/Methodology.jsx'));
const LedgerPeriod = lazy(() => import('./pages/mega/insights-ledger/LedgerPeriod.jsx'));
const Newsletter = lazy(() => import('./pages/mega/insights-ledger/Newsletter.jsx'));
const Indices = lazy(() => import('./pages/mega/insights-reports/Indices.jsx'));
const IndexDetail = lazy(() => import('./pages/mega/insights-reports/IndexDetail.jsx'));
const ReportDetail = lazy(() => import('./pages/mega/insights-reports/ReportDetail.jsx'));
const Podcast = lazy(() => import('./pages/mega/insights-reports/Podcast.jsx'));
// Events (events-series, events-extra). /events/:slug renders a series page or the event detail page.
const EventsSlugDispatcher = lazy(() => import('./pages/mega/events-series/EventsSlugDispatcher.jsx'));
const EditionPage = lazy(() => import('./pages/mega/events-series/EditionPage.jsx'));
const HostEvent = lazy(() => import('./pages/mega/events-extra/HostEvent.jsx'));
const FoundersDay = lazy(() => import('./pages/mega/events-extra/FoundersDay.jsx'));
// Brand sub-pages (brand-sub), rendered inside their BrandLayout
const ResearchLab = lazy(() => import('./pages/mega/brand-sub/ResearchLab.jsx'));
const BrandStories = lazy(() => import('./pages/mega/brand-sub/BrandStories.jsx'));
const BrandEvents = lazy(() => import('./pages/mega/brand-sub/BrandEvents.jsx'));
const WomenAwards = lazy(() => import('./pages/mega/brand-sub/WomenAwards.jsx'));
// Who we are (about-districts)
const SelfDiagnosis = lazy(() => import('./pages/mega/about-districts/SelfDiagnosis.jsx'));
const DistrictPage = lazy(() => import('./pages/mega/about-districts/DistrictPage.jsx'));
// Media and careers (media-careers)
const MediaKit = lazy(() => import('./pages/mega/media-careers/MediaKit.jsx'));
const PressRelease = lazy(() => import('./pages/mega/media-careers/PressRelease.jsx'));
const JobDetail = lazy(() => import('./pages/mega/media-careers/JobDetail.jsx'));
// Reserved roots (utility-campaign). SiteLayout shows these with the minimal header (layout/shell.jsx isMinimalPath).
const SignIn = lazy(() => import('./pages/mega/utility-campaign/SignIn.jsx'));
const SignUp = lazy(() => import('./pages/mega/utility-campaign/SignUp.jsx'));
// The campaign page and its content map load as one chunk, so the bottom bar gets the campaign CTA
// (campaignBottomCta) without pulling campaigns.js into the entry bundle.
const CampaignLanding = lazy(() =>
  Promise.all([
    import('./pages/mega/utility-campaign/CampaignLanding.jsx'),
    import('./pages/mega/utility-campaign/campaigns.js'),
  ]).then(([page, campaigns]) => {
    const Page = page.default;
    function CampaignRoute() {
      const { slug = '' } = useParams();
      const { lang } = useLang();
      const { search } = useLocation();
      usePageCta(campaigns.campaignBottomCta(slug, lang, search));
      return <Page />;
    }
    return { default: CampaignRoute };
  })
);

/** Vanity URL → canonical page, keeping the current language (/ta/mission → /ta/about/mission-1-lakh). */
function LocaleRedirect({ to }) {
  const { localePath } = useLang();
  return <Navigate to={localePath(to)} replace />;
}

/** Full reload of the current page without its #fragment (a malformed hash must not crash the page again). */
const reloadWithoutHash = () => {
  const { pathname, search } = window.location;
  window.location.assign(pathname + search);
};

/**
 * Catches render errors and failed lazy-chunk loads (e.g. a stale chunk after a redeploy) for the routed
 * page only, so the header, footer and navigation stay usable. Resets when the path changes.
 */
class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, pathname: props.pathname };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  static getDerivedStateFromProps(props, state) {
    return props.pathname !== state.pathname ? { error: null, pathname: props.pathname } : null;
  }
  componentDidCatch(error) {
    if (typeof console !== 'undefined') console.error('[route]', error);
  }
  render() {
    if (!this.state.error) return this.props.children;
    const t = this.props.t || ((en) => en);
    return (
      <section className="route-error container" role="alert" aria-labelledby="route-error-title">
        <h1 id="route-error-title" className="h2">
          {t("This page didn't load", 'இந்தப் பக்கம் ஏற்றப்படவில்லை')}<span className="dot">.</span>
        </h1>
        <p className="text-2">
          {t(
            'A connection hiccup or a site update stopped it. Reloading usually fixes it.',
            'இணைப்புச் சிக்கல் அல்லது தளப் புதுப்பிப்பு காரணமாக இருக்கலாம். மீண்டும் ஏற்றினால் பொதுவாகச் சரியாகும்.'
          )}
        </p>
        <button type="button" className="route-error__btn" onClick={reloadWithoutHash}>
          {t('Reload', 'மீண்டும் ஏற்று')}
        </button>
      </section>
    );
  }
}

/** Pathless layout route: wraps every page (inside SiteLayout's <main>) in the error boundary. */
function RouteGuard() {
  const { pathname } = useLocation();
  const { t } = useLang();
  return (
    <RouteErrorBoundary pathname={pathname} t={t}>
      <Outlet />
    </RouteErrorBoundary>
  );
}

function routes() {
  return (
    <Route element={<RouteGuard />}>
      <Route index element={<Home />} />
      <Route path="join" element={<Join />} />

      <Route path="about" element={<About />} />
      <Route path="about/mission-1-lakh" element={<Mission />} />
      <Route path="about/how-we-work" element={<HowWeWork />} />
      <Route path="about/leadership" element={<Leadership />} />
      <Route path="about/evidence-standard" element={<EvidenceStandard />} />
      <Route path="about/governance" element={<Governance />} />
      <Route path="about/thinktn-alliance" element={<ThinkTN />} />
      <Route path="about/self-diagnosis" element={<SelfDiagnosis />} />

      {/* Brand folders: static children (stories, events, labs/:lab, summit/awards) rank above ":slug". */}
      <Route path="brands" element={<OurBrands />} />
      <Route path="research" element={<BrandLayout brand="research" />}>
        <Route index element={<ResearchHome />} />
        <Route path="labs/:lab" element={<ResearchLab />} />
        <Route path="stories" element={<BrandStories />} />
        <Route path="events" element={<BrandEvents />} />
        <Route path=":slug" element={<ResearchSub />} />
      </Route>
      <Route path="vibe" element={<BrandLayout brand="vibe" />}>
        <Route index element={<VibeHome />} />
        <Route path="vibathon" element={<Vibathon />} />
        <Route path="stories" element={<BrandStories />} />
        <Route path="events" element={<BrandEvents />} />
        <Route path=":slug" element={<VibeSub />} />
      </Route>
      <Route path="connect" element={<BrandLayout brand="connect" />}>
        <Route index element={<ConnectHome />} />
        <Route path="stories" element={<BrandStories />} />
        <Route path="events" element={<BrandEvents />} />
        <Route path=":slug" element={<ConnectSub />} />
      </Route>
      <Route path="women" element={<BrandLayout brand="women" />}>
        <Route index element={<WomenHome />} />
        <Route path="stories" element={<BrandStories />} />
        <Route path="events" element={<BrandEvents />} />
        <Route path="summit/awards" element={<WomenAwards />} />
        <Route path=":slug" element={<WomenSub />} />
      </Route>

      <Route path="programmes" element={<Programmes />} />
      <Route path="programmes/open-calls" element={<OpenCalls />} />
      <Route path="programmes/:slug" element={<ProgrammeDetail />} />
      <Route path="events" element={<Events />} />
      <Route path="events/past" element={<PastEvents />} />
      <Route path="events/speak" element={<SpeakMentor />} />
      <Route path="events/host" element={<HostEvent />} />
      <Route path="events/founders-day" element={<FoundersDay />} />
      <Route path="events/:slug" element={<EventsSlugDispatcher />} />
      <Route path="events/:series/:edition" element={<EditionPage />} />
      <Route path="events/:series/:edition/agenda" element={<EditionPage />} />
      <Route path="events/:series/:edition/speakers" element={<EditionPage />} />

      <Route path="insights" element={<Insights />} />
      <Route path="insights/founder-ledger" element={<FounderLedger />} />
      <Route path="insights/founder-ledger/corrections" element={<Corrections />} />
      <Route path="insights/founder-ledger/methodology" element={<LedgerMethodology />} />
      <Route path="insights/founder-ledger/:period" element={<LedgerPeriod />} />
      <Route path="insights/stories" element={<Stories />} />
      <Route path="insights/stories/:slug" element={<StoryDetail />} />
      <Route path="insights/reports" element={<Reports />} />
      <Route path="insights/reports/:slug" element={<ReportDetail />} />
      <Route path="insights/indices" element={<Indices />} />
      <Route path="insights/indices/:index" element={<IndexDetail />} />
      <Route path="insights/podcast" element={<Podcast />} />
      <Route path="insights/newsletter" element={<Newsletter />} />

      <Route path="startnet-x" element={<BrandLayout brand="x" />}>
        <Route index element={<StartNetX />} />
        <Route path="modules" element={<SnxModules />} />
        <Route path="pricing" element={<SnxPricing />} />
        <Route path="trust" element={<SnxTrust />} />
        <Route path="agents" element={<SnxAgents />} />
        <Route path="updates" element={<SnxUpdates />} />
        <Route path="developers" element={<SnxDevelopers />} />
        <Route path="founders" element={<SnxFounders />} />
        <Route path="institutions" element={<SnxInstitutions />} />
        <Route path="incubators" element={<SnxIncubators />} />
        <Route path="gccs" element={<SnxGccs />} />
        <Route path="government" element={<SnxGovernment />} />
        <Route path="investors" element={<SnxInvestors />} />
      </Route>

      <Route path="partner" element={<Partner />} />
      <Route path="partner/enquire" element={<Enquire />} />
      <Route path="partner/our-partners" element={<OurPartners />} />
      <Route path="partner/:type" element={<PartnerType />} />

      <Route path="media" element={<Media />} />
      <Route path="media/kit" element={<MediaKit />} />
      <Route path="media/releases/:slug" element={<PressRelease />} />
      <Route path="careers" element={<Careers />} />
      <Route path="careers/:slug" element={<JobDetail />} />
      <Route path="contact" element={<Contact />} />
      <Route path="search" element={<Search />} />
      <Route path="legal/:slug" element={<Legal />} />
      <Route path="sitemap" element={<Sitemap />} />
      <Route path="districts" element={<Districts />} />
      <Route path="districts/:district" element={<DistrictPage />} />

      {/* Reserved roots (Book 1 Part B §6.4): minimal header, noindex, not in the sitemap */}
      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="go/:slug" element={<CampaignLanding />} />

      {/* Vanity URLs (Book 1 Part B) */}
      <Route path="mission" element={<LocaleRedirect to="/about/mission-1-lakh" />} />
      <Route path="ledger" element={<LocaleRedirect to="/insights/founder-ledger" />} />
      <Route path="vibathon" element={<LocaleRedirect to="/vibe/vibathon" />} />
      <Route path="apply" element={<LocaleRedirect to="/programmes/open-calls" />} />
      <Route path="snx" element={<LocaleRedirect to="/startnet-x" />} />

      <Route path="*" element={<NotFound />} />
    </Route>
  );
}

/**
 * Last-resort boundary for errors in the shell itself (outside the routed page). Like RouteErrorBoundary it
 * clears the error when the path changes, so Back/Forward recovers instead of leaving the panel up (it is not
 * keyed by path: that would remount the whole shell on every navigation). Reload loads pathname + search
 * only, dropping a #fragment that may have caused the crash (e.g. a malformed hash).
 */
class ShellErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, pathname: props.pathname };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  static getDerivedStateFromProps(props, state) {
    return props.pathname !== state.pathname ? { error: null, pathname: props.pathname } : null;
  }
  componentDidCatch(error) {
    if (typeof console !== 'undefined') console.error('[shell]', error);
  }
  render() {
    if (!this.state.error) return this.props.children;
    const t = this.props.t || ((en) => en);
    const home = this.props.home || '/';
    return (
      <section className="route-error container" role="alert" aria-labelledby="shell-error-title">
        <h1 id="shell-error-title" className="h2">
          {t("This page didn't load", 'இந்தப் பக்கம் ஏற்றப்படவில்லை')}<span className="dot">.</span>
        </h1>
        <p className="text-2">
          {t(
            'Something went wrong while showing it. Reloading usually fixes it.',
            'இதைக் காட்டும்போது ஏதோ தவறு நடந்தது. மீண்டும் ஏற்றினால் பொதுவாகச் சரியாகும்.'
          )}
        </p>
        <div className="cluster">
          <button type="button" className="route-error__btn" onClick={reloadWithoutHash}>
            {t('Reload', 'மீண்டும் ஏற்று')}
          </button>
          <a className="route-error__link" href={home}>
            {t('Go to the home page', 'முகப்புப் பக்கத்துக்குச் செல்')}
          </a>
        </div>
      </section>
    );
  }
}

/** Feeds ShellErrorBoundary the path (to reset on navigation) and the language helpers. */
function ShellGuard({ children }) {
  const { pathname } = useLocation();
  const { t, localePath } = useLang();
  return (
    <ShellErrorBoundary pathname={pathname} t={t} home={localePath('/')}>
      {children}
    </ShellErrorBoundary>
  );
}

export default function App() {
  return (
    <LangProvider>
      <ShellGuard>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<SiteLayout />}>{routes()}</Route>
            <Route path="/ta" element={<SiteLayout />}>{routes()}</Route>
          </Routes>
        </Suspense>
      </ShellGuard>
    </LangProvider>
  );
}
