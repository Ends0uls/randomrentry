import { useState, useCallback, useEffect, useRef } from 'react';

// Characters used in rentry.org slugs
const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

// Common short slugs that are more likely to exist
const COMMON_SLUGS = [
  'test', 'hello', 'info', 'note', 'notes', 'list', 'links', 'data',
  'temp', 'todo', 'wiki', 'help', 'faq', 'api', 'docs', 'home',
  'blog', 'news', 'code', 'dev', 'app', 'web', 'main', 'page',
  'share', 'paste', 'text', 'file', 'log', 'raw', 'edit', 'new',
  'old', 'top', 'best', 'cool', 'fun', 'lol', 'wow', 'yes', 'no',
  'ok', 'hi', 'hey', 'sup', 'yo', 'go', 'do', 'me', 'my', 'us',
  'it', 'is', 'on', 'in', 'at', 'to', 'up', 'so', 'an', 'or',
  'if', 'by', 'be', 'as', 'we', 'he', 'she', 'the', 'and', 'for',
  'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was',
  'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
  'its', 'may', 'new', 'now', 'old', 'see', 'way', 'who', 'did',
  'let', 'say', 'too', 'use', 'set', 'run', 'try', 'ask', 'own',
  'put', 'big', 'end', 'why', 'men', 'few', 'got', 'add', 'red',
  'man', 'ten', 'two', 'hot', 'far', 'low', 'cut', 'off', 'age',
  'air', 'art', 'bed', 'box', 'bus', 'car', 'cat', 'dog', 'ear',
  'egg', 'eye', 'hat', 'job', 'key', 'leg', 'map', 'oil', 'pen',
  'pie', 'pin', 'pot', 'row', 'sun', 'tea', 'tin', 'toy', 'van',
  'war', 'zoo', 'arm', 'bag', 'bat', 'bit', 'bow', 'cap', 'cup',
  'dot', 'fan', 'fly', 'fox', 'gap', 'gun', 'ice', 'ink', 'jam',
  'jaw', 'joy', 'lab', 'lip', 'mix', 'mud', 'net', 'nut', 'oak',
  'owl', 'pea', 'pig', 'pop', 'rag', 'rat', 'rib', 'rod', 'rug',
  'sad', 'saw', 'sea', 'sir', 'ski', 'sky', 'spy', 'sum', 'tab',
  'tap', 'tip', 'toe', 'top', 'tub', 'vet', 'wax', 'web', 'wet',
  'win', 'wit', 'zen', 'zip', 'bay', 'bee', 'bid', 'bin', 'bud',
  'bug', 'cab', 'cam', 'cob', 'cod', 'cot', 'cow', 'cry', 'dew',
  'dig', 'dim', 'dip', 'dug', 'dye', 'eel', 'elk', 'elm', 'emu',
  'era', 'eve', 'ewe', 'fig', 'fin', 'fir', 'fit', 'fix', 'fog',
  'fur', 'gag', 'gem', 'gin', 'gnu', 'gum', 'gut', 'gym', 'hay',
  'hen', 'hid', 'hip', 'hit', 'hog', 'hop', 'hue', 'hug', 'hum',
  'hut', 'icy', 'ill', 'imp', 'inn', 'ion', 'ire', 'ivy', 'jab',
  'jag', 'jar', 'jet', 'jig', 'jog', 'jot', 'jug', 'jut', 'keg',
  'kin', 'kit', 'lag', 'lap', 'lax', 'lay', 'lea', 'led', 'lid',
  'lit', 'lob', 'lug', 'mad', 'mat', 'mew', 'mid', 'mob', 'mop',
  'mow', 'mug', 'nab', 'nag', 'nap', 'nil', 'nip', 'nit', 'nod',
  'nor', 'nun', 'oar', 'oat', 'odd', 'ode', 'opt', 'orb', 'ore',
  'owe', 'pad', 'pal', 'pan', 'pap', 'pat', 'paw', 'pay', 'peg',
  'pet', 'pew', 'ply', 'pod', 'pry', 'pub', 'pug', 'pun', 'pup',
  'pus', 'rag', 'ram', 'ran', 'rap', 'raw', 'ray', 'ref', 'rev',
  'rid', 'rig', 'rim', 'rip', 'rob', 'rot', 'rub', 'rue', 'rum',
  'rut', 'rye', 'sac', 'sag', 'sap', 'sat', 'sew', 'shy', 'sin',
  'sip', 'sit', 'six', 'sob', 'sod', 'son', 'sop', 'sow', 'soy',
  'spa', 'spy', 'sty', 'sub', 'sue', 'tag', 'tan', 'tar', 'tat',
  'tax', 'the', 'thy', 'tic', 'tie', 'til', 'tin', 'tit', 'ton',
  'tow', 'tug', 'tun', 'tut', 'urn', 'van', 'vat', 'vet', 'vex',
  'via', 'vie', 'vim', 'vow', 'wad', 'wag', 'wan', 'wig', 'woe',
  'wok', 'won', 'woo', 'wow', 'yak', 'yam', 'yap', 'yaw', 'yea',
  'yen', 'yet', 'yew', 'yon', 'zap', 'zit',
  // Some longer common ones
  'based', 'cringe', 'cope', 'seethe', 'mald', 'ratio', 'sigma',
  'alpha', 'omega', 'delta', 'gamma', 'theta', 'kappa', 'lambda',
  'pasta', 'copypasta', 'guide', 'tutorial', 'setup', 'config',
  'rules', 'about', 'index', 'start', 'intro', 'readme',
  'status', 'update', 'changelog', 'roadmap', 'plan', 'draft',
  'private', 'public', 'secret', 'hidden', 'anon', 'random',
  'linux', 'windows', 'macos', 'android', 'python', 'java',
  'rust', 'golang', 'react', 'nodejs', 'discord', 'reddit',
  'gaming', 'music', 'anime', 'manga', 'movie', 'book',
  'crypto', 'nft', 'defi', 'token', 'wallet', 'trade',
  'server', 'proxy', 'vpn', 'torrent', 'download', 'upload',
  'login', 'signup', 'auth', 'admin', 'user', 'profile',
  'search', 'filter', 'sort', 'order', 'group', 'team',
  'project', 'build', 'deploy', 'release', 'version', 'patch',
  'fix', 'bug', 'issue', 'error', 'debug', 'trace',
];

function generateRandomSlug(): string {
  // 70% chance to use common slug, 30% random short string
  if (Math.random() < 0.7) {
    return COMMON_SLUGS[Math.floor(Math.random() * COMMON_SLUGS.length)];
  }
  const length = Math.floor(Math.random() * 3) + 2; // 2–4 chars
  let slug = '';
  for (let i = 0; i < length; i++) {
    slug += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return slug;
}

interface HistoryEntry {
  slug: string;
  timestamp: Date;
}

type Status = 'idle' | 'searching' | 'found' | 'error';

// Particle background component
function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            backgroundColor: `rgba(124, 58, 237, ${Math.random() * 0.3 + 0.1})`,
            animation: `float ${Math.random() * 8 + 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

// Orbiting dots around button
function OrbitDots() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 pointer-events-none"
          style={{ animationDelay: `${i * 4}s`, animation: `orbit ${12 + i * 2}s linear infinite` }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: i === 0 ? '#7c3aed' : i === 1 ? '#a78bfa' : '#6d28d9',
              boxShadow: `0 0 8px rgba(124, 58, 237, 0.6)`,
            }}
          />
        </div>
      ))}
    </>
  );
}

// Status indicator component
function StatusBadge({ status, attempts }: { status: Status; attempts: number }) {
  if (status === 'idle') return null;

  const config = {
    searching: {
      bg: 'bg-[var(--color-dark-600)]',
      border: 'border-[var(--color-accent)]/30',
      text: 'text-[var(--color-accent-light)]',
      icon: (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ),
      label: `Searching... (attempt ${attempts})`,
    },
    found: {
      bg: 'bg-emerald-950/50',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      label: 'Page found! Redirecting...',
    },
    error: {
      bg: 'bg-red-950/50',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      label: 'Something went wrong. Try again!',
    },
  };

  const c = config[status];

  return (
    <div className={`animate-fade-in-up flex items-center gap-2 px-4 py-2 rounded-full border ${c.bg} ${c.border} ${c.text} text-sm font-medium`}>
      {c.icon}
      <span>{c.label}</span>
    </div>
  );
}

// History sidebar
function HistoryPanel({ history, isOpen, onClose }: { history: HistoryEntry[]; isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      )}
      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[var(--color-dark-800)] border-l border-white/5 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">History</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-80px)] scrollbar-thin">
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">No pages discovered yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((entry, i) => (
                <a
                  key={i}
                  href={`https://rentry.org/${entry.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[var(--color-accent)]/30 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-[var(--color-accent-light)] group-hover:text-white transition-colors">
                      /{entry.slug}
                    </span>
                    <svg className="w-4 h-4 text-gray-600 group-hover:text-[var(--color-accent-light)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {entry.timestamp.toLocaleTimeString()}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [status, setStatus] = useState<Status>('idle');
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const checkRentryPage = useCallback(async (slug: string, signal: AbortSignal): Promise<boolean> => {
    try {
      // Use allorigins as a CORS proxy to fetch the rentry page
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://rentry.org/${slug}`)}`;
      const response = await fetch(proxyUrl, { signal });
      if (!response.ok) return false;
      const data = await response.json();
      // Check if the page has actual content (not a 404 page)
      const content: string = data.contents || '';
      // rentry.org 404 pages contain "Page not found" or redirect
      if (content.includes('Page not found') || content.includes('404')) {
        return false;
      }
      // Check that there's actual rentry content
      if (content.includes('rentry') && content.length > 500) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const findRandomPage = useCallback(async () => {
    if (status === 'searching') return;

    setStatus('searching');
    setAttempts(0);
    setRippleKey((k) => k + 1);

    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    const maxAttempts = 30;
    const usedSlugs = new Set<string>();

    for (let i = 0; i < maxAttempts; i++) {
      if (signal.aborted) return;

      let slug: string;
      do {
        slug = generateRandomSlug();
      } while (usedSlugs.has(slug));
      usedSlugs.add(slug);

      setAttempts(i + 1);

      const isValid = await checkRentryPage(slug, signal);
      if (signal.aborted) return;

      if (isValid) {
        setStatus('found');
        setHistory((prev) => [{ slug, timestamp: new Date() }, ...prev].slice(0, 50));

        // Small delay to show "found" state, then redirect
        setTimeout(() => {
          window.open(`https://rentry.org/${slug}`, '_blank');
          setStatus('idle');
        }, 1200);
        return;
      }
    }

    // If we exhausted attempts
    setStatus('error');
    setTimeout(() => setStatus('idle'), 3000);
  }, [status, checkRentryPage]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const isSearching = status === 'searching';

  return (
    <div className="relative h-full w-full bg-[var(--color-dark-900)] bg-grid overflow-hidden flex flex-col">
      {/* Ambient gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-800/8 rounded-full blur-[100px] pointer-events-none" />

      <ParticleField />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-purple-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide text-white/80">Rentry Explorer</span>
        </div>

        <button
          onClick={() => setShowHistory(true)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/10 transition-all duration-200 text-sm text-gray-400 hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
          {history.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent-light)] text-xs font-medium">
              {history.length}
            </span>
          )}
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 px-4">
        {/* Title */}
        <div className="text-center animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-3">
            <span className="bg-gradient-to-r from-white via-purple-200 to-[var(--color-accent-light)] bg-clip-text text-transparent animate-gradient">
              Discover
            </span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Find a random page on{' '}
            <span className="text-[var(--color-accent-light)] font-medium">rentry.org</span>
            . Each click explores the unknown.
          </p>
        </div>

        {/* Big button area */}
        <div className="relative" style={{ animationDelay: '0.2s' }}>
          {/* Orbiting particles */}
          {!isSearching && <OrbitDots />}

          {/* Glow ring when searching */}
          {isSearching && (
            <div className="absolute inset-[-20px] rounded-full border-2 border-[var(--color-accent)]/20 animate-spin-slow" />
          )}

          {/* The button */}
          <button
            onClick={findRandomPage}
            disabled={isSearching}
            className={`
              relative w-44 h-44 sm:w-52 sm:h-52 rounded-full 
              bg-gradient-to-br from-[var(--color-accent)] via-purple-700 to-violet-900
              flex flex-col items-center justify-center gap-2
              text-white font-bold text-lg
              transition-all duration-300 ease-out
              cursor-pointer
              ${isSearching 
                ? 'scale-95 opacity-80' 
                : 'hover:scale-105 active:scale-95 animate-pulse-glow hover:shadow-[0_0_60px_var(--color-accent-glow)]'
              }
              disabled:cursor-wait
              overflow-hidden
            `}
          >
            {/* Shimmer overlay */}
            {!isSearching && <div className="absolute inset-0 rounded-full animate-shimmer" />}

            {/* Ripple effect */}
            <div
              key={rippleKey}
              className="absolute inset-0 rounded-full bg-white/20"
              style={{
                animation: rippleKey > 0 ? 'ripple 0.8s ease-out forwards' : 'none',
                opacity: 0,
              }}
            />

            {/* Inner glow */}
            <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[var(--color-accent)] via-purple-700 to-violet-900 flex flex-col items-center justify-center gap-2">
              {isSearching ? (
                <>
                  <svg className="w-10 h-10 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-sm font-medium opacity-70">Searching...</span>
                </>
              ) : (
                <>
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  <span className="text-base tracking-wide">Explore</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Status badge */}
        <div className="h-10 flex items-center">
          <StatusBadge status={status} attempts={attempts} />
        </div>

        {/* Subtle instructions */}
        <p className="text-gray-600 text-xs text-center max-w-xs">
          Pages are verified before opening. Invalid pages are automatically skipped.
        </p>
      </main>

      {/* Bottom bar */}
      <footer className="relative z-10 flex items-center justify-center px-6 py-4">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
          <span>Connected to rentry.org</span>
        </div>
      </footer>

      {/* History panel */}
      <HistoryPanel history={history} isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
}
