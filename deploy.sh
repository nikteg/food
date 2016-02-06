#!/usr/bin/env bash

pid=`cat app.pid`

# Kill previous process
if [ -e /proc/$pid -a /proc/$pid/exe ]; then
  kill $pid
fi

git checkout -f "$1"

npm start & echo $! > app.pid