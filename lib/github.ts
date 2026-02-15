/**
 * GitHub API Service
 *
 * Fetches real GitHub activity data for the portfolio.
 * Primary: GraphQL API (authenticated, 1 year of data)
 * Fallback: Events API (public, last 90 days)
 * Rate limit: 5,000 requests/hour (authenticated) or 60 requests/hour (public)
 */

// GitHub username for the portfolio
export const GITHUB_USERNAME = "biswajitpanday";
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

// Activity types mapped from GitHub events
export type ActivityType = 'commit' | 'pr' | 'issue' | 'repo' | 'other';

// GraphQL API response type
interface GraphQLContributionResponse {
  success: boolean;
  totalContributions: number;
  contributionMap: Record<string, number>;
  dateRange: {
    from: string;
    to: string;
  };
}

export interface GitHubActivity {
  date: string; // YYYY-MM-DD format
  count: number;
  type: ActivityType;
  details?: string[];
}

export interface GitHubStats {
  totalContributions: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalRepos: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  recentActivity: GitHubActivity[];
}

// GitHub Event types we track
interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
  payload?: {
    commits?: Array<{ message: string }>;
    action?: string;
    ref_type?: string;
  };
}

/**
 * Maps GitHub event types to our activity types
 */
function mapEventType(eventType: string): ActivityType {
  switch (eventType) {
    case 'PushEvent':
      return 'commit';
    case 'PullRequestEvent':
      return 'pr';
    case 'IssuesEvent':
    case 'IssueCommentEvent':
      return 'issue';
    case 'CreateEvent':
    case 'ForkEvent':
    case 'WatchEvent':
      return 'repo';
    default:
      return 'other';
  }
}

/**
 * Fetches cached contribution data from static JSON file
 * Generated at build time using GraphQL API (1 year of data)
 * Falls back to Events API if cache is unavailable
 */
async function fetchCachedContributions(): Promise<Map<string, number> | null> {
  try {
    const response = await fetch('/data/github-contributions.json', {
      // Cache for 1 hour since this is static data
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.warn('Cached GitHub data unavailable, will use Events API fallback');
      return null;
    }

    const data: GraphQLContributionResponse = await response.json();

    if (!data.success || !data.contributionMap) {
      console.warn('Invalid cached data, will use Events API fallback');
      return null;
    }

    // Convert to Map for consistency with existing code
    const contributionMap = new Map<string, number>();
    Object.entries(data.contributionMap).forEach(([date, count]) => {
      contributionMap.set(date, count);
    });

    console.log(`✅ Loaded ${contributionMap.size} days of GitHub contributions from cache`);
    console.log(`   Data from: ${data.dateRange.from} to ${data.dateRange.to}`);
    return contributionMap;
  } catch (error) {
    console.warn('Failed to load cached GitHub data:', error);
    return null;
  }
}

/**
 * Fetches public events from GitHub API
 * Note: GitHub Events API only returns last 90 days, max 300 events (10 pages of 30)
 * This is now used as a fallback when GraphQL API is unavailable
 */
async function fetchGitHubEvents(username: string, page: number = 1): Promise<GitHubEvent[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=1000&page=${page}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
        // Cache for 5 minutes to avoid rate limiting
        next: { revalidate: 300 }
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        console.warn('GitHub API rate limit exceeded');
        return [];
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch GitHub events:', error);
    return [];
  }
}

/**
 * Fetches all available events (up to 3 pages = 300 events)
 */
async function fetchAllEvents(username: string): Promise<GitHubEvent[]> {
  const allEvents: GitHubEvent[] = [];

  // Fetch up to 3 pages (300 events max from GitHub)
  for (let page = 1; page <= 3; page++) {
    const events = await fetchGitHubEvents(username, page);
    if (events.length === 0) break;
    allEvents.push(...events);
    if (events.length < 100) break; // No more events available
  }

  return allEvents;
}

/**
 * Processes raw events into daily activity summaries
 */
function processEventsToActivities(events: GitHubEvent[]): GitHubActivity[] {
  const activityMap = new Map<string, GitHubActivity>();

  events.forEach(event => {
    const date = event.created_at.split('T')[0]; // YYYY-MM-DD
    const type = mapEventType(event.type);
    const key = `${date}-${type}`;

    // Count commits for PushEvents
    let count = 1;
    if (event.type === 'PushEvent' && event.payload?.commits) {
      count = event.payload.commits.length;
    }

    if (activityMap.has(key)) {
      const existing = activityMap.get(key)!;
      existing.count += count;
      if (event.repo?.name) {
        existing.details = existing.details || [];
        if (!existing.details.includes(event.repo.name)) {
          existing.details.push(event.repo.name);
        }
      }
    } else {
      activityMap.set(key, {
        date,
        count,
        type,
        details: event.repo?.name ? [event.repo.name] : undefined
      });
    }
  });

  return Array.from(activityMap.values()).sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Calculates streak statistics from activities
 */
function calculateStreaks(activities: GitHubActivity[]): { current: number; longest: number } {
  if (activities.length === 0) return { current: 0, longest: 0 };

  // Create a set of dates with activity
  const activeDates = new Set(activities.map(a => a.date));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(today);

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (activeDates.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Check if yesterday had activity (allow 1 day gap for today not being over)
      if (currentStreak === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = checkDate.toISOString().split('T')[0];
        if (activeDates.has(yesterdayStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
      }
      break;
    }
  }

  // Calculate longest streak (simple approach for recent data)
  let longestStreak = 0;
  let tempStreak = 0;
  const sortedDates = Array.from(activeDates).sort();

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { current: currentStreak, longest: longestStreak };
}

/**
 * Calculates streak statistics from GraphQL contribution map (1 year of data)
 */
function calculateStreaksFromMap(contributionMap: Map<string, number>): { current: number; longest: number } {
  if (contributionMap.size === 0) return { current: 0, longest: 0 };

  // Create a set of dates with activity (count > 0)
  const activeDates = new Set<string>();
  contributionMap.forEach((count, date) => {
    if (count > 0) {
      activeDates.add(date);
    }
  });

  if (activeDates.size === 0) return { current: 0, longest: 0 };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(today);

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (activeDates.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Check if yesterday had activity (allow 1 day gap for today not being over)
      if (currentStreak === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = checkDate.toISOString().split('T')[0];
        if (activeDates.has(yesterdayStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
      }
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  const sortedDates = Array.from(activeDates).sort();

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { current: currentStreak, longest: longestStreak };
}

/**
 * Main function to fetch and process GitHub stats
 */
export async function fetchGitHubStats(username: string = GITHUB_USERNAME): Promise<GitHubStats> {
  const events = await fetchAllEvents(username);
  const activities = processEventsToActivities(events);

  // Calculate stats
  const totalCommits = activities
    .filter(a => a.type === 'commit')
    .reduce((sum, a) => sum + a.count, 0);

  const totalPRs = activities
    .filter(a => a.type === 'pr')
    .reduce((sum, a) => sum + a.count, 0);

  const totalIssues = activities
    .filter(a => a.type === 'issue')
    .reduce((sum, a) => sum + a.count, 0);

  const totalRepos = activities
    .filter(a => a.type === 'repo')
    .reduce((sum, a) => sum + a.count, 0);

  const totalContributions = totalCommits + totalPRs + totalIssues + totalRepos;

  const uniqueDays = new Set(activities.map(a => a.date));
  const activeDays = uniqueDays.size;

  const streaks = calculateStreaks(activities);

  return {
    totalContributions,
    totalCommits,
    totalPRs,
    totalIssues,
    totalRepos,
    activeDays,
    currentStreak: streaks.current,
    longestStreak: streaks.longest,
    recentActivity: activities
  };
}

/**
 * Generates activity data for the contribution graph (last 365 days)
 * Merges real GitHub data with empty days
 *
 * If graphQLData is provided, it takes priority over activities (more complete data)
 */
export function generateContributionData(
  activities: GitHubActivity[],
  graphQLData?: Map<string, number> | null
): Map<string, number> {
  const contributionMap = new Map<string, number>();

  // Initialize all days in the last year with 0
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    contributionMap.set(dateStr, 0);
  }

  // If GraphQL data is available, use it (1 year of complete data)
  if (graphQLData && graphQLData.size > 0) {
    graphQLData.forEach((count, date) => {
      contributionMap.set(date, count);
    });
    return contributionMap;
  }

  // Otherwise, fill in from activities (fallback to Events API - last 90 days)
  activities.forEach(activity => {
    const existing = contributionMap.get(activity.date) || 0;
    contributionMap.set(activity.date, existing + activity.count);
  });

  return contributionMap;
}

/**
 * Enhanced stats fetcher with cached contribution data
 * Tries cached data first (1 year from build-time), falls back to Events API (90 days)
 */
export async function fetchGitHubStatsWithContributions(
  username: string = GITHUB_USERNAME
): Promise<{ stats: GitHubStats; contributionMap: Map<string, number> | null }> {
  // Try cached contributions first (from build-time GraphQL fetch)
  const cachedData = await fetchCachedContributions();

  // Fetch events for detailed stats (commits, PRs, etc.)
  const eventsStats = await fetchGitHubStats(username);

  // If we have GraphQL data, use it for more accurate yearly stats
  if (cachedData && cachedData.size > 0) {
    // Calculate total contributions from GraphQL data
    let totalContributions = 0;
    cachedData.forEach(count => {
      totalContributions += count;
    });

    // Calculate active days (days with count > 0)
    let activeDays = 0;
    cachedData.forEach(count => {
      if (count > 0) activeDays++;
    });

    // Calculate streaks from full year of data
    const streaks = calculateStreaksFromMap(cachedData);

    // Calculate average daily contributions (excluding zero days)
    const avgDaily = activeDays > 0 ? Math.round((totalContributions / activeDays) * 10) / 10 : 0;

    // Merge GraphQL stats with Events API detailed breakdown
    const enhancedStats: GitHubStats = {
      ...eventsStats,
      totalContributions, // Use GraphQL total (1 year)
      activeDays, // Use GraphQL active days (1 year)
      currentStreak: streaks.current, // Use GraphQL streak (1 year)
      longestStreak: streaks.longest, // Use GraphQL longest streak (1 year)
      // Keep Events API detailed breakdown (commits, PRs, issues from last 90 days)
    };

    console.log(`✅ Using 1-year GraphQL stats: ${totalContributions} contributions, ${activeDays} active days`);

    return {
      stats: enhancedStats,
      contributionMap: cachedData,
    };
  }

  // Fallback to Events API only (90 days)
  console.warn('⚠️  Using Events API fallback (90 days only)');
  return {
    stats: eventsStats,
    contributionMap: cachedData,
  };
}
