for file in *.csv; do
  echo "$file"
  sed -i 's/\bNULL\b//g' "$file"
done