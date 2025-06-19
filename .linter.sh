#!/bin/bash
cd /home/kavia/workspace/code-generation/neuroverse-immersive-alternate-realities-63935-f2909da9/neuroverse_immersive_realities
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

