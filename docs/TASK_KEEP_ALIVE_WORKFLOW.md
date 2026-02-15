# Future Task: Implement "Keep-Alive" Workflow for GitHub Actions

**Priority:** Medium (Critical before day 50 of inactivity)
**Context:** GitHub disables scheduled workflows (cron jobs) after 60 days of repository inactivity. Since our portfolio updates rely on a scheduled fetch for GitHub contribution data, we need a mechanism to prevent this timeout.

## Problem
- The `deploy.yml` workflow runs on a schedule (`cron: '5 0,12 * * *'`).
- GitHub's inactivity policy disables cron triggers if no commits happen to the repo for 60 days.
- Result: The portfolio will stop updating automatically.

## Proposed Solution: The "Keep-Alive" Workflow

Create a GitHub Action that runs once a month and performs a "dummy" commit or activity to reset the inactivity timer.

### Implementation Details

**File:** `.github/workflows/keep-alive.yml`

```yaml
name: Keep Workflows Alive
on:
  schedule:
    - cron: '0 0 1 * *' # Run monthly
  workflow_dispatch:

permissions:
  contents: write

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Dummy Commit
        run: |
          git config --global user.name "GitHub Actions Bot"
          git config --global user.email "actions@github.com"
          git commit --allow-empty -m "Keep alive [skip ci]"
          git push
```

### Alternative Approach (Less intrusive)
Instead of pushing to `main`, push to a dedicated `keep-alive` branch.

1. Create a `keep-alive` branch.
2. Configure the workflow to checkout and push only to that branch.
3. GitHub counts activity on *any* branch as repository activity.

### Action Items
- [ ] Create `.github/workflows/keep-alive.yml`
- [ ] Test with `workflow_dispatch` to ensure permissions are correct
- [ ] verify that the "Last activity" timestamp on the repo updates

