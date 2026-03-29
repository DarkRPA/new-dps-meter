#!/bin/bash
ELECTRON_BIN="./node_modules/electron/dist/electron"
export LD_LIBRARY_PATH="./node_modules/electron/dist:$LD_LIBRARY_PATH"
sudo capsh --caps="cap_net_raw+eip" --user=$(whoami) -- -c \
  "cd $(pwd) && $ELECTRON_BIN ."
