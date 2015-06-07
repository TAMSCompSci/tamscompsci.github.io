#!/bin/sh

echo "Generating HTML..."
pandoc -f markdown -t html aditya_tmp.md > aditya_tmp.html
echo "Done."
