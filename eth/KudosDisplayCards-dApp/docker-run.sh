#!/bin/bash
echo "Synchronizing source..."
rsync -avu "/code-currenct/" "/code/"  
echo "Building..."
npm run build:prod
