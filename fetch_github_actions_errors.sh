#!/usr/bin/env bash
# Fetch the latest GitHub Actions run log for the current repository and extract errors
# Requirements: curl, jq, and a GitHub personal access token with repo access


# Set these variables
GITHUB_OWNER="ASISaga"
GITHUB_REPO="businessinfinity.asisaga.com"
GITHUB_TOKEN="${GITHUB_TOKEN}"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: Please set the GITHUB_TOKEN environment variable with repo access."
  exit 1
fi

# If a job ID is provided as an argument, fetch only that job's log
if [ -n "$1" ]; then
  JOB_ID="$1"
  echo "Fetching log for specific job ID: $JOB_ID..."
  curl -s -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -L "https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/actions/jobs/$JOB_ID/logs" \
    -o job-${JOB_ID}-logs.txt
  echo "Searching for errors in job-${JOB_ID}-logs.txt..."
  MATCHES=$(grep -Ei "error|undefined variable|conversion error|encountered an error|exception|failed|pages-build-development/build" job-${JOB_ID}-logs.txt)
  if [ -n "$MATCHES" ]; then
    echo "--- Errors found in job ID $JOB_ID ---"
    echo "$MATCHES"
  else
    echo "No errors found in job log for job ID $JOB_ID."
  fi
  exit 0
fi

# Get the latest workflow run ID
echo "Fetching latest workflow run..."
RUN_ID=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/actions/runs?per_page=1" | jq -r '.workflow_runs[0].id')

if [ "$RUN_ID" = "null" ] || [ -z "$RUN_ID" ]; then
  echo "No workflow runs found."
  exit 1
fi

echo "Latest run ID: $RUN_ID"

# Get all job IDs for the latest run
echo "Fetching all job IDs for the latest run..."
JOB_IDS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/actions/runs/$RUN_ID/jobs" | jq -r '.jobs[].id')

if [ -z "$JOB_IDS" ]; then
  echo "No jobs found for the latest run."
  exit 1
fi

ERROR_FOUND=0
> last_build_log.txt
for JOB_ID in $JOB_IDS; do
  echo "Downloading log for job ID: $JOB_ID..."
  curl -s -H "Authorization: token $GITHUB_TOKEN" \
    -L "https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/actions/jobs/$JOB_ID/logs" -o job_${JOB_ID}_log.txt
  echo "Searching for errors in job_${JOB_ID}_log.txt..."
  MATCHES=$(grep -Ei "error|undefined variable|conversion error|encountered an error|exception|failed|pages-build-development/build" job_${JOB_ID}_log.txt)
  if [ -n "$MATCHES" ]; then
    echo "--- Errors found in job ID $JOB_ID ---" | tee -a last_build_log.txt
    echo "$MATCHES" | tee -a last_build_log.txt
    ERROR_FOUND=1
  fi
done

if [ $ERROR_FOUND -eq 0 ]; then
  echo "No errors found in any job logs for the last build."
fi
