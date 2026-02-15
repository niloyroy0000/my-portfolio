/**
 * Build-time GitHub Data Fetcher
 *
 * Fetches 1 year of GitHub contribution data using GraphQL API
 * and saves it to a static JSON file for the static export.
 *
 * Usage: node scripts/fetch-github-data.js
 * Environment: Requires GITHUB_TOKEN in environment or .env.local file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local if it exists
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = 'biswajitpanday';
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'data', 'github-contributions.json');

async function fetchContributionsGraphQL() {
  if (!GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN not found. Skipping GitHub data fetch.');
    console.warn('   The site will fall back to the Events API (last 90 days only).');
    return null;
  }

  try {
    // Calculate date range (last 365 days)
    const to = new Date().toISOString();
    const from = new Date();
    from.setFullYear(from.getFullYear() - 1);
    const fromStr = from.toISOString();

    console.log('📊 Fetching GitHub contribution data...');
    console.log(`   Username: ${GITHUB_USERNAME}`);
    console.log(`   Date range: ${fromStr.split('T')[0]} to ${to.split('T')[0]}`);

    // GraphQL query for contribution data
    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    // Make GraphQL request
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          username: GITHUB_USERNAME,
          from: fromStr,
          to: to,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ GitHub GraphQL API error:', response.status);
      console.error('   Details:', errorText);
      return null;
    }

    const result = await response.json();

    // Check for GraphQL errors
    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
      return null;
    }

    if (!result.data?.user) {
      console.error('❌ Invalid GraphQL response: missing user data');
      return null;
    }

    // Extract contribution data
    const contributionsCollection = result.data.user.contributionsCollection;
    const calendar = contributionsCollection.contributionCalendar;

    // Flatten weeks into a simple date → count map
    const contributionMap = {};
    calendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        contributionMap[day.date] = day.contributionCount;
      });
    });

    // Return structured data
    const data = {
      success: true,
      totalContributions: calendar.totalContributions,
      contributionMap,
      dateRange: {
        from: fromStr.split('T')[0],
        to: to.split('T')[0],
      },
      fetchedAt: new Date().toISOString(),
    };

    console.log(`✅ Fetched ${Object.keys(contributionMap).length} days of contribution data`);
    console.log(`   Total contributions: ${calendar.totalContributions}`);

    return data;

  } catch (error) {
    console.error('❌ Failed to fetch GitHub contributions:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting GitHub data fetch...\n');

  const data = await fetchContributionsGraphQL();

  if (!data) {
    console.log('\n⚠️  No GitHub data fetched. Site will use fallback (Events API).\n');
    process.exit(0); // Don't fail the build
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write data to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`\n✅ GitHub data saved to: ${OUTPUT_FILE}`);
  console.log('   Data will be available as /data/github-contributions.json\n');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(0); // Don't fail the build, just skip this step
});
