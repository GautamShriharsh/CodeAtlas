import {
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  FolderGit2,
  Loader2,
  Sparkles,
  User,
  Download,
  CheckCircle2,
  Network,
  Package,
  FileText,
  GitCommit,
  Lightbulb,
  Code2,
} from "lucide-react";

const TREE = [
  { type: "repo", label: "placer / platform", depth: 0 },
  { type: "folder", label: "src", depth: 0, open: true },
  { type: "folder", label: "components", depth: 1 },
  { type: "folder", label: "pages", depth: 1 },
  { type: "folder", label: "hooks", depth: 1 },
  { type: "folder", label: "utils", depth: 1 },
  { type: "folder", label: "api", depth: 0, open: true },
  { type: "folder", label: "routes", depth: 1 },
  { type: "folder", label: "middleware", depth: 1 },
  { type: "folder", label: "lib", depth: 0, open: false },
  { type: "folder", label: "prisma", depth: 0, open: true },
  { type: "file", label: "schema.prisma", depth: 1 },
  { type: "file", label: ".env", depth: 0 },
  { type: "file", label: ".gitignore", depth: 0 },
  { type: "file", label: "README.md", depth: 0 },
];

const COMMITS = [
  {
    id: "D1",
    dev: "dev1",
    time: "2 hours ago",
    title: "Fix: Resolve header alignment issue on mobile",
    desc: "Adjusted flex layout and spacing for consistent header alignment across breakpoints.",
    branch: "main",
  },
  {
    id: "D2",
    dev: "dev2",
    time: "5 hours ago",
    title: "Feat: Add dark mode toggle to settings",
    desc: "Implemented theme switcher and persisted preference in local storage.",
    branch: "dev",
  },
  {
    id: "D3",
    dev: "dev3",
    time: "1 day ago",
    title: "Fix: Correct API error handling on login",
    desc: "Handled 401 and 403 responses properly and show user-friendly messages.",
    branch: "main",
  },
];

const AUTH_STEPS = [
  "User initiates sign in from the /login page.",
  "NextAuth.js handles the provider and sets a session using JWT.",
  "The session is stored in a secure, httpOnly cookie.",
  "Middleware protects routes and validates the session.",
  "User data is fetched from the database on session creation and attached to the token.",
];

const COLOR_STYLES: any = {
  blue: {
    icon: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  purple: {
    icon: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  amber: {
    icon: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  orange: {
    icon: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  green: {
    icon: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  cyan: {
    icon: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
};

const KNOWLEDGE = [
  {
    icon: Network,
    label: "Architecture",
    value: "12 components",
    color: "blue",
  },
  {
    icon: Package,
    label: "Dependencies",
    value: "84 modules",
    color: "purple",
  },
  {
    icon: FileText,
    label: "Documentation",
    value: "23 entries",
    color: "amber",
  },
  { icon: GitCommit, label: "Commits", value: "15 recent", color: "orange" },
  {
    icon: Lightbulb,
    label: "Code Insights",
    value: "37 patterns",
    color: "green",
  },
  { icon: Code2, label: "API Routes", value: "18 endpoints", color: "cyan" },
];

const CHECKLIST = [
  "Repository Indexed",
  "Commits Summarized",
  "Architecture Mapped",
  "AI Ready",
];

function TreeRow({ item }: any) {
  const indent = item.depth === 1 ? "pl-7" : "pl-2";

  if (item.type === "repo") {
    return (
      <div className="flex items-center gap-2 pb-3 pl-2 text-sm text-neutral-300">
        <FolderGit2 className="h-4 w-4 text-neutral-500" />
        <span className="truncate">{item.label}</span>
      </div>
    );
  }

  if (item.type === "file") {
    return (
      <div
        className={`flex min-w-0 items-center gap-1.5 py-1 text-sm text-neutral-500 ${indent}`}
      >
        <File className="h-3.5 w-3.5 text-neutral-600" />
        <span className="truncate">{item.label}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex min-w-0 items-center gap-1.5 py-1 text-sm text-neutral-400 ${indent}`}
    >
      {item.depth === 0 ? (
        item.open ? (
          <ChevronDown className="h-3.5 w-3.5 text-neutral-600" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
        )
      ) : null}
      <Folder className="h-3.5 w-3.5 text-neutral-500" />
      <span className="truncate">{item.label}</span>
    </div>
  );
}

export default function HeroCodebaseMockupPreview() {
  return (
    <div className="relative z-0 mt-15 w-full overflow-hidden bg-black px-4 pt-12 pb-24 sm:px-6 sm:pb-32 lg:px-8">
      
      {/* ---------------------------------------------------- */}
      {/* LINEAR-STYLE STUDIO BACKGROUND                         */}
      {/* ---------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Top mask layer */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black via-black via-[25%] to-transparent" />
        
        {/* Vignette layer that dims glow explicitly toward the outer corners */}
        <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.35)_100%)]" />
        
     {/* LEFT SIDE: Unevenly spread radial drop-off */}
{/* LEFT SIDE: Seamlessly blended matching studio drop-off */}
<div className="absolute bottom-[-100px] left-[10%] w-[450px] h-[250px] z-20 bg-[radial-gradient(ellipse_at_bottom,rgba(35,39,46,0.45)_0%,transparent_85%)] pointer-events-none filter blur-sm" />

{/* RIGHT SIDE: Seamlessly blended matching studio drop-off */}
<div className="absolute bottom-[-100px] right-[10%] w-[450px] h-[250px] z-20 bg-[radial-gradient(ellipse_at_bottom,rgba(35,39,46,0.45)_0%,transparent_85%)] pointer-events-none filter blur-sm" />
        <img
          src="/grey-gradient.jpg"
          alt="Background gradient backdrop"
          className="absolute inset-0 h-full w-full scale-[2.8] translate-y-[12%] object-cover opacity-65 origin-center"
        />

        
      </div>
      {/* ---------------------------------------------------- */}

      <div className="relative mx-auto max-w-[1400px] px-2 sm:px-6 lg:px-10">
        <p
          className="mb-8 text-center text-xs font-medium text-neutral-500"
          style={{ letterSpacing: "0.35em" }}
        >
          AI THAT UNDERSTANDS YOUR CODEBASE
        </p>

        <div className="relative">
          {/* ---------------------------------------------------- */}
          {/* 3D STUDIO FLOOR OCCLUSION SHADOWS                    */}
          {/* ---------------------------------------------------- */}
          {/* Tight contact shadow directly under the dashboard base */}
          {/* <div className="absolute bottom-0 left-[1%] right-[1%] -z-10 h-2 bg-black/90 blur-[2px] pointer-events-none" />
           */}
           {/* Bottom Left Corner */}
<div
  className="
    pointer-events-none
    absolute
    -bottom-2
    left-5
    h-10
    w-32
    rounded-full
    bg-black/35
    blur-xl
    -z-10
  "
/>

{/* Bottom Right Corner */}
<div
  className="
    pointer-events-none
    absolute
    -bottom-2
    right-5
    h-10
    w-32
    rounded-full
    bg-black/35
    blur-xl
    -z-10
  "
/>
          {/* Soft ambient light bounce spreading further down the floor plane */}
          {/* <div className="absolute bottom-[-6px] left-[3%] right-[3%] -z-10 h-6 bg-black/50 blur-md pointer-events-none" /> */}
          {/* ---------------------------------------------------- */}

          {/* Changed corner radius to rounded-xl for a sleeker, desktop window aesthetic */}
          <div className="relative grid grid-cols-1 overflow-hidden rounded-xl border border-neutral-800/60 bg-neutral-950/70 backdrop-blur-xl md:grid-cols-2">
            {/* Divider */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden -translate-x-1/2 md:block">
              <div className="relative h-full w-px bg-neutral-800">
                {/* Soft glow */}
                <div className="absolute inset-0 bg-white/10 blur-[2px]" />

                {/* Bright center */}
                <div className="absolute top-1/2 left-1/2 h-40 w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-white/80 to-transparent blur-sm" />
              </div>
            </div>

            {/* LEFT PANEL */}
            <div className="@container p-5 md:p-8 xl:p-10">
              <h3 className="text-lg font-semibold tracking-tight text-neutral-100">
                Repository
              </h3>
              <div className="mt-1.5 flex items-center gap-1.5 text-sm text-neutral-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Indexing in progress...
              </div>

              <div className="mt-5 border-t border-neutral-800/70 pt-5">
                <div className="grid grid-cols-1 gap-6 @[480px]:grid-cols-5">
                  <div className="col-span-1 @[480px]:col-span-2 @[480px]:border-r @[480px]:border-neutral-900 @[480px]:pr-4">
                    {TREE.map((item, i) => (
                      <TreeRow key={i} item={item} />
                    ))}
                  </div>

                  <div className="col-span-1 @[480px]:col-span-3">
                    <p className="mb-3 text-sm font-medium text-neutral-300">
                      Git Commits
                    </p>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="rounded-md border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
                        main
                      </span>
                      <span className="rounded-md border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-400">
                        dev
                      </span>
                    </div>

                    <div className="relative">
                      <div
                        className="absolute top-2 bottom-2 w-px bg-neutral-800"
                        style={{ left: "7px" }}
                      />
                      <div className="space-y-4">
                        {COMMITS.map((commit) => (
                          <div key={commit.id} className="relative flex gap-2">
                            <span
                              className={`relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-neutral-950 ${
                                commit.branch === "dev"
                                  ? "bg-purple-400"
                                  : "bg-blue-400"
                              }`}
                            />
                            <div className="flex-1 rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-3">
                              <div className="mb-1.5 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs">
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${commit.branch === "dev" ? "bg-purple-400" : "bg-blue-400"}`}
                                  />
                                  <span className="font-medium text-neutral-300">
                                    {commit.dev}
                                  </span>
                                  <span className="text-neutral-600">
                                    {commit.time}
                                  </span>
                                </div>
                                <span
                                  className="rounded-full bg-neutral-800 px-1.5 py-0.5 text-neutral-400"
                                  style={{ fontSize: "10px" }}
                                >
                                  {commit.id}
                                </span>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug font-medium break-words text-neutral-200">
                                {commit.title}
                              </p>
                              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                                {commit.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800/70">
                      <Download className="h-4 w-4 text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-200">
                        Indexing repository...
                      </p>
                      <p className="text-xs text-neutral-500">
                        Analyzing structure, dependencies, and recent changes
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-neutral-300">
                    73%
                  </span>
                </div>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: "73%" }}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="@container p-5 md:p-8 xl:p-10">
              <h3 className="text-lg font-semibold tracking-tight text-neutral-100">
                AI Understanding
              </h3>
              <div className="mt-1.5 flex items-center gap-2 text-sm text-neutral-500">
                Repository indexed
                <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                  AI ready
                </span>
              </div>

              <div className="mt-5 flex justify-end">
                <div className="flex w-full items-center justify-between gap-4 rounded-2xl border border-neutral-800/70 bg-black/40 px-4 py-3 sm:max-w-[85%] lg:max-w-[65%]">
                  <span className="text-sm text-neutral-400">
                    Explain the authentication flow.
                  </span>

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20">
                    <User className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                <div className="flex gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  <p className="text-sm leading-relaxed text-neutral-300">
                    The authentication flow starts when a user signs in via
                    NextAuth.js using Email + Magic Link or GitHub OAuth.
                  </p>
                </div>
                <ol className="mt-3 space-y-1.5 pl-6">
                  {AUTH_STEPS.map((step, i) => (
                    <li key={i} className="flex gap-2 text-sm text-neutral-400">
                      <span className="text-neutral-600">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                  This ensures secure access to protected API routes and
                  personalized user data across the app.
                </p>
              </div>

              <p className="mt-6 mb-3 text-sm font-medium text-neutral-300">
                Codebase Knowledge
              </p>
              <div className="grid grid-cols-2 gap-3 @[380px]:grid-cols-3">
                {KNOWLEDGE.map((k) => {
                  const styles = COLOR_STYLES[k.color];
                  const Icon = k.icon;
                  return (
                    <div
                      key={k.label}
                      className={`rounded-lg border ${styles.border} ${styles.bg} p-3`}
                    >
                      <Icon className={`h-4 w-4 ${styles.icon}`} />
                      <p className="mt-2 text-xs @[380px]:text-sm font-medium leading-tight text-neutral-200">
                        {k.label}
                      </p>
                      <p className="text-[11px] @[380px]:text-xs text-neutral-500">{k.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-neutral-900 pt-4">
                {CHECKLIST.map((label) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-xs text-neutral-400"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}