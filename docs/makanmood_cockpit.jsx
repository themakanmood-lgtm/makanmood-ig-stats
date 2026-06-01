import React, { useState, useMemo } from "react";
import {
  Instagram,
  Facebook,
  Youtube,
  Music2,
  MessageSquare,
  Sun,
  Moon,
  Menu,
  X,
  Send,
  Sparkles,
  Compass,
  BarChart3,
  Target,
  Wand2,
  PenLine,
  MessageCircle,
  Zap,
  Shield,
  Home,
  ChevronRight,
  Eye,
  Heart,
  Bookmark,
  UserPlus,
  Upload,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Circle,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// THEME
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const THEMES = {
  dark: {
    bg: "#0E100D",
    elevated: "#161915",
    elevated2: "#1F221D",
    border: "#252823",
    borderStrong: "#33372F",
    text: "#E8EAE3",
    textSoft: "#9DA098",
    textMute: "#62655D",
    accent: "#A8C2A4",
    accentBright: "#C2D8BE",
    accentDim: "#3A4A3B",
    accentGlow: "rgba(168, 194, 164, 0.12)",
    danger: "#D08775",
    warn: "#D4B97A",
    success: "#A8C2A4",
  },
  light: {
    bg: "#F7F6F1",
    elevated: "#FFFFFF",
    elevated2: "#EEEDE7",
    border: "#E2E0D8",
    borderStrong: "#CFCDC3",
    text: "#1A1C18",
    textSoft: "#5C5F55",
    textMute: "#8B8E83",
    accent: "#5E7A60",
    accentBright: "#738C75",
    accentDim: "#B4C7B0",
    accentGlow: "rgba(94, 122, 96, 0.08)",
    danger: "#A85745",
    warn: "#9C7A2C",
    success: "#5E7A60",
  },
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DATA
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const BRAND = {
  name: "Makan Mood",
  handle: "@makanmoodjournal",
  user: "Zaki",
};

const NETWORKS = [
  { id: "instagram", name: "Instagram", short: "IG", icon: Instagram, status: "active" },
  { id: "tiktok", name: "TikTok", short: "TT", icon: Music2, status: "todo", note: "Ã€ connecter" },
  { id: "facebook", name: "Facebook", short: "FB", icon: Facebook, status: "todo", note: "Ã€ connecter" },
  { id: "whatsapp", name: "WhatsApp", short: "WA", icon: MessageSquare, status: "soon", note: "Ã€ venir" },
  { id: "youtube", name: "YouTube", short: "YT", icon: Youtube, status: "soon", note: "Ã€ venir" },
];

const AGENTS = [
  {
    id: "manager",
    name: "Manager IA",
    icon: Compass,
    role: "Chef d'orchestre",
    pitch: "Coordonne l'Ã©quipe, fait remonter les signaux, valide les dÃ©cisions.",
    status: "actif",
    cta: "Discuter",
  },
  {
    id: "analyste",
    name: "Analyste Instagram",
    icon: BarChart3,
    role: "Lecture des chiffres",
    pitch: "Lit les stats Phase 1, identifie les tendances, prÃ©pare les rapports.",
    status: "actif",
    cta: "Voir l'analyse",
  },
  {
    id: "stratege",
    name: "StratÃ¨ge Croissance",
    icon: Target,
    role: "Plan Ã©ditorial",
    pitch: "Construit les sprints, repÃ¨re les fenÃªtres Ã©vÃ©nementielles, oriente le ton.",
    status: "actif",
    cta: "Voir le plan",
  },
  {
    id: "createur",
    name: "Directeur CrÃ©atif",
    icon: Wand2,
    role: "RÃ©alisation Â· 3 variantes par rush",
    pitch: "ReÃ§oit tes rushes vidÃ©o et photo, lit la stratÃ©gie en cours, et te livre 3 variantes complÃ¨tes de rÃ©alisation (storyboard, hook 3s, coupes, lÃ©gende, musique) prÃªtes Ã  exÃ©cuter dans TikTok ou CapCut.",
    status: "actif",
    cta: "Soumettre un rush",
  },
  {
    id: "redacteur",
    name: "RÃ©dacteur",
    icon: PenLine,
    role: "LÃ©gendes & copy",
    pitch: "Ã‰crit les lÃ©gendes, hashtags, scripts. DÃ©cline le ton de la marque.",
    status: "en attente",
    cta: "Briefer",
  },
  {
    id: "community",
    name: "Community Manager",
    icon: MessageCircle,
    role: "Conversations",
    pitch: "PrÃ©pare des rÃ©ponses aux DM et commentaires. Aucune publication auto en Phase 1.",
    status: "en attente",
    cta: "PrÃ©parer",
  },
  {
    id: "auto",
    name: "Automatisation",
    icon: Zap,
    role: "Pipelines techniques",
    pitch: "GitHub Actions, parsers, exports. Synchro toutes les 6h.",
    status: "actif",
    cta: "Voir le pipeline",
  },
  {
    id: "brand",
    name: "Brand Keeper",
    icon: Shield,
    role: "Garde-fou identitÃ©",
    pitch: "Veille Ã  ce qu'aucune marque ne se mÃ©lange. Valide les visuels et le ton.",
    status: "en attente",
    cta: "Charte",
  },
];

const IG_DATA = {
  followers: 43,
  followersDelta: -1,
  followersGoal: 100,
  lastPost: {
    title: "BientÃ´t l'AÃ¯d",
    subtitle: "MarchÃ© aux moutons Â· Rabat",
    views: 1478,
    likes: 36,
    saves: 6,
    shares: 2,
    newFollowers: 2,
    avgWatchSec: 8,
  },
  // DonnÃ©es simulÃ©es â€” Phase 1 vient de dÃ©marrer, l'historique se construit
  followersTrend: [
    { d: "19", v: 44 },
    { d: "20", v: 44 },
    { d: "21", v: 44 },
    { d: "22", v: 44 },
    { d: "23", v: 44 },
    { d: "24", v: 43 },
    { d: "25", v: 43 },
  ],
  viewsTrend: [
    { d: "19", v: 120 },
    { d: "20", v: 0 },
    { d: "21", v: 0 },
    { d: "22", v: 240 },
    { d: "23", v: 1478 },
    { d: "24", v: 0 },
    { d: "25", v: 0 },
  ],
  demographics: [
    { name: "Femmes", value: 58 },
    { name: "Hommes", value: 40 },
    { name: "Autre", value: 2 },
  ],
  topCities: [
    { name: "Rabat", v: 41 },
    { name: "Casablanca", v: 22 },
    { name: "SalÃ©", v: 14 },
    { name: "Marrakech", v: 9 },
  ],
};

const RECENT_ACTIVITY = [
  { who: "Automatisation", what: "Synchro Sheet Â· 5 blocs collectÃ©s", when: "il y a 2 h" },
  { who: "StratÃ¨ge", what: "Plan Ã©ditorial 30 j publiÃ© Â· 6 piliers", when: "hier, 18:42" },
  { who: "Analyste IG", what: "Rapport post Â« BientÃ´t l'AÃ¯d Â» prÃªt", when: "hier, 17:10" },
  { who: "Manager IA", what: "Audit Phase 1 validÃ© Â· lecture seule confirmÃ©e", when: "il y a 2 j" },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// FONT & GLOBAL CSS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; }
  .mm-app, .mm-app * {
    font-family: 'Geist', ui-sans-serif, system-ui, -apple-system, sans-serif;
    font-feature-settings: "ss01", "cv01";
  }
  .mono {
    font-family: 'Geist Mono', ui-monospace, monospace;
    font-feature-settings: "tnum";
  }
  .scrollbar-soft::-webkit-scrollbar { width: 8px; height: 8px; }
  .scrollbar-soft::-webkit-scrollbar-thumb { background: rgba(160,160,160,0.2); border-radius: 4px; }
  .scrollbar-soft::-webkit-scrollbar-track { background: transparent; }

  .pulse-dot {
    animation: mm-pulse 2.4s ease-in-out infinite;
  }
  @keyframes mm-pulse {
    0%, 100% { opacity: 0.4; transform: scale(0.9); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  .chat-pop {
    animation: chat-in 240ms cubic-bezier(.2,.9,.3,1);
  }
  @keyframes chat-in {
    from { opacity: 0; transform: translateY(8px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .agent-card { transition: border-color 160ms ease, transform 160ms ease; }
  .agent-card:hover { transform: translateY(-1px); }
`;

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PRIMITIVES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const Card = ({ children, theme, padded = true, className = "", style = {} }) => (
  <div
    className={className}
    style={{
      background: theme.elevated,
      border: `1px solid ${theme.border}`,
      borderRadius: 14,
      padding: padded ? 20 : 0,
      ...style,
    }}
  >
    {children}
  </div>
);

const Kicker = ({ children, theme, color }) => (
  <div
    className="uppercase"
    style={{
      color: color || theme.textMute,
      fontSize: 10,
      letterSpacing: "0.16em",
      fontWeight: 500,
    }}
  >
    {children}
  </div>
);

const StatusDot = ({ status, theme }) => {
  const c =
    status === "actif"
      ? theme.success
      : status === "en attente"
      ? theme.warn
      : theme.textMute;
  return (
    <span
      className={status === "actif" ? "pulse-dot" : ""}
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: 999,
        background: c,
      }}
    />
  );
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SIDEBAR
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function Sidebar({
  theme,
  themeMode,
  setThemeMode,
  currentView,
  setCurrentView,
  selectedNetwork,
  setSelectedNetwork,
  isMobileDrawer = false,
  onCloseDrawer,
}) {
  const navItems = [
    { id: "home", label: "Accueil", icon: Home },
    ...AGENTS.map((a) => ({ id: a.id, label: a.name, icon: a.icon })),
  ];

  return (
    <aside
      className="scrollbar-soft"
      style={{
        width: 264,
        height: "100%",
        background: theme.elevated,
        borderRight: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* Logo + close (mobile) */}
      <div
        style={{
          padding: "20px 20px 16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentBright})`,
              display: "grid",
              placeItems: "center",
              color: theme.bg,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            M
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>
              {BRAND.name}
            </span>
            <span style={{ color: theme.textMute, fontSize: 10 }}>
              Cockpit IA Â· Phase 1
            </span>
          </div>
        </div>
        {isMobileDrawer && (
          <button
            onClick={onCloseDrawer}
            style={{
              background: "transparent",
              border: 0,
              color: theme.textSoft,
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* RÃ©seau */}
      <div style={{ padding: "8px 16px 14px 16px" }}>
        <Kicker theme={theme}>RÃ©seau</Kicker>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {NETWORKS.map((n) => {
            const NIcon = n.icon;
            const active = selectedNetwork === n.id;
            const disabled = n.status !== "active";
            return (
              <button
                key={n.id}
                onClick={() => !disabled && setSelectedNetwork(n.id)}
                disabled={disabled}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 10px",
                  borderRadius: 10,
                  background: active ? theme.accentGlow : "transparent",
                  border: `1px solid ${active ? theme.accentDim : "transparent"}`,
                  color: active ? theme.text : disabled ? theme.textMute : theme.textSoft,
                  cursor: disabled ? "not-allowed" : "pointer",
                  fontSize: 12.5,
                  fontWeight: active ? 500 : 400,
                  opacity: disabled ? 0.55 : 1,
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <NIcon size={14} strokeWidth={1.8} />
                <span style={{ flex: 1 }}>{n.name}</span>
                {disabled ? (
                  <span style={{ fontSize: 9, color: theme.textMute }}>{n.note}</span>
                ) : (
                  <span
                    className="pulse-dot"
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 999,
                      background: theme.accent,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav agents */}
      <div style={{ padding: "8px 16px 14px 16px" }}>
        <Kicker theme={theme}>Cockpit</Kicker>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((it) => {
            const Ic = it.icon;
            const active = currentView === it.id;
            return (
              <button
                key={it.id}
                onClick={() => {
                  setCurrentView(it.id);
                  if (isMobileDrawer) onCloseDrawer();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: active ? theme.elevated2 : "transparent",
                  border: 0,
                  color: active ? theme.text : theme.textSoft,
                  fontSize: 13,
                  fontWeight: active ? 500 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  borderLeft: active
                    ? `2px solid ${theme.accent}`
                    : "2px solid transparent",
                  paddingLeft: active ? 8 : 10,
                }}
              >
                <Ic size={14} strokeWidth={1.7} />
                <span style={{ flex: 1 }}>{it.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer sidebar */}
      <div
        style={{
          marginTop: "auto",
          padding: "14px 16px 18px 16px",
          borderTop: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <button
          onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 10px",
            borderRadius: 10,
            background: theme.elevated2,
            border: `1px solid ${theme.border}`,
            color: theme.textSoft,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {themeMode === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          {themeMode === "dark" ? "Light" : "Dark"}
        </button>
        <div style={{ marginLeft: "auto", fontSize: 10, color: theme.textMute }}>
          v0.2 Â· shell
        </div>
      </div>
    </aside>
  );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CHAT BUBBLE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function ChatBubble({ theme, open, setOpen }) {
  const [draft, setDraft] = useState("");
  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 22,
            right: 22,
            width: 54,
            height: 54,
            borderRadius: 999,
            background: theme.accent,
            border: `1px solid ${theme.accentBright}`,
            boxShadow: `0 10px 30px ${theme.accentGlow}, 0 0 0 6px ${theme.accentGlow}`,
            color: theme.bg,
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            zIndex: 60,
          }}
          aria-label="Ouvrir le chat avec le Manager"
        >
          <Sparkles size={20} strokeWidth={2} />
        </button>
      )}

      {open && (
        <div
          className="chat-pop"
          style={{
            position: "fixed",
            bottom: 22,
            right: 22,
            width: "min(380px, calc(100vw - 32px))",
            height: "min(540px, calc(100vh - 90px))",
            background: theme.elevated,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                background: theme.accentGlow,
                color: theme.accent,
                display: "grid",
                placeItems: "center",
              }}
            >
              <Compass size={15} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: theme.text, fontSize: 13, fontWeight: 500 }}>
                Manager IA
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: theme.textMute,
                  fontSize: 10,
                }}
              >
                <StatusDot status="actif" theme={theme} />
                en ligne Â· Phase 1
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: 0,
                color: theme.textSoft,
                cursor: "pointer",
                padding: 6,
              }}
              aria-label="Fermer le chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div
            className="scrollbar-soft"
            style={{
              flex: 1,
              padding: 16,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                background: theme.elevated2,
                borderRadius: 14,
                borderTopLeftRadius: 4,
                color: theme.text,
                fontSize: 13,
                lineHeight: 1.55,
                maxWidth: "85%",
              }}
            >
              Salut {BRAND.user}. Je suis branchÃ© sur la Phase 1.
              Tu peux me demander l'Ã©tat des chiffres, planifier avec le StratÃ¨ge,
              ou m'envoyer un brief pour l'Ã©quipe.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Kicker theme={theme}>Suggestions</Kicker>
              {[
                "RÃ©sume la performance du dernier post",
                "Quelles actions pour casser le 0 commentaire ?",
                "Qu'est-ce que le StratÃ¨ge a prÃ©vu cette semaine ?",
              ].map((s, i) => (
                <button
                  key={i}
                  onClick={() => setDraft(s)}
                  style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    background: "transparent",
                    border: `1px solid ${theme.border}`,
                    borderRadius: 10,
                    color: theme.textSoft,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <div
            style={{
              padding: 12,
              borderTop: `1px solid ${theme.border}`,
              display: "flex",
              gap: 8,
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Pose ta question au Managerâ€¦"
              style={{
                flex: 1,
                background: theme.elevated2,
                border: `1px solid ${theme.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                color: theme.text,
                fontSize: 13,
                outline: "none",
              }}
            />
            <button
              onClick={() => setDraft("")}
              disabled={!draft.trim()}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: draft.trim() ? theme.accent : theme.elevated2,
                border: `1px solid ${draft.trim() ? theme.accentBright : theme.border}`,
                color: draft.trim() ? theme.bg : theme.textMute,
                cursor: draft.trim() ? "pointer" : "not-allowed",
                display: "grid",
                placeItems: "center",
              }}
              aria-label="Envoyer"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// HOME PAGE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function HomePage({ theme, themeMode, network, setCurrentView }) {
  const isIG = network === "instagram";

  const kpis = isIG
    ? [
        {
          label: "AbonnÃ©s",
          value: IG_DATA.followers,
          delta: { dir: "down", text: `${IG_DATA.followersDelta} cette sem.` },
        },
        {
          label: "Vues Â· dernier post",
          value: IG_DATA.lastPost.views.toLocaleString("fr-FR"),
          delta: { dir: "up", text: `+${IG_DATA.lastPost.newFollowers} abonnÃ©s` },
        },
        {
          label: "Saves",
          value: IG_DATA.lastPost.saves,
          delta: { dir: "down", text: "0.4% des vues" },
        },
        {
          label: "Avant l'AÃ¯d",
          value: "Jâˆ’12",
          delta: { dir: "up", text: "fenÃªtre clÃ©" },
        },
      ]
    : Array(4).fill({ label: "â€”", value: "â€”", delta: { dir: "up", text: "Ã  connecter" } });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header rÃ©seau */}
      <div>
        <Kicker theme={theme} color={theme.accent}>
          Bonjour {BRAND.user}
        </Kicker>
        <div
          style={{
            marginTop: 6,
            color: theme.text,
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          Cockpit{" "}
          <span style={{ color: theme.textSoft }}>Â·</span>{" "}
          <span style={{ color: theme.accent }}>
            {NETWORKS.find((n) => n.id === network)?.name}
          </span>
        </div>
        <div
          style={{
            marginTop: 6,
            color: theme.textSoft,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span>{BRAND.handle}</span>
          <span style={{ color: theme.border }}>Â·</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <StatusDot status="actif" theme={theme} />
            Synchro toutes les 6 h Â· derniÃ¨re il y a 2 h
          </span>
        </div>
      </div>

      {/* Empty state non-IG */}
      {!isIG && (
        <Card theme={theme}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: theme.elevated2,
                color: theme.textSoft,
                display: "grid",
                placeItems: "center",
              }}
            >
              <Circle size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: theme.text, fontSize: 14, fontWeight: 500 }}>
                {NETWORKS.find((n) => n.id === network)?.name} pas encore connectÃ©
              </div>
              <div style={{ color: theme.textSoft, fontSize: 12, marginTop: 2 }}>
                Phase 1 couvre Instagram en lecture seule. Les autres rÃ©seaux viendront
                avec les phases suivantes.
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* KPIs */}
      <section>
        <Kicker theme={theme}>Vue d'ensemble</Kicker>
        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {kpis.map((k, i) => (
            <Card key={i} theme={theme}>
              <div style={{ color: theme.textMute, fontSize: 11, letterSpacing: "0.02em" }}>
                {k.label}
              </div>
              <div
                className="mono"
                style={{
                  color: theme.text,
                  fontSize: 32,
                  fontWeight: 500,
                  marginTop: 8,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {k.value}
              </div>
              {k.delta && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 11,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    color:
                      k.delta.dir === "up" ? theme.success : theme.danger,
                  }}
                >
                  {k.delta.dir === "up" ? (
                    <ArrowUpRight size={11} />
                  ) : (
                    <ArrowDownRight size={11} />
                  )}
                  {k.delta.text}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Grille agents */}
      <section>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <Kicker theme={theme}>L'Ã©quipe Â· 8 agents</Kicker>
          <span style={{ color: theme.textMute, fontSize: 11 }}>
            {AGENTS.filter((a) => a.status === "actif").length} actifs Â·{" "}
            {AGENTS.filter((a) => a.status !== "actif").length} en attente
          </span>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 10,
          }}
        >
          {AGENTS.map((a) => {
            const Ic = a.icon;
            return (
              <button
                key={a.id}
                className="agent-card"
                onClick={() => setCurrentView(a.id)}
                style={{
                  background: theme.elevated,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 14,
                  padding: 16,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  color: "inherit",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = theme.accentDim)
                }
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.border)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: theme.elevated2,
                      color: theme.accent,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Ic size={16} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: theme.text,
                        fontSize: 13.5,
                        fontWeight: 500,
                      }}
                    >
                      {a.name}
                    </div>
                    <div style={{ color: theme.textMute, fontSize: 11 }}>
                      {a.role}
                    </div>
                  </div>
                  <StatusDot status={a.status} theme={theme} />
                </div>
                <div
                  style={{
                    color: theme.textSoft,
                    fontSize: 12,
                    lineHeight: 1.45,
                  }}
                >
                  {a.pitch}
                </div>
                <div
                  style={{
                    marginTop: 2,
                    color: theme.accent,
                    fontSize: 11.5,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {a.cta}
                  <ChevronRight size={12} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tendances aperÃ§u */}
      {isIG && (
        <section>
          <div
            style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}
          >
            <Kicker theme={theme}>Tendances Â· aperÃ§u</Kicker>
            <button
              onClick={() => setCurrentView("analyste")}
              style={{
                background: "transparent",
                border: 0,
                color: theme.accent,
                fontSize: 11.5,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              DÃ©tail dans Analyste IG
              <ChevronRight size={12} />
            </button>
          </div>

          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            <Card theme={theme}>
              <Kicker theme={theme}>AbonnÃ©s Â· 7 j</Kicker>
              <div style={{ height: 110, marginTop: 12 }}>
                <ResponsiveContainer>
                  <AreaChart data={IG_DATA.followersTrend}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.accent} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={theme.accent} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="d"
                      stroke={theme.textMute}
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={theme.accent}
                      strokeWidth={2}
                      fill="url(#g1)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ color: theme.textMute, fontSize: 10, marginTop: 4 }}>
                DonnÃ©es partielles Â· 1 semaine de collecte attendue
              </div>
            </Card>

            <Card theme={theme}>
              <Kicker theme={theme}>Vues Â· 7 j</Kicker>
              <div style={{ height: 110, marginTop: 12 }}>
                <ResponsiveContainer>
                  <LineChart data={IG_DATA.viewsTrend}>
                    <XAxis
                      dataKey="d"
                      stroke={theme.textMute}
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke={theme.accent}
                      strokeWidth={2}
                      dot={{ fill: theme.accent, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ color: theme.textMute, fontSize: 10, marginTop: 4 }}>
                Pic Ã  1 478 vues le 23 mai Â· post AÃ¯d
              </div>
            </Card>

            <Card theme={theme}>
              <Kicker theme={theme}>Audience Â· genre</Kicker>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ width: 100, height: 100 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={IG_DATA.demographics}
                        innerRadius={28}
                        outerRadius={45}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {IG_DATA.demographics.map((_, i) => (
                          <Cell
                            key={i}
                            fill={
                              [theme.accent, theme.accentBright, theme.accentDim][i]
                            }
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  {IG_DATA.demographics.map((d, i) => (
                    <div
                      key={d.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 12,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: [theme.accent, theme.accentBright, theme.accentDim][i],
                        }}
                      />
                      <span style={{ color: theme.textSoft, flex: 1 }}>{d.name}</span>
                      <span className="mono" style={{ color: theme.text }}>
                        {d.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ color: theme.textMute, fontSize: 10, marginTop: 8 }}>
                DonnÃ©es simulÃ©es Â· rÃ©elles Ã  venir avec la prochaine synchro
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* ActivitÃ© rÃ©cente */}
      <section>
        <Kicker theme={theme}>ActivitÃ© rÃ©cente Â· Ã©quipe</Kicker>
        <Card theme={theme} padded={false} style={{ marginTop: 12 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {RECENT_ACTIVITY.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 18px",
                  borderBottom:
                    i < RECENT_ACTIVITY.length - 1
                      ? `1px solid ${theme.border}`
                      : "none",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: theme.accent,
                  }}
                />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ color: theme.text, fontSize: 13 }}>{r.what}</div>
                  <div style={{ color: theme.textMute, fontSize: 11 }}>
                    par <span style={{ color: theme.textSoft }}>{r.who}</span>
                  </div>
                </div>
                <div style={{ color: theme.textMute, fontSize: 11 }}>{r.when}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <div style={{ height: 40 }} />
    </div>
  );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ANALYSTE IG PAGE (detailed charts)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ANALYSTE IG PAGE â€” branchÃ© sur data.json GitHub Pages
// Remplace la fonction AnalysteIGPage() existante dans makanmood_cockpit.jsx
// Structure rÃ©elle data.json : account{followers,media,followers_delta_week},
// history[{date,followers,media}], posts[{caption,timestamp,video_views,
// like_count,saved,comments_count}], hashtags[{tag,count}]
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const DATA_URL =
  "https://themakanmood-lgtm.github.io/makanmood-ig-stats/data.json";

function AnalysteIGPage({ theme, network }) {
  const isIG = network === "instagram";
  if (!isIG) {
    return <NetworkOnlyIGEmptyState theme={theme} who="L'Analyste Instagram" />;
  }
  return <AnalysteIGContent theme={theme} />;
}

function AnalysteIGContent({ theme }) {
  const [data, setData] = React.useState(null);
  const [loadStatus, setLoadStatus] = React.useState("idle");
  const [aiStatus, setAiStatus] = React.useState("idle");
  const [aiReport, setAiReport] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);

  const fetchData = async () => {
    setLoadStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch(`${DATA_URL}?t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLoadStatus("ok");
      runAiAnalysis(json);
    } catch (e) {
      setLoadStatus("error");
      setErrorMsg(
        "Impossible de charger data.json. VÃ©rifie que GitHub Pages est bien activÃ© et que le workflow a tournÃ© au moins une fois."
      );
    }
  };

  const runAiAnalysis = async (rawData) => {
    setAiStatus("loading");
    setAiReport(null);
    const summary = buildDataSummary(rawData);
    const prompt = `Tu es l'Analyste Instagram de Makan Mood (@makanmoodjournal, lifestyle marocain, Rabat).

Voici les donnÃ©es rÃ©elles du compte (extraites de la Meta Graph API) :

${summary}

MISSION : analyse courte et actionnÃ©e. Pas de blabla, pas de faux encouragements â€” dis ce que tu vois vraiment.

RÃ©ponds UNIQUEMENT en JSON valide, sans markdown, sans \`\`\`json :
{
  "resume": "2-3 phrases : Ã©tat gÃ©nÃ©ral du compte, ce qui ressort en premier",
  "signaux": [
    { "type": "positif" | "negatif" | "neutre", "texte": "Signal court et prÃ©cis, 1 phrase" }
  ],
  "recos": [
    { "priorite": "haute" | "moyenne", "action": "Action concrÃ¨te en 1 phrase" }
  ],
  "focus_semaine": "1 phrase : le truc le plus important Ã  faire cette semaine"
}

Contraintes : 3-5 signaux, 3-4 recos, formule les signaux nÃ©gatifs clairement (0 commentaire = problÃ¨me rÃ©el), recos applicables sans outils externes.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const resp = await res.json();
      const text = resp.content.map((b) => b.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Pas de JSON");
      setAiReport(JSON.parse(match[0]));
      setAiStatus("ok");
    } catch (e) {
      setAiStatus("error");
    }
  };

  React.useEffect(() => { fetchData(); }, []);

  // â”€â”€ DÃ©rivations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const acc = data?.account || {};
  const history = data?.history || [];
  const posts = data?.posts || [];
  const hashtags = data?.hashtags || [];

  const kpis = data ? [
    {
      label: "AbonnÃ©s",
      value: acc.followers ?? "â€”",
      delta: acc.followers_delta_week != null
        ? { dir: acc.followers_delta_week >= 0 ? "up" : "down", text: `${acc.followers_delta_week >= 0 ? "+" : ""}${acc.followers_delta_week} cette semaine` }
        : null,
    },
    {
      label: "Posts publiÃ©s",
      value: acc.media ?? "â€”",
      delta: acc.media_delta_week != null
        ? { dir: "up", text: `+${acc.media_delta_week} cette semaine` }
        : null,
    },
    {
      label: "Top post Â· vues",
      value: posts.length ? Math.max(...posts.map(p => p.video_views || 0)).toLocaleString("fr-FR") : "â€”",
      delta: null,
    },
    {
      label: "Total likes",
      value: posts.length ? posts.reduce((s, p) => s + (p.like_count || 0), 0) : "â€”",
      delta: null,
    },
  ] : null;

  const followersCurve = history.map(row => ({
    d: row.date ? row.date.slice(5).replace("-", "/") : "â€”",
    v: row.followers ?? 0,
  }));

  // Vues par jour depuis les posts
  const viewsByDay = {};
  posts.forEach(p => {
    if (!p.timestamp) return;
    const day = p.timestamp.slice(0, 10);
    viewsByDay[day] = (viewsByDay[day] || 0) + (p.video_views || 0);
  });
  const viewsCurve = Object.entries(viewsByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, v]) => ({ d: date.slice(5).replace("-", "/"), v }));

  const topPosts = [...posts]
    .sort((a, b) => (b.video_views || b.like_count || 0) - (a.video_views || a.like_count || 0))
    .slice(0, 8)
    .map(p => ({
      caption: (p.caption || "").slice(0, 55) + ((p.caption || "").length > 55 ? "â€¦" : ""),
      date: p.timestamp ? new Date(p.timestamp).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "",
      views: p.video_views ?? null,
      likes: p.like_count ?? null,
      saves: p.saved ?? null,
      comments: p.comments_count ?? null,
    }));

  const htMax = hashtags.length ? Math.max(...hashtags.map(h => h.count || 1)) : 1;
  const htSorted = [...hashtags]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 12)
    .map(h => ({ tag: `#${h.tag}`, uses: h.count || 0, pct: Math.round(((h.count || 0) / htMax) * 100) }));

  // â”€â”€ Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const label = { color: theme.textMute, fontSize: 11, letterSpacing: "0.02em" };
  const bigNum = { fontFamily: "'Geist Mono', monospace", color: theme.text, fontSize: 30, fontWeight: 500, lineHeight: 1, letterSpacing: "-0.02em", marginTop: 8 };
  const deltaStyle = (dir) => ({
    marginTop: 8, fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4,
    color: dir === "up" ? theme.success : dir === "down" ? theme.danger : theme.textMute,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <PageHeader
          theme={theme}
          Icon={BarChart3}
          title="Analyste Instagram"
          role="DonnÃ©es rÃ©elles Â· Meta Graph API"
          statusText={loadStatus === "ok" ? "actif Â· donnÃ©es live" : loadStatus === "loading" ? "actif Â· chargementâ€¦" : "actif"}
        />
        <button
          onClick={fetchData}
          disabled={loadStatus === "loading"}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 10,
            background: "transparent", border: `1px solid ${theme.border}`,
            color: theme.textSoft, fontSize: 12,
            cursor: loadStatus === "loading" ? "wait" : "pointer",
            opacity: loadStatus === "loading" ? 0.6 : 1,
          }}
        >
          <Clock size={13} />
          {loadStatus === "loading" ? "Chargementâ€¦" : "Actualiser"}
        </button>
      </div>

      {/* Erreur */}
      {loadStatus === "error" && (
        <Card theme={theme}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ color: theme.danger, fontSize: 13.5, fontWeight: 500 }}>DonnÃ©es non disponibles</div>
            <div style={{ color: theme.textSoft, fontSize: 13, lineHeight: 1.5 }}>{errorMsg}</div>
            <div style={{ color: theme.textMute, fontSize: 11, marginTop: 4 }}>
              URL testÃ©e : <span style={{ fontFamily: "monospace", color: theme.textSoft }}>{DATA_URL}</span>
            </div>
            <button onClick={fetchData} style={{ alignSelf: "flex-start", padding: "8px 14px", borderRadius: 10, background: theme.accent, color: theme.bg, border: 0, fontSize: 12.5, fontWeight: 500, cursor: "pointer", marginTop: 4 }}>
              RÃ©essayer
            </button>
          </div>
        </Card>
      )}

      {/* Skeleton */}
      {loadStatus === "loading" && !data && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {[1,2,3,4].map(i => (
            <Card key={i} theme={theme}>
              <div style={{ height: 60, background: theme.elevated2, borderRadius: 8, opacity: 0.4 }} />
            </Card>
          ))}
        </div>
      )}

      {/* KPIs */}
      {kpis && (
        <section>
          <Kicker theme={theme}>Vue d'ensemble Â· donnÃ©es rÃ©elles</Kicker>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {kpis.map((k, i) => (
              <Card key={i} theme={theme}>
                <div style={label}>{k.label}</div>
                <div style={bigNum}>{k.value}</div>
                {k.delta && (
                  <div style={deltaStyle(k.delta.dir)}>
                    {k.delta.dir === "up" ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                    {k.delta.text}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Analyse IA */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          <Kicker theme={theme} color={theme.accent}>Lecture IA des chiffres</Kicker>
          {aiStatus === "ok" && data && (
            <button
              onClick={() => runAiAnalysis(data)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "5px 10px", color: theme.textSoft, fontSize: 11, cursor: "pointer" }}
            >
              <Sparkles size={11} /> Relancer l'analyse
            </button>
          )}
        </div>
        <Card theme={theme}>
          {aiStatus === "loading" && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: theme.textSoft, fontSize: 13 }}>
              <Sparkles size={15} className="pulse-dot" style={{ color: theme.accent }} />
              L'Analyste lit les donnÃ©esâ€¦
            </div>
          )}
          {aiStatus === "error" && (
            <div style={{ color: theme.danger, fontSize: 13 }}>Analyse IA indisponible. Les donnÃ©es brutes restent accessibles ci-dessous.</div>
          )}
          {aiStatus === "ok" && aiReport && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ color: theme.text, fontSize: 14, lineHeight: 1.6 }}>{aiReport.resume}</div>
              {aiReport.focus_semaine && (
                <div style={{ padding: "10px 14px", background: theme.accentGlow, borderRadius: 10, borderLeft: `2px solid ${theme.accent}`, color: theme.text, fontSize: 13, lineHeight: 1.5 }}>
                  <span style={{ color: theme.accent, fontWeight: 500 }}>Focus cette semaine Â· </span>
                  {aiReport.focus_semaine}
                </div>
              )}
              {aiReport.signaux?.length > 0 && (
                <div>
                  <div style={{ color: theme.textMute, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>Signaux</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {aiReport.signaux.map((sig, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12.5, lineHeight: 1.5 }}>
                        <span style={{ marginTop: 4, width: 6, height: 6, borderRadius: 999, flexShrink: 0, background: sig.type === "positif" ? theme.success : sig.type === "negatif" ? theme.danger : theme.textMute }} />
                        <span style={{ color: theme.text }}>{sig.texte}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {aiReport.recos?.length > 0 && (
                <div>
                  <div style={{ color: theme.textMute, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>Actions recommandÃ©es</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {aiReport.recos.map((r, i) => (
                      <div key={i} style={{ padding: "8px 12px", background: theme.elevated2, borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12.5 }}>
                        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: r.priorite === "haute" ? theme.danger : theme.warn, flexShrink: 0, marginTop: 2, minWidth: 40 }}>
                          {r.priorite}
                        </span>
                        <span style={{ color: theme.text, lineHeight: 1.5 }}>{r.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {aiStatus === "idle" && <div style={{ color: theme.textMute, fontSize: 12.5 }}>En attente des donnÃ©esâ€¦</div>}
        </Card>
      </section>

      {/* Courbe abonnÃ©s */}
      {followersCurve.length > 1 && (
        <section>
          <Kicker theme={theme}>Croissance abonnÃ©s Â· historique</Kicker>
          <Card theme={theme} style={{ marginTop: 12 }}>
            <div style={{ height: 200 }}>
              <ResponsiveContainer>
                <AreaChart data={followersCurve}>
                  <defs>
                    <linearGradient id="ga_real" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={theme.accent} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={theme.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" stroke={theme.textMute} fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke={theme.textMute} fontSize={10} tickLine={false} axisLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
                  <Tooltip contentStyle={{ background: theme.elevated2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: theme.textSoft }} />
                  <Area type="monotone" dataKey="v" stroke={theme.accent} strokeWidth={2} fill="url(#ga_real)" name="AbonnÃ©s" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
      )}

      {/* Courbe vues */}
      {viewsCurve.length > 1 && (
        <section>
          <Kicker theme={theme}>Vues quotidiennes Â· posts</Kicker>
          <Card theme={theme} style={{ marginTop: 12 }}>
            <div style={{ height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={viewsCurve}>
                  <XAxis dataKey="d" stroke={theme.textMute} fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke={theme.textMute} fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: theme.elevated2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: theme.textSoft }} />
                  <Line type="monotone" dataKey="v" stroke={theme.accent} strokeWidth={2} dot={{ fill: theme.accent, r: 3 }} name="Vues" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
      )}

      {/* Top posts */}
      {topPosts.length > 0 && (
        <section>
          <Kicker theme={theme}>Top posts Â· classement par vues</Kicker>
          <Card theme={theme} padded={false} style={{ marginTop: 12 }}>
            {topPosts.map((p, i) => (
              <div key={i} style={{ padding: "14px 18px", borderBottom: i < topPosts.length - 1 ? `1px solid ${theme.border}` : "none", display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontFamily: "monospace", color: i === 0 ? theme.accent : theme.textMute, fontSize: 12, fontWeight: 500, minWidth: 22 }}>
                  #{i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: theme.text, fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.caption || "Post sans lÃ©gende"}
                  </div>
                  <div style={{ color: theme.textMute, fontSize: 11, marginTop: 2 }}>{p.date}</div>
                </div>
                <div style={{ display: "flex", gap: 14, flexShrink: 0 }}>
                  {[
                    { k: "Vues", v: p.views },
                    { k: "Likes", v: p.likes },
                    { k: "Saves", v: p.saves },
                    { k: "Coms", v: p.comments },
                  ].filter(x => x.v != null).map(({ k, v }) => (
                    <div key={k} style={{ textAlign: "right" }}>
                      <div style={{ color: theme.textMute, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>{k}</div>
                      <div style={{ fontFamily: "monospace", color: v === 0 ? theme.danger : theme.text, fontSize: 13 }}>
                        {typeof v === "number" ? v.toLocaleString("fr-FR") : v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        </section>
      )}

      {/* Hashtags */}
      {htSorted.length > 0 && (
        <section>
          <Kicker theme={theme}>Hashtags Â· frÃ©quence d'utilisation</Kicker>
          <Card theme={theme} style={{ marginTop: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {htSorted.map((h, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: theme.text, fontSize: 12.5, fontFamily: "monospace" }}>{h.tag}</span>
                    <span style={{ color: theme.textSoft, fontSize: 11 }}>{h.uses}Ã—</span>
                  </div>
                  <div style={{ height: 3, background: theme.elevated2, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${h.pct}%`, height: "100%", background: theme.accent }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Footer */}
      {data && (
        <div style={{ color: theme.textMute, fontSize: 11, textAlign: "center", paddingBottom: 40 }}>
          DonnÃ©es live Â· GitHub Pages Â· synchro toutes les 6 h
          {data.generated_at && ` Â· gÃ©nÃ©rÃ© le ${new Date(data.generated_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}`}
        </div>
      )}
    </div>
  );
}

// â”€â”€ buildDataSummary â€” adaptÃ© Ã  la vraie structure data.json â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function buildDataSummary(data) {
  const lines = [];
  const acc = data.account || {};
  const history = data.history || [];
  const posts = data.posts || [];
  const hashtags = data.hashtags || [];

  if (acc.followers != null) lines.push(`AbonnÃ©s actuels : ${acc.followers}`);
  if (acc.followers_delta_week != null) lines.push(`Croissance cette semaine : ${acc.followers_delta_week >= 0 ? "+" : ""}${acc.followers_delta_week} abonnÃ©s`);
  if (acc.media != null) lines.push(`Posts publiÃ©s : ${acc.media}`);
  if (acc.media_delta_week != null) lines.push(`Nouveaux posts cette semaine : ${acc.media_delta_week}`);

  if (history.length > 1) {
    const first = history[0];
    const last = history[history.length - 1];
    lines.push(`PÃ©riode analysÃ©e : ${first.date} â†’ ${last.date} (${history.length} jours)`);
  }

  if (posts.length > 0) {
    lines.push(`\nAnalyse des ${posts.length} derniers posts :`);
    const sorted = [...posts].sort((a, b) => (b.video_views || b.like_count || 0) - (a.video_views || a.like_count || 0));
    sorted.slice(0, 5).forEach((p, i) => {
      const cap = (p.caption || "").slice(0, 60);
      lines.push(`  Top ${i + 1} : "${cap}" â€” vues: ${p.video_views || 0}, likes: ${p.like_count || 0}, saves: ${p.saved || 0}, commentaires: ${p.comments_count || 0}`);
    });
    const totalComments = posts.reduce((s, p) => s + (p.comments_count || 0), 0);
    const totalSaves = posts.reduce((s, p) => s + (p.saved || 0), 0);
    const totalLikes = posts.reduce((s, p) => s + (p.like_count || 0), 0);
    lines.push(`Total commentaires tous posts : ${totalComments}`);
    lines.push(`Total saves tous posts : ${totalSaves}`);
    lines.push(`Total likes tous posts : ${totalLikes}`);
  }

  if (hashtags.length > 0) {
    lines.push(`\nHashtags utilisÃ©s : ${hashtags.length} distincts`);
    hashtags.slice(0, 6).forEach(h => lines.push(`  #${h.tag} : ${h.count} fois`));
  }

  return lines.join("\n") || "DonnÃ©es insuffisantes.";
}
function AutomationOverview({ theme }) {
  const items = [
    { name: "GitHub Actions Â· ig_stats.py", status: "actif", cadence: "toutes les 6 h" },
    { name: "Service Account Â· Sheets writer", status: "actif", cadence: "OK" },
    { name: "Token Meta Graph API", status: "actif", cadence: "Ã  renouveler ~22 juil." },
    { name: "Parser JSON public", status: "en attente", cadence: "Phase 2" },
  ];
  return (
    <Card theme={theme} padded={false}>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: i < items.length - 1 ? `1px solid ${theme.border}` : "none",
          }}
        >
          <StatusDot status={it.status} theme={theme} />
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ color: theme.text, fontSize: 12.5 }}>
              {it.name}
            </div>
            <div style={{ color: theme.textMute, fontSize: 11, marginTop: 2 }}>
              {it.cadence}
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}

function BrandOverview({ theme }) {
  return (
    <Card theme={theme}>
      <Kicker theme={theme}>Charte en construction</Kicker>
      <div style={{ color: theme.textSoft, fontSize: 13, marginTop: 8, lineHeight: 1.55 }}>
        La direction artistique de Makan Mood sera formalisÃ©e prochainement par la
        designeuse. En attendant, le Brand Keeper applique un principe simple :{" "}
        <span style={{ color: theme.text }}>
          aucune marque ne se mÃ©lange. Aucun visuel, aucun ton, aucune ressource ne passe
          d'un projet Ã  l'autre sans validation explicite.
        </span>
      </div>
      <div
        style={{
          marginTop: 14,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {["Makan Mood", "NuBun", "Nuage de Bulles", "Soft System Studio"].map((b) => (
          <span
            key={b}
            style={{
              padding: "5px 10px",
              borderRadius: 999,
              background: theme.elevated2,
              border: `1px solid ${theme.border}`,
              color: theme.textSoft,
              fontSize: 11.5,
            }}
          >
            {b}
          </span>
        ))}
      </div>
    </Card>
  );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MAIN APP
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
export default function App() {
  const [themeMode, setThemeMode] = useState("dark");
  const [currentView, setCurrentView] = useState("home");
  const [selectedNetwork, setSelectedNetwork] = useState("instagram");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const theme = useMemo(() => THEMES[themeMode], [themeMode]);

  const currentAgent = AGENTS.find((a) => a.id === currentView);
  const pageTitle = useMemo(() => {
    if (currentView === "home") return "Accueil";
    return currentAgent?.name || "â€”";
  }, [currentView, currentAgent]);

  return (
    <div
      className="mm-app"
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        display: "flex",
      }}
    >
      <style>{GLOBAL_CSS}</style>

      {/* Sidebar desktop */}
      <div style={{ display: "none", flexShrink: 0 }} className="lg-show">
        <Sidebar
          theme={theme}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
          currentView={currentView}
          setCurrentView={setCurrentView}
          selectedNetwork={selectedNetwork}
          setSelectedNetwork={setSelectedNetwork}
        />
      </div>

      {/* Sidebar drawer mobile */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 70,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              zIndex: 71,
            }}
          >
            <Sidebar
              theme={theme}
              themeMode={themeMode}
              setThemeMode={setThemeMode}
              currentView={currentView}
              setCurrentView={setCurrentView}
              selectedNetwork={selectedNetwork}
              setSelectedNetwork={setSelectedNetwork}
              isMobileDrawer
              onCloseDrawer={() => setDrawerOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar mobile */}
        <div
          className="lg-hide"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 18px",
            borderBottom: `1px solid ${theme.border}`,
            background: theme.elevated,
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              background: "transparent",
              border: 0,
              color: theme.textSoft,
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="Ouvrir le menu"
          >
            <Menu size={20} />
          </button>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentBright})`,
              display: "grid",
              placeItems: "center",
              color: theme.bg,
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            M
          </div>
          <div style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: 500 }}>
            {pageTitle}
          </div>
          <span
            style={{
              fontSize: 10,
              color: theme.textMute,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {NETWORKS.find((n) => n.id === selectedNetwork)?.short}
          </span>
        </div>

        {/* Page container */}
        <div
          className="scrollbar-soft"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px clamp(18px, 4vw, 40px)",
            maxWidth: 1280,
            width: "100%",
            margin: "0 auto",
          }}
        >
          {currentView === "home" && (
            <HomePage
              theme={theme}
              themeMode={themeMode}
              network={selectedNetwork}
              setCurrentView={setCurrentView}
            />
          )}
          {currentView === "analyste" && (
            <AnalysteIGPage theme={theme} network={selectedNetwork} />
          )}
          {currentAgent && currentView !== "analyste" && (
            <AgentPage theme={theme} agent={currentAgent} network={selectedNetwork} />
          )}
        </div>
      </main>

      <ChatBubble theme={theme} open={chatOpen} setOpen={setChatOpen} />

      {/* Responsive sidebar visibility helper */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-show { display: block !important; }
          .lg-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}
