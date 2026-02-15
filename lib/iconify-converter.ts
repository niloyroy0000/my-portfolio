/**
 * Iconify Converter Utility
 *
 * Converts react-icons naming convention (e.g., "FaReact", "SiTypescript")
 * to Iconify naming convention (e.g., "fa-brands:react", "simple-icons:typescript")
 *
 * Used by DynamicIcon component to support database-driven icon names.
 */

// Library prefix mappings
const LIBRARY_MAP: Record<string, string> = {
  Fa: "fa",
  Fa6: "fa6-solid",
  Fi: "feather",
  Si: "simple-icons",
  Di: "devicon",
  Tb: "tabler",
  Md: "mdi",
  Gr: "grommet-icons",
  Ri: "ri",
  Gi: "game-icons",
  Go: "octicon",
  Pi: "ph",
  Vsc: "vscode-icons",
  Hi: "heroicons",
  Hi2: "heroicons",
  Bs: "bi",
  Ai: "ant-design",
  Io: "ion",
  Io5: "ion",
};

// Special cases for Font Awesome brands
const FA_BRANDS = [
  "github",
  "linkedin",
  "linkedin-in",
  "stack-overflow",
  "medium",
  "js",
  "git-alt",
  "docker",
  "react",
  "angular",
  "bootstrap",
  "node-js",
  "java",
  "python",
  "vuejs",
  "linux",
  "aws",
];

// Special case mappings (icon name transformations)
const SPECIAL_CASES: Record<string, string> = {
  // Font Awesome
  FaTimes: "fa:times",
  FaExternalLinkAlt: "fa:external-link-alt",
  FaRegBuilding: "fa-regular:building",
  FaClock: "fa-solid:clock",
  FaCalendar: "fa-solid:calendar",
  FaCalendarAlt: "fa-solid:calendar-alt",
  FaFireAlt: "fa:fire-alt",
  FaPhoneAlt: "fa-solid:phone-alt",
  FaTachometerAlt: "fa-solid:tachometer-alt",
  FaMapMarkedAlt: "fa-solid:map-marked-alt",
  FaGlobeAmericas: "fa:globe-americas",
  FaCheckCircle: "fa:check-circle",
  FaExclamationCircle: "fa:exclamation-circle",
  FaExclamationTriangle: "fa:exclamation-triangle",
  FaInfoCircle: "fa:info-circle",
  FaAward: "fa-solid:award",
  FaGraduationCap: "fa:graduation-cap",
  FaCertificate: "fa-solid:certificate",
  FaDollarSign: "fa:dollar-sign",
  FaQuoteLeft: "fa:quote-left",
  FaCode: "fa-solid:code",
  FaCodeBranch: "fa-solid:code-branch",
  FaCloud: "fa-solid:cloud",
  FaMagic: "fa-solid:magic",
  FaHandshake: "fa-solid:handshake",
  FaBrain: "fa-solid:brain",
  FaFunnelDollar: "fa:funnel-dollar",
  FaProjectDiagram: "fa:project-diagram",
  FaExchangeAlt: "fa:exchange-alt",
  FaCommentDots: "fa:comment-dots",
  FaPaperPlane: "fa:paper-plane",
  FaChartLine: "fa:chart-line",
  FaChartBar: "fa:chart-bar",
  FaThumbsUp: "fa:thumbs-up",
  FaThumbsDown: "fa:thumbs-down",
  FaClipboardList: "fa:clipboard-list",
  FaTheaterMasks: "fa-solid:theater-masks",

  // Font Awesome brands
  FaGithub: "fa-brands:github",
  FaLinkedin: "fa-brands:linkedin",
  FaLinkedinIn: "fa-brands:linkedin-in",
  FaStackOverflow: "fa-brands:stack-overflow",
  FaMedium: "fa-brands:medium",
  FaJs: "fa-brands:js",
  FaGitAlt: "fa-brands:git-alt",
  FaDocker: "fa-brands:docker",
  FaReact: "fa-brands:react",
  FaAngular: "fa-brands:angular",
  FaBootstrap: "fa-brands:bootstrap",
  FaNodeJs: "fa-brands:node-js",
  FaJava: "fa-brands:java",
  FaPython: "fa-brands:python",
  FaVuejs: "fa-brands:vuejs",
  FaLinux: "fa-brands:linux",
  FaAws: "fa-brands:aws",

  // Font Awesome 6
  FaArrowsSpin: "fa6-solid:arrows-spin",

  // Feather
  FiX: "feather:x",
  FiCheckCircle: "feather:check-circle",
  FiChevronDown: "feather:chevron-down",
  FiChevronUp: "feather:chevron-up",
  FiArrowRight: "feather:arrow-right",
  FiArrowLeft: "feather:arrow-left",
  FiArrowDown: "feather:arrow-down",
  FiExternalLink: "feather:external-link",
  FiTrash2: "feather:trash-2",
  FiMousePointer: "feather:mouse-pointer",
  FiTrendingUp: "feather:trending-up",

  // Simple Icons
  SiVuejs: "simple-icons:vuedotjs",
  SiNextdotjs: "simple-icons:nextdotjs",
  SiReactquery: "simple-icons:reactquery",
  SiNodedotjs: "simple-icons:nodedotjs",
  SiCsharp: "simple-icons:csharp",
  SiHtml5: "simple-icons:html5",
  SiCss3: "simple-icons:css3",
  SiTailwindcss: "simple-icons:tailwindcss",
  SiPostgresql: "simple-icons:postgresql",
  SiAmazondynamodb: "simple-icons:amazondynamodb",
  SiAmazonec2: "simple-icons:amazonec2",
  SiAwslambda: "simple-icons:awslambda",
  SiAmazons3: "simple-icons:amazons3",
  SiAmazonsqs: "simple-icons:amazonsqs",
  SiAmazonsimpleemailservice: "simple-icons:amazonsimpleemailservice",
  SiAmazonaws: "simple-icons:amazonaws",
  SiMicrosoftazure: "simple-icons:microsoftazure",
  SiGooglecloud: "simple-icons:googlecloud",
  SiTestinglibrary: "simple-icons:testinglibrary",

  // Devicon
  DiMsqlServer: "devicon:microsoftsqlserver",
  DiDotnet: "devicon:dot-net",

  // Tabler
  TbBrandCSharp: "tabler:brand-c-sharp",
  TbBrandLinqpad: "tabler:brand-linqpad",
  TbBrandTailwind: "tabler:brand-tailwind",

  // Material Design
  MdNotifications: "mdi:bell",

  // Grommet
  GrVirtualMachine: "grommet-icons:virtual-machine",

  // Remix Icons
  RiRobot3Fill: "ri:robot-3-fill",

  // Game Icons
  GiCogsplosion: "game-icons:cog",

  // Octicons
  GoCopilot: "octicon:copilot-16",

  // Phosphor
  PiKanban: "ph:kanban",

  // VS Code Icons
  VscAzure: "vscode-icons:folder-type-azure",
  VscAzureDevops: "vscode-icons:folder-type-azuredevops",

  // Hero Icons
  HiOutlineBuildingOffice2: "heroicons:building-office-2",

  // Bootstrap Icons
  BsMicrosoftTeams: "bi:microsoft-teams",

  // Custom SVG icons (keep as-is for DynamicIcon to handle)
  GoogleAIStudio: "GoogleAIStudio",
  Playwright: "Playwright",
  ClaudeAI: "ClaudeAI",
  Cursor: "Cursor",
  MCP: "MCP",
};

/**
 * Converts PascalCase to kebab-case
 * Example: FaGithub → fa-github, SiTypescript → si-typescript
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
}

/**
 * Converts react-icons icon name to Iconify icon name
 *
 * @param iconName - React icon name (e.g., "FaGithub", "SiTypescript")
 * @returns Iconify icon name (e.g., "fa-brands:github", "simple-icons:typescript")
 *
 * @example
 * convertToIconify("FaGithub") // "fa-brands:github"
 * convertToIconify("SiTypescript") // "simple-icons:typescript"
 * convertToIconify("FiSearch") // "feather:search"
 */
export function convertToIconify(iconName: string): string {
  // Check special cases first
  if (SPECIAL_CASES[iconName]) {
    return SPECIAL_CASES[iconName];
  }

  // Extract prefix (first 2-3 characters)
  const prefix = iconName.match(/^([A-Z][a-z]+)/)?.[1];
  if (!prefix) {
    console.warn(`Invalid icon name format: ${iconName}`);
    return iconName;
  }

  // Get library name
  const library = LIBRARY_MAP[prefix];
  if (!library) {
    console.warn(`Unknown icon library prefix: ${prefix} in ${iconName}`);
    return iconName;
  }

  // Extract icon name (everything after prefix)
  const nameWithoutPrefix = iconName.substring(prefix.length);
  const kebabName = toKebabCase(nameWithoutPrefix);

  // Special handling for Font Awesome brands
  if (prefix === "Fa" && FA_BRANDS.some((brand) => kebabName.includes(brand))) {
    return `fa-brands:${kebabName}`;
  }

  return `${library}:${kebabName}`;
}

/**
 * Batch converts multiple icon names
 *
 * @param iconNames - Array of react-icons names
 * @returns Array of Iconify names
 */
export function convertMultipleToIconify(iconNames: string[]): string[] {
  return iconNames.map(convertToIconify);
}
