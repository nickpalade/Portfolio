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
      "HomeworkHacker is a voice-controlled AI tutor built on a React + TypeScript frontend and a Python FastAPI backend. Say 'hey buddy' and it starts listening. Ask a question and it answers out loud, with streamed responses appearing on screen word by word as they generate. Grant screen access once and the AI can look at what you are working on when you ask it to. A separate backend runs a YOLOv5 object detection model against your webcam continuously: if your phone appears for ten consecutive seconds, the AI interrupts whatever it is doing to tell you to put it down, even if the browser tab is muted.",
    accent: "#6366f1",
    tags: ["React", "TypeScript", "Python", "Full-Stack", "Comp Vision", "LLM API"],
    links: [{ label: "View on GitHub", href: "https://github.com/nickpalade/HomeworkHacker" }],
    features: [
      {
        icon: "Cpu",
        title: "Wake Word Voice Loop",
        description:
          "The app moves through four modes: waiting, listening, thinking, and speaking. Say the wake word at any point, even while the AI is mid-response, and it stops and starts listening immediately.",
      },
      {
        icon: "Camera",
        title: "YOLOv5 Phone Detection",
        description:
          "Webcam frames are checked by an AI object detection model every four seconds. When it spots a phone, a timer starts. Hold your phone in frame for ten consecutive seconds and the AI interrupts your session with a distraction warning.",
      },
      {
        icon: "Zap",
        title: "Streaming AI Responses",
        description:
          "The AI starts speaking before it has finished generating its reply. Words appear on screen and play out loud as they arrive, so you hear the start of the answer almost immediately. Screenshots attach automatically when the AI needs to see your screen.",
      },
      {
        icon: "Brain",
        title: "Two Personality Modes",
        description:
          "Switch between a patient tutor and a sarcastic friend. The active personality shapes every response the AI gives. In sarcastic mode, getting caught on your phone earns an extra comment on top of the interruption.",
      },
      {
        icon: "Volume2",
        title: "Audio Even When Muted",
        description:
          "The app can play audio even if the browser tab is muted. Silencing the tab does not stop the phone-detection alert from going off.",
      },
      {
        icon: "Monitor",
        title: "Auto Screen Capture",
        description:
          "Screen sharing starts in the background after a one-time permission prompt. When the AI detects a phrase like 'show me' in its own response, it automatically captures your screen and includes it in the next message without any button press.",
      },
    ],
    howItWorks: [
      {
        step: "Click Start",
        detail:
          "The app initialises, audio is enabled, and wake word detection begins. The AI is now waiting for you to speak.",
      },
      {
        step: "Say hey buddy",
        detail:
          "Voice recognition responds before you finish speaking, so the app reacts within about a second of hearing the wake word.",
      },
      {
        step: "Ask your question",
        detail:
          "Speak your question. When you pause, the app recognises you are done and sends your question to the AI.",
      },
      {
        step: "Response streams in",
        detail:
          "The AI's reply appears on screen word by word as it is generated. Speech plays out loud at the same pace, sentence by sentence.",
      },
      {
        step: "AI speaks",
        detail:
          "Each sentence plays in sequence. A short pause after each clip stops the AI from hearing its own voice as a wake word and triggering itself.",
      },
      {
        step: "Phone alert",
        detail:
          "If the webcam spots your phone for ten consecutive seconds at any point, the AI interrupts whatever it is doing and tells you to put it down.",
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
        title: "Reliable voice state",
        description:
          "The voice loop runs through four async states, and every speech recognition callback reads the current mode from a ref rather than closing over a stale value from setup time. This prevents race conditions where the app believes it is still speaking while it has already transitioned to listening.",
      },
      {
        title: "Echo guard",
        description:
          "A deliberate pause is inserted after each spoken audio clip, giving the speech recognition engine time to flush before it resumes listening. Without it, the tail end of the AI's own voice triggers the wake word detector and starts a new response.",
      },
      {
        title: "Auto-trigger screen share",
        description:
          "The AI monitors its own streamed output in real time, scanning each incoming chunk for phrases that signal it needs visual context. When one is detected, screen capture fires automatically mid-response, without any button press or user prompt.",
      },
      {
        title: "Speech starts mid-generation",
        description:
          "Rather than waiting for the full reply to finish generating before handing it to the speech synthesiser, sentences are queued for playback the moment they complete. The first sentence goes to the TTS queue while the rest of the response is still streaming, so the spoken answer begins almost immediately. Partial sentences wait for a sentence boundary before being queued, keeping pronunciation natural.",
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
      "Yupoo is a Chinese image hosting platform used by wholesale clothing sellers. Their storefronts are hundreds of unlabeled album thumbnails with no search, no filters, and no way to find anything. yupooscraper crawls a seller's entire catalog using a concurrent pipeline of async workers, runs each cover image through a k-means color clustering algorithm with OpenCV to extract dominant colors, and detects brand names including the obfuscated variants sellers use to evade automated takedowns. Everything is stored locally in SQLite so you can search and filter the entire storefront instantly.",
    accent: "#10b981",
    tags: ["React", "TypeScript", "Python", "Full-Stack", "Comp Vision", "SQL"],
    links: [{ label: "View on GitHub", href: "https://github.com/nickpalade/yupooscraper" }],
    features: [
      {
        icon: "Server",
        title: "Two-Phase Crawl Pipeline",
        description:
          "Phase one sends twenty concurrent workers to discover every album in the catalog. Phase two processes each album with five workers. Results start appearing in the browser before the crawl is finished, so you are never waiting on a blank screen.",
      },
      {
        icon: "Palette",
        title: "k-Means Color Clustering",
        description:
          "Cover images are downsampled and preprocessed to reduce background noise, then run through k-means color clustering to find the eight most prominent colors. Each color cluster maps to a plain color name via 40+ range checks, giving every album a searchable color profile.",
      },
      {
        icon: "Tag",
        title: "Brand Name Detection",
        description:
          "Sellers write brand names like 'N★ke' and 'A★idas' to avoid automated takedowns. The detection patterns match these exact obfuscated variants. Longest-match-first scanning ensures a short brand name never incorrectly matches inside a longer one.",
      },
      {
        icon: "Activity",
        title: "Live Progress Feed",
        description:
          "Twelve distinct event types stream from the backend as crawling progresses: album found, color analysis complete, brand detected, saved, and more. A progress bar and live log update in real time, working around a browser limitation to support the POST request the crawl requires.",
      },
      {
        icon: "Search",
        title: "Compound Tag Search",
        description:
          "Filters are grouped by category. Selecting multiple options within the same category broadens results; combining different categories narrows them. Color filtering uses a color similarity score against stored profiles, ranked within the same clothing type first.",
      },
      {
        icon: "Link",
        title: "Shareable URL State",
        description:
          "Every active filter is saved into the URL as you search, so refining results does not add extra entries to your browser history. Paste the URL into a new tab and the exact search state comes back.",
      },
    ],
    howItWorks: [
      {
        step: "Enter seller URL",
        detail: "Scraping begins immediately. Both crawl phases start and progress events stream to the browser straight away.",
      },
      {
        step: "Phase 1: discovery",
        detail:
          "Twenty workers scan the seller's album index pages and collect every album URL. The progress bar fills as albums are found.",
      },
      {
        step: "Phase 2: processing",
        detail:
          "Five workers fetch each album page. The cover image is downloaded, run through color clustering, tagged with brand and clothing type, and stored in SQLite.",
      },
      {
        step: "Gallery loads",
        detail:
          "Once scraping finishes, the gallery replaces the progress view. Everything is filterable straight away.",
      },
      {
        step: "Search and share",
        detail:
          "Compound tags filter the grid. Color similarity ranks results by how closely their color profile matches what you selected. Any filter state is a shareable URL.",
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
          "Sellers write brand names like N★ke and A★idas to avoid automated takedown systems. The detection logic was built specifically to match these obfuscated variants using longest-match-first scanning, so modified listings are caught just as reliably as plain text ones.",
      },
      {
        title: "Live streaming progress",
        description:
          "The backend streams twelve distinct event types over a server-sent event connection as crawling progresses, working around a browser limitation that would normally block SSE on a POST request. Albums populate the frontend before the crawl finishes.",
      },
      {
        title: "Grey/white normalization",
        description:
          "The k-means pipeline runs on every cover image, but large neutral clusters (white backgrounds, grey garments) are downweighted before the color profile is stored, so the clothing's actual color drives the match rather than the product background.",
      },
      {
        title: "Incremental results",
        description:
          "Each album is processed and written to the database as soon as it is scraped, not after the full crawl finishes. The frontend reflects new results in real time, so you can start filtering before the last page has been fetched.",
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
      "Paraphraser is a text editor where right-clicking any selection sends a context window of roughly forty surrounding words to an AI and streams five rephrasings back word by word. That surrounding context is what makes suggestions actually fit: without it, the AI has no idea what register or grammar your document is using. Accepting a suggestion triggers a word-level diff, and only the words that genuinely changed are treated as new edits, keeping the undo history intact across async AI calls. Synonym lookup fetches candidates from Datamuse, then sends them with the surrounding sentence to a second AI call that filters out anything contextually wrong. There is also a full CodeMirror 6 code editing mode.",
    accent: "#8b5cf6",
    tags: ["React", "TypeScript", "Frontend", "LLM API"],
    links: [{ label: "View on GitHub", href: "https://github.com/nickpalade/paraphraser" }],
    features: [
      {
        icon: "MousePointer2",
        title: "Context-Aware Rephrasings",
        description:
          "About forty words on each side of your selection are sent to the AI every time, so suggestions fit the document's style and grammar rather than just the selected phrase. Five alternatives stream back into a sliding panel.",
      },
      {
        icon: "Shuffle",
        title: "Word-by-Word Streaming",
        description:
          "Rephrasings appear word by word as the AI generates them, not all at once when it finishes. All five options load at the same time, so the panel fills in quickly.",
      },
      {
        icon: "GitMerge",
        title: "Undo-Preserving Accept",
        description:
          "When you accept a rephrasing, the app figures out which words actually changed. Words that stayed the same keep their place in the undo history. Only genuinely new words reset, so accepting a suggestion does not wipe your ability to undo earlier edits elsewhere in the document.",
      },
      {
        icon: "AlignLeft",
        title: "Smart Phrase Detection",
        description:
          "Hovering a word automatically expands the selection to include surrounding small words like 'the' or 'of' to form a more natural phrase. The expansion stops at sentence boundaries and waits briefly before appearing to avoid flickering during fast mouse movement.",
      },
      {
        icon: "BookOpen",
        title: "AI-Filtered Synonyms",
        description:
          "Hovering a word fetches synonym candidates from the Datamuse API. The list is then sent to the AI along with the surrounding sentence, and the AI filters out options that would sound wrong in context before showing them to you.",
      },
      {
        icon: "Code",
        title: "CodeMirror Code Mode",
        description:
          "A full code editor with syntax highlighting for writing and editing code. The same right-click rephrase panel and synonym picker work on code comments and strings, so you can rewrite documentation inline without leaving the editor.",
      },
    ],
    howItWorks: [
      {
        step: "Type or paste text",
        detail:
          "Your text is loaded into the editor and normalised so punctuation and spacing are handled consistently throughout.",
      },
      {
        step: "Right-click to rephrase",
        detail:
          "The surrounding text is gathered and sent to the AI along with your selection. Five rephrasings stream back word by word into the panel.",
      },
      {
        step: "Accept a rephrasing",
        detail:
          "The app identifies which words changed and which stayed the same. Unchanged words keep their undo history. Only new words are treated as fresh edits.",
      },
      {
        step: "Hover for synonyms",
        detail:
          "After a short pause, the selection expands to form a natural phrase. Synonym candidates are fetched and filtered by the AI for context fit, then shown inline.",
      },
      {
        step: "Ctrl+Z to undo",
        detail:
          "Undo steps back through your edits in order. In code mode, undo works across both your manual edits and any accepted rephrasings.",
      },
    ],
    techStack: [
      { name: "React + TypeScript + Vite", purpose: "Frontend framework" },
      { name: "CodeMirror 6", purpose: "Code editing mode with syntax highlighting" },
      { name: "OpenRouter API", purpose: "AI provider" },
      { name: "Datamuse API", purpose: "Word synonym lookup" },
      { name: "Tailwind CSS", purpose: "Styling" },
    ],
    highlights: [
      {
        title: "Reliable undo across async edits",
        description:
          "When an AI call completes and you accept a suggestion, the app runs a word-level diff against the current document and only invalidates undo entries for words that actually changed. A live ref keeps the document state current throughout streaming, so there is no risk of a stale closure undoing the wrong thing.",
      },
      {
        title: "Saved work survives app updates",
        description:
          "Your document is written to localStorage on every change and restored on load. The storage format carries a version number, so a schema change in a future update cleanly discards incompatible data rather than attempting a broken parse that corrupts state.",
      },
      {
        title: "Right-click menu always fully visible",
        description:
          "The context menu is mounted via a portal to the document root rather than inside the editor's DOM subtree, so it is never clipped by overflow or z-index constraints on the editor container. It always renders fully in view, even on right-clicks near the edge.",
      },
      {
        title: "Responses stream word by word",
        description:
          "The streaming API response is chunked and rendered token by token as it arrives, so all five rephrasings fill in simultaneously and the panel feels live. There is no waiting for the full response to complete before anything appears.",
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
      "HabitHunter grew out of wanting to understand actual spending patterns without relying on a subscription finance app. It imports directly from Revolut CSV exports, auto-categorizes transactions using a learned merchant mapping that gets smarter every time you correct a wrong category, and runs linear regression on monthly totals to predict future spending. The entire prediction engine is written from scratch without any math libraries. 207 unit tests cover the application end to end, verifying the CSV parser, prediction engine, and merchant mapper across edge cases like malformed input and unusual character sets.",
    accent: "#f59e0b",
    tags: ["Python", "Flask", "SQL", "Full-Stack"],
    links: [{ label: "View on GitHub", href: "https://github.com/nickpalade/HabitHunter" }],
    features: [
      {
        icon: "FileUp",
        title: "Revolut CSV Import",
        description:
          "Separates income from expenses automatically. Duplicate detection checks date, merchant, and amount, skipping any transaction that matches one already saved. A summary tells you how many transactions were imported and how many were skipped.",
      },
      {
        icon: "Map",
        title: "Self-Learning Merchant Mapper",
        description:
          "Correcting a transaction's category updates every other transaction from the same merchant at the same time, and remembers the mapping for all future imports. The more you use it, the less you have to manually categorize.",
      },
      {
        icon: "TrendingUp",
        title: "Spending Forecasts",
        description:
          "A forecasting engine built from scratch without any external libraries produces next-month, next-three-months, and yearly balance projections, per-category annual forecasts, and an estimate of how many days your current balance will last.",
      },
      {
        icon: "DollarSign",
        title: "Multi-Currency Support",
        description:
          "Transactions are stored in their original currency and converted to EUR, GBP, or USD at display time using live exchange rates fetched from exchangerate-api.com.",
      },
      {
        icon: "BarChart2",
        title: "7 Chart.js Visualizations",
        description:
          "Spending by category, a top-5 doughnut chart, average spend by day of week, transaction frequency by weekday, monthly income vs expense trends, a cumulative spending line, and category progress bars.",
      },
      {
        icon: "CheckSquare",
        title: "207-Test Suite",
        description:
          "207 unit tests cover the full application, written to verify every layer of the codebase works correctly. Edge cases include malformed CSV input, unusual merchant name characters, and numeric edge cases in the prediction engine, demonstrating a disciplined approach to software quality.",
      },
    ],
    howItWorks: [
      {
        step: "Upload CSV",
        detail:
          "The importer reads your Revolut export, separates income from expenses, checks for duplicates by comparing date, merchant, and amount, then saves only the new transactions.",
      },
      {
        step: "Auto-categorize",
        detail:
          "Known merchants are matched against a learned lookup and assigned a category instantly. Merchants seen for the first time land in 'Other' until you correct them.",
      },
      {
        step: "Fix a category",
        detail:
          "Changing one transaction's category updates every other transaction from the same merchant and saves the mapping. That merchant is categorized correctly on all future imports.",
      },
      {
        step: "View analytics",
        detail:
          "The analytics page groups your transactions by month, runs the forecasting engine over the totals, and displays five types of spending predictions alongside seven charts.",
      },
      {
        step: "Set budgets",
        detail:
          "Set a spending limit for any category. Each budget card shows how much you have spent, how much remains, and a progress bar. A timeframe filter applies across the whole app.",
      },
    ],
    techStack: [
      { name: "Python + Flask 3.1.2", purpose: "Web framework" },
      { name: "SQLite3", purpose: "Database" },
      { name: "Jinja2", purpose: "HTML templates" },
      { name: "Chart.js 4.4.0", purpose: "7 data visualizations" },
      { name: "pytest 9.0.2", purpose: "207-test suite" },
      { name: "exchangerate-api.com", purpose: "Live exchange rates" },
    ],
    highlights: [
      {
        title: "Zero-boilerplate data loading",
        description:
          "Transaction rows from the database map directly into Python objects using sqlite3's row_factory, with no ORM or manual field mapping. Adding a new column to the schema makes it available in the application immediately.",
      },
      {
        title: "Save = full delete + reinsert",
        description:
          "Every write operation deletes all rows for the current user and reinserts the full in-memory transaction list. The strategy is simple and provably correct, which is the right tradeoff at personal finance data volumes where the overhead is negligible.",
      },
      {
        title: "Transactions identified by their data, not an ID",
        description:
          "Edit and delete operations identify a transaction by its actual date, merchant, and amount rather than a synthetic primary key. The identifier shown on screen and the one used in the database query are always the same thing, so there is no ID column to drift out of sync.",
      },
      {
        title: "Forecasting engine built from scratch",
        description:
          "The forecasting engine implements linear regression using only Python's built-in functions, with no math, numpy, or statistics libraries. A data sufficiency check prevents the model from producing results when there are too few months to fit a meaningful line.",
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
      "This started as a summer project before A-levels, motivated by reading about how social media recommendation systems create echo chambers and amplify misinformation. The design deliberately counters that: no ranking algorithm, no network-based filtering, posts shown in insertion order only, and like/dislike counts always shown as raw numbers rather than hidden behind vague engagement indicators. Built entirely without frameworks, raw PHP, MySQL, vanilla JavaScript, and plain CSS, which meant implementing session handling, a self-referential recursive thread structure, and the shared data layer from scratch.",
    accent: "#f43f5e",
    tags: ["PHP", "JavaScript", "CSS", "SQL", "Full-Stack"],
    features: [
      {
        icon: "CornerDownRight",
        title: "Infinite Thread Depth",
        description:
          "Posts and comments share the same structure. Any comment can be opened as its own thread with replies of its own, which can themselves be opened, and so on without limit. There is no maximum nesting depth and no separate comment system.",
      },
      {
        icon: "Heart",
        title: "Consistent Reaction System",
        description:
          "Likes, dislikes, and saves all go through one backend system. Reacting again with the same action removes it; switching replaces the old one.",
      },
      {
        icon: "Layout",
        title: "No-Reload Post Rendering",
        description:
          "New posts appear without a full reload. JavaScript fills in templates already in the page, so the feed updates instantly with no frameworks and no build step.",
      },
      {
        icon: "List",
        title: "Chronological-Only Feed",
        description:
          "No ranking, no algorithm, no network-based filtering. Posts appear in insertion order. Like and dislike counts are always shown together as raw numbers. The platform makes no attempt to surface popular content or hide negative sentiment.",
      },
      {
        icon: "Link",
        title: "Directly Linkable Posts",
        description:
          "Clicking a post updates the URL so it can be copied and shared. Opening that link takes you straight to the post. The back button works as expected without reloading the full page.",
      },
      {
        icon: "Hash",
        title: "Tag-Based Discovery",
        description:
          "Users find content by topic tag rather than by following accounts. A post about a topic shows up whether or not you follow the person who wrote it.",
      },
    ],
    howItWorks: [
      {
        step: "Register and log in",
        detail:
          "Creating an account and logging in gives you a session. The feed loads immediately, showing all posts in the order they were created.",
      },
      {
        step: "Create a post",
        detail:
          "The same form handles both posts and replies. Posts get a title; replies link back to the post they belong to.",
      },
      {
        step: "React to a post",
        detail:
          "Clicking like, dislike, or save sends your reaction. Clicking the same reaction again removes it. Switching reactions replaces the previous one.",
      },
      {
        step: "View a thread",
        detail:
          "Clicking a post loads it along with its direct replies. The URL updates so the thread is bookmarkable. Any reply can be opened as its own thread the same way.",
      },
      {
        step: "See vote counts",
        detail:
          "Both the like and dislike count are fetched and displayed together. Neither number is hidden or combined into a single vague score.",
      },
    ],
    techStack: [
      { name: "PHP", purpose: "Backend (no framework)" },
      { name: "MySQL", purpose: "Database" },
      { name: "Vanilla JavaScript", purpose: "Frontend rendering" },
      { name: "Plain CSS", purpose: "Per-page stylesheets" },
      { name: "Apache/PHP server", purpose: "Deployment" },
    ],
    highlights: [
      {
        title: "One table for posts and comments",
        description:
          "A top-level post and a deeply nested reply are stored in the same table with the same schema. A single parent reference field is what creates the thread structure. The same SQL queries and PHP templates handle both, making the recursive nesting effectively unlimited with no special-casing.",
      },
      {
        title: "Shared query layer",
        description:
          "Every data-fetching endpoint runs through a common finishing function: execute the query, join usernames from the users table, and return JSON. New endpoints only need the query itself, not any of the plumbing around it.",
      },
      {
        title: "One query for both counts",
        description:
          "Like and dislike counts are fetched in a single aggregated query that groups reactions by type. Both numbers arrive in one database round trip and are always displayed side by side, with neither hidden or blended into a composite score.",
      },
      {
        title: "Anti-engagement design",
        description:
          "Every feature decision was filtered through one question: does this increase engagement at the cost of accuracy or diversity? The chronological feed, raw vote ratios, and tag-based discovery all exist specifically because they refuse to optimize for time on site.",
      },
    ],
  },
  {
    slug: "roblox",
    index: 6,
    title: "Roblox Project",
    tagline:
      "A fully playable Roblox game built alone: mine crystals, train strength, collect and evolve pets, and unlock new zones. Over 8,000 lines of Luau.",
    overview:
      "A mining and progression game built entirely solo on Roblox. The core loop: punch rocks to shatter crystals and earn money, punch training bags to grow your strength (which determines how fast rocks break), and equip pets that multiply everything you earn. Progress unlocks new zones with harder rocks and bigger payouts. Every system, from the rock health bars and live efficiency score to the pet evolution mechanic, daily login bonus, and anti-cheat, was designed and coded from scratch in type-annotated Luau. No external plugins. No borrowed scripts. Over 8,000 lines, one developer.",
    accent: "#f97316",
    tags: ["Lua", "Game Dev"],
    links: [{ label: "Play on Roblox", href: "https://www.roblox.com/games/13230751727/" }],
    features: [
      {
        icon: "Zap",
        title: "Rock Mining Loop",
        description:
          "Each rock has a layer of crystals and a solid core. Punching it chips away crystals one by one, each shattering with a sound and particle burst, then a final hit destroys the core for a bigger payout. A dual progress bar above the rock tracks both phases. Rocks respawn in random positions across the zone once broken, with a minimum spacing check so they never stack on top of each other.",
      },
      {
        icon: "TrendingUp",
        title: "Strength Training",
        description:
          "Hitting a training bag increases your strength stat. Higher strength means more damage per punch, so rocks break faster and money stacks up quicker. A VIP bag gives a larger bonus and requires a game pass. Strength shows on the in-game leaderboard and is saved across sessions.",
      },
      {
        icon: "Heart",
        title: "Pet Collection and Evolution",
        description:
          "Pets follow the player with a bouncing animation and multiply all money earned. Equipping multiple pets stacks their bonuses. Combining three identical pets of the same tier merges them into one evolved version with a higher multiplier. All equipped pets are visible to every other player in the server.",
      },
      {
        icon: "Map",
        title: "Multi-Zone Progression",
        description:
          "Multiple unlockable zones are connected by portals. Each zone has its own rock types and visual atmosphere that fades in smoothly when you arrive. A level gate checks your stats before allowing entry and tells you what you still need. When you move zones, the previous one is hidden to keep performance smooth.",
      },
      {
        icon: "BarChart2",
        title: "Live Efficiency Score",
        description:
          "The server tracks money earned per minute for every player and divides it by their strength to produce a live efficiency score. This displays above each player's head in real time, colour-coded from red to green based on your personal best. The score fades out after a long drop in performance.",
      },
      {
        icon: "CheckSquare",
        title: "Daily Login Bonus",
        description:
          "A counter tracks how many times you have joined in a given period. Log in 5 times within a 19-hour window and your total money gets a 1.25x boost. The counter and window reset automatically and carry over between sessions, so there is no way to miss progress from a previous visit.",
      },
    ],
    howItWorks: [
      {
        step: "Join",
        detail:
          "Your stats load from the server: money, strength, pets, and zone progress. Any pets you had equipped last session follow you straight away.",
      },
      {
        step: "Punch rocks",
        detail:
          "Each punch chips away crystals and earns money. Clear all the crystals, then land the final hit to destroy the core for a bigger reward. Rocks respawn across the zone over time.",
      },
      {
        step: "Train at a bag",
        detail:
          "Hitting a training bag raises your strength. Higher strength means each punch does more damage, so you break rocks faster as you progress.",
      },
      {
        step: "Equip pets",
        detail:
          "Open your inventory and equip pets to follow you and multiply your earnings. Three identical pets at the same tier can be merged into one evolved version with a higher multiplier.",
      },
      {
        step: "Move to the next zone",
        detail:
          "Walk through a portal. If your stats are high enough, you teleport in. Otherwise, a message tells you what you still need. Each new zone has tougher rocks and bigger payouts.",
      },
      {
        step: "Come back daily",
        detail:
          "Logging in consistently counts toward a join streak. Hit 5 logins in the window and your money gets a 1.25x boost. The counter resets automatically for the next cycle.",
      },
    ],
    techStack: [
      { name: "Luau", purpose: "Primary scripting language (gradual typing throughout)" },
      { name: "Roblox Studio", purpose: "Development environment and game engine" },
      { name: "Roblox DataStore", purpose: "Persistent storage for stats, money, and pet inventory" },
      { name: "RemoteEvents / RemoteFunctions", purpose: "Secure server-client communication" },
      { name: "TweenService", purpose: "Animations for UI, zone transitions, and music" },
    ],
    highlights: [
      {
        title: "Server runs the game, client shows it",
        description:
          "Every game-changing action (punching a rock, gaining strength, earning money) is processed on the server. The client sends an intent and receives a verified result. All stat validation, damage calculation, and progression logic lives in one authoritative place, and players have no ability to fake progress from their own machine.",
      },
      {
        title: "Live efficiency score above every player",
        description:
          "The server tracks coins earned over a rolling 60-second window for every player, divides by their strength stat, and broadcasts the result as a real-time efficiency score shown above each player's head. The score is colour-coded relative to each player's personal best and fades out during long performance drops.",
      },
      {
        title: "Zone streaming",
        description:
          "The game has multiple zones, but only the active one is rendered at any time. Moving zones immediately hides the previous one and activates the next, keeping frame rate stable regardless of how large the total map is. This was implemented manually with no engine-level streaming support.",
      },
      {
        title: "8,000 lines, one developer",
        description:
          "Every system, from the mining loop and pet evolution to the anti-cheat, music player, efficiency tracker, and UI, was written alone with no external scripts or plugins. Luau type annotations were applied throughout the codebase, not just in spots, so type errors surface at edit time rather than at runtime in a live game.",
      },
    ],
  },
];
