#!/bin/sh
# Checks the repository for upgrades and restarts the server if tests are passed.
if [ $(git rev-parse HEAD) = $(git ls-remote $(git rev-parse --abbrev-ref @{u} | \
sed 's/\// /g') | cut -f1) ]
then
  echo 'Up-to-date'
else
  echo 'Fetching'
  git pull
  npm install
  npm test
  npm run reload
fi