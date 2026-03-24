export interface ProjectFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ProjectHighlight {
  title: string;
  description: string;
}

export interface StepDetail {
  step: string;
  detail: string;
}

export interface TechItem {
  name: string;
  purpose: string;
}

export interface ProjectData {
  slug: string;
  index: number;
  title: string;
  tagline: string;
  overview: string;
  accent: string;
  tags: string[];
  links?: { label: string; href: string }[];
  features: ProjectFeature[];
  howItWorks: StepDetail[];
  techStack: TechItem[];
  highlights: ProjectHighlight[];
}

export const projects: ProjectData[] = [
  {
    slug: "homeworkhacker",
    index: 1,
    title: "HomeworkHacker",
    tagline:
      "An AI study companion that listens for a wake word, reads your screen when asked, and interrupts you when your phone has been in your hand for too long.",
    overview:
      "HomeworkHacker runs a four-state voice machine (idle, listening, processing, speaking) on the frontend and a phone-detection server on the backend. Say 'hey buddy' and it starts listening through the browser's speech API. Hold your phone in front of the webcam for ten seconds and the AI interrupts you, bypassing browser mute to do it. Most of the complexity lives in nine custom React hooks that coordinate wake word detection, streaming Gemini responses, screen capture, and a queued text-to-speech pipeline.",
    accent: "#6366f1",
    tags: ["React", "TypeScript", "Python", "Full-Stack", "Comp Vision", "LLM API"],
    links: [{ label: "View on GitHub", href: "https://github.com/nickpalade/HomeworkHacker" }],
    features: [
      {
        icon: "Cpu",
        title: "Four-State Voice Machine",
        description:
          "The app cycles through four states: IDLE, LISTENING, PROCESSING, SPEAKING. All transitions are tracked in refs rather than React state, so async voice callbacks always read the current state instead of a stale snapshot captured when the callback was created. Saying the wake word during SPEAKING jumps straight back to LISTENING.",
      },
      {
        icon: "Camera",
        title: "YOLOv5 Phone Detection",
        description:
          "Webcam frames are sent to a FastAPI backend every four seconds. YOLOv5 checks for a cell phone (class ID 67 in the COCO dataset, which is the standard 80-category object detection benchmark the model was trained on). A timer on the frontend fires the interruption after ten seconds of continuous detection.",
      },
      {
        icon: "Zap",
        title: "Gemini 2.5 Flash Streaming",
        description:
          "generateContentStream runs at temperature 1. Response chunks arrive and are fed sentence-by-sentence into the text-to-speech queue, so speech starts playing before the full reply is ready. Screen captures are attached as inline base64 image data in the content sent to the model.",
      },
      {
        icon: "Brain",
        title: "Two Personality Modes",
        description:
          "Patient tutor and sarcastic friend. The active personality is injected as the first message in every Gemini call, so the model just sees a different persona rather than a mode flag. The sarcastic mode adds extra commentary when it catches you on your phone.",
      },
      {
        icon: "Volume2",
        title: "Mute Bypass",
        description:
          "An AudioContext is created and resumed on the first user interaction, which unlocks audio for the tab regardless of whether the browser tab is muted. SpeechSynthesis then plays back AI responses even in muted tabs.",
      },
      {
        icon: "Monitor",
        title: "Auto Screen Capture",
        description:
          "getDisplayMedia attaches a screen-sharing stream to a hidden video element. Frame capture triggers automatically when streamed Gemini text contains keywords like 'show me', so the AI can see your screen without you pressing anything.",
      },
    ],
    howItWorks: [
      {
        step: "Click Start",
        detail:
          "AudioContext is unlocked, all hooks initialize, the voice machine enters IDLE, and wake word detection begins.",
      },
      {
        step: "Say hey buddy",
        detail:
          "Web Speech API matches on partial results as you speak, which fires about a second faster than waiting for the final transcription.",
      },
      {
        step: "Ask your question",
        detail:
          "The full utterance is captured. A pause triggers the voice machine to move to PROCESSING and the Gemini call fires.",
      },
      {
        step: "Response streams",
        detail:
          "Chunks accumulate in a ref and flush to state for live rendering. Sentence boundaries push to the text-to-speech queue.",
      },
      {
        step: "AI speaks",
        detail:
          "The queue plays clips one after another. After each clip ends, wake word detection is suppressed for 300ms so the AI's own voice does not trigger itself.",
      },
      {
        step: "Phone alert",
        detail:
          "If the webcam catches your phone for ten consecutive seconds during any state, the AI interrupts whatever it is doing and tells you to put it down.",
      },
    ],
    techStack: [
      { name: "React + TypeScript + Vite", purpose: "Frontend framework and build tooling" },
      { name: "Python + FastAPI", purpose: "Phone detection server" },
      { name: "YOLOv5s (PyTorch)", purpose: "Object detection model, targeting cell phones" },
      { name: "Google Gemini 2.5 Flash Lite", purpose: "Streaming conversational AI" },
      { name: "Web Speech API", purpose: "Wake word detection and speech transcription" },
      { name: "SpeechSynthesis API", purpose: "Text-to-speech playback queue" },
    ],
    highlights: [
      {
        title: "Ref-based voice state",
        description:
          "All voice machine transitions use useRef, not useState. Async voice callbacks always read the current state without capturing a stale value from when the callback was first created.",
      },
      {
        title: "Echo guard (300ms)",
        description:
          "A short suppression window after each text-to-speech clip prevents the AI's own voice from being picked up as a wake word.",
      },
      {
        title: "Auto-trigger screen share",
        description:
          "Keyword matching runs on each streamed response chunk. Matching strings automatically call getDisplayMedia without any button press from the user.",
      },
      {
        title: "Sentence-gated TTS queue",
        description:
          "Gemini chunks arrive mid-sentence. Text accumulates in a ref and flushes to the speech queue only at sentence boundaries. Speech starts before the full reply is ready, but pronunciation stays correct: a word cut off mid-chunk waits for the rest of the sentence before the clip is queued.",
      },
    ],
  },
  {
    slug: "yupooscraper",
    index: 2,
    title: "yupooscraper",
    tagline:
      "Yupoo has no search. This adds one, with color clustering, brand detection, and filters that save to a shareable URL.",
    overview:
      "Yupoo is a Chinese image hosting platform used by wholesale clothing sellers. Their storefronts are hundreds of unlabeled album thumbnails with no way to find anything. yupooscraper crawls a seller's entire listing, runs each cover image through an OpenCV color-clustering pipeline to extract dominant colors, detects brand names using patterns that account for the star-emoji obfuscation sellers use to evade automated takedowns, and stores everything locally for fast compound-filter search.",
    accent: "#10b981",
    tags: ["React", "TypeScript", "Python", "Full-Stack", "Comp Vision", "SQL"],
    links: [{ label: "View on GitHub", href: "https://github.com/nickpalade/yupooscraper" }],
    features: [
      {
        icon: "Server",
        title: "Two-Phase Crawl Pipeline",
        description:
          "Phase one hits album index pages with twenty concurrent workers to count the full catalog. Phase two fetches album detail pages with five workers. Both phases are Python generators. FastAPI iterates them inside a StreamingResponse (which sends data to the browser as it is produced rather than waiting for everything to finish), and each progress event goes out over SSE (server-sent events, a simple one-way push channel from server to browser).",
      },
      {
        icon: "Palette",
        title: "k-Means Color Clustering",
        description:
          "Cover images are downsampled to 64x64 pixels, smoothed with a bilateral filter and Gaussian blur to reduce noise, then fed to k-means clustering with k=8 and KMEANS_PP_CENTERS initialization (a smarter starting point that spreads initial cluster centers apart). Each cluster center maps to a color name via 40+ ordered BGR (the pixel format OpenCV uses internally, equivalent to RGB in reverse order) range checks.",
      },
      {
        icon: "Tag",
        title: "Brand Name Detection",
        description:
          "Sellers obfuscate brand names to avoid takedowns: 'N★ke', 'A★idas'. The translate.json patterns match these exact variants. Longest-match-first scanning prevents a short pattern from matching inside a longer brand name.",
      },
      {
        icon: "Activity",
        title: "Live Progress Feed",
        description:
          "Twelve event types stream from the backend: scan_start, album_found, cv_complete, brand_found, stored, done, and more. The browser's native EventSource only supports GET requests, so a fetch with ReadableStream handles the POST instead, putting the seller URL in the request body.",
      },
      {
        icon: "Search",
        title: "Compound Tag Search",
        description:
          "Filters group by category prefix. Within a category the logic is OR; across categories it is AND. Color matching uses L1 distance (the sum of absolute differences between color percentages) on stored color profiles, filtered to the same clothing type first.",
      },
      {
        icon: "Link",
        title: "Shareable URL State",
        description:
          "Eight filter params serialize to URL query params on every change using history.replaceState rather than pushState, so refining a search does not add entries to the browser's back stack. Pasting the URL into a new tab restores the exact search state.",
      },
    ],
    howItWorks: [
      {
        step: "Enter seller URL",
        detail: "POST /api/scrape triggers both crawl phases. Progress events start streaming immediately.",
      },
      {
        step: "Phase 1: discovery",
        detail:
          "Twenty workers hit album index pages and collect all album URLs. The progress bar fills as albums are found.",
      },
      {
        step: "Phase 2: processing",
        detail:
          "Five workers fetch each album page. Cover image is downloaded, resized to 64x64, run through k-means color extraction, tagged with brand and clothing type, and stored in SQLite.",
      },
      {
        step: "Gallery loads",
        detail:
          "Frontend transitions from the progress view to the searchable gallery. All metadata is immediately available for filtering.",
      },
      {
        step: "Search and share",
        detail:
          "Compound tags filter the grid. Color similarity sorts by L1 distance against stored profiles. Any filter state is a shareable URL.",
      },
    ],
    techStack: [
      { name: "React + TypeScript + Vite", purpose: "Searchable frontend" },
      { name: "Python + FastAPI", purpose: "Scraping and image processing backend" },
      { name: "OpenCV", purpose: "k-means color clustering pipeline" },
      { name: "SQLite", purpose: "Local album metadata storage" },
      { name: "Netlify + Render.com", purpose: "Frontend and backend deployment" },
    ],
    highlights: [
      {
        title: "Star-emoji obfuscation",
        description:
          "The translate.json patterns include variants like N★ke and A★idas because Yupoo sellers write brand names this way to avoid automated takedown systems.",
      },
      {
        title: "EventSource POST workaround",
        description:
          "The browser's built-in EventSource only supports GET requests. The progress stream uses raw fetch with ReadableStream instead, which supports POST and lets the seller URL go in the request body.",
      },
      {
        title: "Grey/white normalization",
        description:
          "Large neutral clusters get downweighted so white product backgrounds do not dominate the color profile. The clothing's actual color ends up driving the match.",
      },
      {
        title: "LAB colorspace: implemented but unused",
        description:
          "Full LAB conversion utilities exist in color_names.py. LAB is a colorspace designed to match how humans perceive color differences, making distances more accurate. k-means runs in BGR; LAB was explored but not shipped.",
      },
    ],
  },
  {
    slug: "paraphraser",
    index: 3,
    title: "Paraphraser",
    tagline:
      "Select text, get five rephrasings that fit your document. Surrounding context is included in every AI call.",
    overview:
      "Paraphraser is a tokenized text editor where right-clicking any word or phrase sends surrounding context to an AI and returns five rephrasings. The context window is what makes it work: without surrounding text, AI rephrasings ignore the document's style and grammar. A provider hook switches between OpenRouter and a local Ollama instance without the UI knowing which one is active. Word-level synonym replacement uses the Datamuse API with an AI review pass to filter out contextually wrong synonyms. There is also a full CodeMirror code editing mode.",
    accent: "#8b5cf6",
    tags: ["React", "TypeScript", "Frontend", "LLM API"],
    links: [{ label: "View on GitHub", href: "https://github.com/nickpalade/paraphraser" }],
    features: [
      {
        icon: "MousePointer2",
        title: "Context-Aware Rephrasings",
        description:
          "About forty tokens (words and punctuation) on each side of the selection are included in every AI call, so the output fits the document's style and grammatical context. Five alternatives stream back and appear in a sliding panel.",
      },
      {
        icon: "Shuffle",
        title: "Swappable AI Provider",
        description:
          "useSyncExternalStore tracks which AI provider is active: OpenRouter (cloud) or local Ollama. UI components call useProvider() and never reference either implementation directly. The hook exposes a single streaming call function, and the caller does not know which provider runs it.",
      },
      {
        icon: "GitMerge",
        title: "LCS Token Diff",
        description:
          "When accepting a rephrasing, a two-pass longest common subsequence algorithm compares the old and new token arrays. LCS (longest common subsequence) finds the largest set of tokens that appear in both versions in the same order. Tokens in that shared set keep their IDs and undo history. Only genuinely new tokens get fresh IDs, so a full document rewrite does not wipe the undo stack.",
      },
      {
        icon: "AlignLeft",
        title: "Phrase Detection",
        description:
          "Hovering a word expands outward through function words (articles, prepositions, conjunctions), bridging them into a phrase selection. The expansion is capped at four tokens, stops at sentence boundaries, and waits 200ms before showing to avoid flickering during fast mouse movement.",
      },
      {
        icon: "BookOpen",
        title: "Datamuse + AI Synonym Review",
        description:
          "Word synonyms come from the Datamuse API, falling back to a 'means-like' query if fewer than three results come back. The list is sent to the AI with sentence context. The model returns a filtered subset plus optional multi-word replacements via range keys.",
      },
      {
        icon: "Code",
        title: "CodeMirror Code Mode",
        description:
          "Full CodeMirror 6 editor with syntax highlighting. The same rephrase panel and synonym flow work on code comments and strings. A custom event bus coordinates undo history between CodeMirror's internal stack and the outer token stack.",
      },
    ],
    howItWorks: [
      {
        step: "Type or paste text",
        detail:
          "The tokenizer splits input into Token[] objects with stable UUIDs. Whitespace is tokenized too so reconstruction is lossless. Smart quotes, curly apostrophes, and non-breaking spaces are all normalized on entry.",
      },
      {
        step: "Right-click to rephrase",
        detail:
          "A context window is built around the selection. The AI call fires with surrounding tokens included. Five rephrasings stream back.",
      },
      {
        step: "Accept a rephrasing",
        detail:
          "LCS diff compares old and new tokens. Tokens that appear in both versions keep their IDs and history. New tokens get fresh IDs. The undo stack is updated.",
      },
      {
        step: "Hover for synonyms",
        detail:
          "After 200ms, the phrase detector expands the selection. Datamuse fetches synonym candidates, the AI filters them for context fit, and the synonym picker appears inline.",
      },
      {
        step: "Ctrl+Z to undo",
        detail:
          "The undo stack pops, and tokensRef and state update together. In code mode, the event bus coordinates with CodeMirror's own history.",
      },
    ],
    techStack: [
      { name: "React + TypeScript + Vite", purpose: "Frontend framework" },
      { name: "CodeMirror 6", purpose: "Code editing mode with syntax highlighting" },
      { name: "OpenRouter API", purpose: "Cloud AI provider" },
      { name: "Ollama (local)", purpose: "Local AI provider" },
      { name: "Datamuse API", purpose: "Word synonym lookup" },
      { name: "Tailwind CSS", purpose: "Styling" },
    ],
    highlights: [
      {
        title: "tokensRef pattern",
        description:
          "The current token array lives in both a ref and React state. The ref gives async callbacks reliable access to the current value without capturing a stale snapshot. State triggers re-renders. Both update together.",
      },
      {
        title: "Versioned localStorage keys",
        description:
          "Keys like paraphraser_v2_tokens include a version number. Bumping the version automatically discards data saved in an old format, without any migration code.",
      },
      {
        title: "Portal context menu",
        description:
          "The right-click menu renders into document.body via a React portal (which places the element outside its parent in the DOM). This means overflow:hidden on the editor container cannot clip it.",
      },
      {
        title: "Unused SDK packages",
        description:
          "@openrouter/sdk and ollama are in package.json but never imported. Raw fetch gives complete control over how streaming chunks are handled.",
      },
    ],
  },
  {
    slug: "habithunter",
    index: 4,
    title: "HabitHunter",
    tagline:
      "Personal finance tracking without the bloat. Import your Revolut CSV, categorize transactions, and get spending forecasts.",
    overview:
      "HabitHunter grew out of wanting to understand actual spending patterns without relying on a subscription finance app. It imports directly from Revolut CSV exports, auto-categorizes transactions using a learned merchant mapping that gets smarter every time you correct a wrong category, and runs linear regression on monthly totals to predict future spending. The entire prediction engine is written from scratch without any math libraries. There are 207 tests.",
    accent: "#f59e0b",
    tags: ["Python", "Flask", "SQL", "Full-Stack"],
    links: [{ label: "View on GitHub", href: "https://github.com/nickpalade/HabitHunter" }],
    features: [
      {
        icon: "FileUp",
        title: "Revolut CSV Import",
        description:
          "Parses signed amounts to classify income versus expenses. Duplicate detection uses a tolerance of 0.01 on (date, description, amount) triples to handle floating-point imprecision. A flash message reports how many transactions were imported and how many were skipped as duplicates.",
      },
      {
        icon: "Map",
        title: "Self-Learning Merchant Mapper",
        description:
          "Re-categorizing one transaction propagates the new category to every record with the same merchant description and writes it to a JSON lookup file. Future imports from that merchant auto-categorize without any further input.",
      },
      {
        icon: "TrendingUp",
        title: "Hand-Rolled Linear Regression",
        description:
          "Ordinary least squares (a standard method for fitting a straight line through data points to minimize prediction error) implemented using only Python builtins. Produces next-month, next-three-months, yearly balance projections, per-category annual forecasts, and days until the current balance runs out.",
      },
      {
        icon: "DollarSign",
        title: "Multi-Currency Support",
        description:
          "Exchange rates are fetched from exchangerate-api.com and cached for the process lifetime. Amounts are stored in their original currency with a currency column and converted to EUR, GBP, or USD only at display time.",
      },
      {
        icon: "BarChart2",
        title: "7 Chart.js Visualizations",
        description:
          "Spending by category, top-5 doughnut chart, average spend by day of week, transaction frequency by weekday, monthly income vs expense trends, cumulative spending line, and category progress bars. All data is passed to Chart.js via Jinja2's tojson filter.",
      },
      {
        icon: "CheckSquare",
        title: "207-Test Suite",
        description:
          "pytest with session-scoped fixtures that wipe the database and merchant JSON before and after all tests. Edge cases include SQL injection, XSS, unicode emoji, CJK characters, negative zero, and float precision.",
      },
    ],
    howItWorks: [
      {
        step: "Upload CSV",
        detail:
          "RevolutImporter.parse_csv() reads the file, classifies transactions by sign, checks for duplicates with float tolerance, then saves non-duplicates to SQLite.",
      },
      {
        step: "Auto-categorize",
        detail:
          "The merchant mapper does an exact lookup on the description string. Unknown merchants land in 'Other'.",
      },
      {
        step: "Fix a category",
        detail:
          "Re-categorizing propagates to all records with the same description and updates the JSON file. That merchant is now mapped for all future imports.",
      },
      {
        step: "View analytics",
        detail:
          "/graphs-stats groups transactions by month, runs ordinary least squares regression on the totals, and feeds five prediction types to Chart.js via Jinja2 tojson.",
      },
      {
        step: "Set budgets",
        detail:
          "Per-category limits are stored in SQLite. Each budget card shows amount spent, amount remaining (which can go negative), and a progress bar. A timeframe filter applies across the whole app via session.",
      },
    ],
    techStack: [
      { name: "Python + Flask 3.1.2", purpose: "Web framework" },
      { name: "SQLite3", purpose: "Database (no ORM, all hand-written SQL)" },
      { name: "Jinja2", purpose: "HTML templates" },
      { name: "Chart.js 4.4.0", purpose: "7 data visualizations" },
      { name: "pytest 9.0.2", purpose: "207-test suite" },
      { name: "exchangerate-api.com", purpose: "Live exchange rates" },
    ],
    highlights: [
      {
        title: "Dynamic object construction",
        description:
          "DataManager.load() uses type('Income', (), dict(row)) to build Python objects directly from SQL row dictionaries. No dataclasses, no ORM, no boilerplate.",
      },
      {
        title: "Save = full delete + reinsert",
        description:
          "Every write deletes all records for the current user and reinserts the entire in-memory list. Simple, correct, and fast enough for personal finance data volumes.",
      },
      {
        title: "Composite-key URL routes",
        description:
          "Delete and edit routes encode (date, amount, description) as URL path segments. No integer IDs that could get out of sync. The handler iterates records and finds the first match within 0.01 float tolerance.",
      },
      {
        title: "OLS without libraries",
        description:
          "The entire regression engine uses Python builtins only: sum, range, len. A zero-denominator guard returns (None, None) and all callers check before predicting.",
      },
    ],
  },
  {
    slug: "socialmedia",
    index: 5,
    title: "Social Media Website",
    tagline:
      "A social platform built to fight echo chambers. Chronological feed, raw vote counts, tag-based discovery. No algorithm.",
    overview:
      "This started as a summer project before A-levels, motivated by reading about how social media recommendation systems create echo chambers and amplify misinformation. The design deliberately counters that: no ranking algorithm, no network-based filtering, posts shown in insertion order only, and like/dislike counts always shown as raw numbers rather than hidden behind vague engagement indicators. Built entirely without frameworks: pure PHP, MySQL, vanilla JS, and plain CSS.",
    accent: "#f43f5e",
    tags: ["PHP", "JavaScript", "CSS", "SQL", "Full-Stack"],
    features: [
      {
        icon: "CornerDownRight",
        title: "Self-Referential Thread Model",
        description:
          "Posts and comments share one table via a nullable ParentPost foreign key. Any comment can be opened as a full post with its own sub-replies, giving infinite threading depth with zero extra tables or recursive queries.",
      },
      {
        icon: "Heart",
        title: "Unified Reaction Endpoint",
        description:
          "All interaction types route through one PHP file dispatched by a type field in the JSON body: like, dislike, save, unlike, check, checkSave, CountLikesDislikes. Toggle logic handles the case where the same reaction already exists.",
      },
      {
        icon: "Layout",
        title: "Template DOM Cloning",
        description:
          "JavaScript renders new posts by cloning hidden placeholder elements that are already in the HTML page. No dependencies, no build step, no virtual DOM. Just the browser's native cloneNode.",
      },
      {
        icon: "List",
        title: "Chronological-Only Feed",
        description:
          "No ranking, no algorithm, no network-based filtering. Posts appear in insertion order. Like and dislike counts are always shown together as raw numbers. The platform makes no attempt to surface popular content or hide negative sentiment.",
      },
      {
        icon: "Link",
        title: "URL State with pushState",
        description:
          "Clicking a post updates the URL via history.pushState so individual posts are directly linkable. Back navigation works without a full page reload.",
      },
      {
        icon: "Hash",
        title: "Tag-Based Discovery",
        description:
          "Users find content by topic tag rather than by following accounts. Designed to cross-cut social bubbles: you see posts about a topic from anyone who tagged it, not just people in your network.",
      },
    ],
    howItWorks: [
      {
        step: "Register and log in",
        detail:
          "A PHP session is created. The landing page fetches all posts via /fetch/fetch_posts.inc.php and renders them by cloning DOM templates.",
      },
      {
        step: "Create a post",
        detail:
          "submitPost.inc.php detects the presence of a title field to distinguish top-level posts from comments. ParentPost is NULL for posts and set to the parent PostID for comments.",
      },
      {
        step: "React to a post",
        detail:
          "submitReaction.inc.php reads the type field and either inserts, deletes, or queries the reactions table. Toggle logic: the same reaction deletes it, a different reaction replaces it.",
      },
      {
        step: "View a thread",
        detail:
          "fetch_specific_post and fetch_post_replies fetch the post and its direct replies. The URL updates via pushState. Any reply can be opened the same way.",
      },
      {
        step: "See vote counts",
        detail:
          "CountLikesDislikes runs a conditional SUM query and returns both counts. Both numbers are always displayed, never hidden.",
      },
    ],
    techStack: [
      { name: "PHP", purpose: "Backend (no framework, mysqli prepared statements)" },
      { name: "MySQL", purpose: "Database" },
      { name: "Vanilla JavaScript", purpose: "Frontend rendering via DOM template cloning" },
      { name: "Plain CSS", purpose: "Per-page stylesheets" },
      { name: "Apache/PHP server", purpose: "Deployment" },
    ],
    highlights: [
      {
        title: "One table for posts and comments",
        description:
          "ParentPost = NULL is a top-level post. ParentPost = any PostID is a comment at any depth. You can nest arbitrarily without any schema changes.",
      },
      {
        title: "fetch_functions.inc.php",
        description:
          "A shared terminal include that all fetch endpoints drop into at the end: execute the statement, join the users table to get usernames, strip TimeWatched, echo the JSON array.",
      },
      {
        title: "Conditional SUM aggregation",
        description:
          "CountLikesDislikes uses SUM(CASE WHEN reaction_type = 'like' THEN 1 ELSE 0 END) to get both like and dislike counts in one query rather than two separate selects.",
      },
      {
        title: "Built solo before A-levels",
        description:
          "The anti-echo-chamber motivation is baked into every design decision: chronological feed, visible raw vote ratios, tag-based not social-graph-based discovery. No feature was added that would increase engagement at the cost of that goal.",
      },
    ],
  },
  {
    slug: "roblox",
    index: 6,
    title: "Roblox Project",
    tagline:
      "A complete Roblox game: over 8,000 lines of Luau, written solo from start to finish, with custom mechanics and a full server-client architecture.",
    overview:
      "A complete Roblox game written entirely solo in Luau. Over 8,000 lines covering custom game mechanics, a full UI system, and a server-client architecture built around RemoteEvents and RemoteFunctions. All game-critical logic runs server-side. Clients send intent, the server validates and applies it. Player data persists across sessions via Roblox DataStore.",
    accent: "#f97316",
    tags: ["Lua", "Game Dev"],
    links: [{ label: "Play on Roblox", href: "https://www.roblox.com/games/13230751727/" }],
    features: [
      {
        icon: "Server",
        title: "Server-Client Architecture",
        description:
          "RemoteEvents and RemoteFunctions handle all communication between the server and each player's client. Clients fire events expressing what they want to do. The server validates the action, applies it to game state, and broadcasts the result. No game-critical logic runs on the client where it could be tampered with.",
      },
      {
        icon: "Gamepad2",
        title: "Custom Game Mechanics",
        description:
          "Unique gameplay systems built from scratch in Luau. No external plugins or borrowed scripts. Every mechanic was designed and implemented for this project specifically.",
      },
      {
        icon: "Layout",
        title: "Full UI System",
        description:
          "Custom HUD and interface elements built with Roblox's UI framework. All UI logic runs client-side via LocalScripts, with server data delivered through RemoteEvents.",
      },
      {
        icon: "Database",
        title: "Data Persistence",
        description:
          "Player data is saved and loaded across sessions using Roblox DataStore. The system handles load failures gracefully and auto-saves at regular intervals as well as when a player leaves.",
      },
      {
        icon: "Code",
        title: "8,000+ Lines of Luau",
        description:
          "The full codebase is one developer's work with no team and no asset store scripts. Luau's gradual type system is used throughout, adding type annotations to a language that does not require them, catching errors that would otherwise only appear at runtime.",
      },
    ],
    howItWorks: [
      {
        step: "Player joins",
        detail:
          "The server loads player data from DataStore and sends initial state to the connecting client.",
      },
      {
        step: "Client initializes",
        detail:
          "LocalScripts set up the UI, input handling, and visual feedback. All display logic stays client-side.",
      },
      {
        step: "Player acts",
        detail:
          "The client fires a RemoteEvent with intent. The server validates the action, applies it to game state, and broadcasts relevant results.",
      },
      {
        step: "Session ends",
        detail:
          "Player data is auto-saved on leave. Persistent state carries over to the next session.",
      },
    ],
    techStack: [
      { name: "Luau", purpose: "Primary scripting language (gradual typing throughout)" },
      { name: "Roblox Studio", purpose: "Development environment" },
      { name: "Roblox DataStore", purpose: "Player data persistence across sessions" },
      { name: "RemoteEvents / RemoteFunctions", purpose: "Server-client communication" },
      { name: "Roblox UI Framework", purpose: "All interface elements" },
    ],
    highlights: [
      {
        title: "Server authority",
        description:
          "Every game-critical decision happens on the server. Clients express intent via RemoteEvents and receive results. They never write game state directly, which prevents cheating.",
      },
      {
        title: "Solo 8,000-line codebase",
        description:
          "Written entirely alone with no external scripts or asset store plugins. Every mechanic, UI element, data layer, and server behavior is original code.",
      },
      {
        title: "Live published game",
        description:
          "The game is live on Roblox with real players. The link in the portfolio goes straight to the game page.",
      },
    ],
  },
];
