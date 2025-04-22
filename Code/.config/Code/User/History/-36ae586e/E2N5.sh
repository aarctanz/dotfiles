for file in *.csv; do
  sed -i 's/\bNULL\b//g' "$file"
done