#!/bin/sh
set -x
git push heroku main
heroku open
