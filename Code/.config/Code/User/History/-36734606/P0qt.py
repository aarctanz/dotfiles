import csv
import os

def split_csv_into_parts(file_path, output_prefix, parts=10):
    # Count total lines (excluding header)
    with open(file_path, 'r', encoding='utf-8') as f:
        total_lines = sum(1 for line in f) - 1  # exclude header

    lines_per_file = total_lines // parts
    extra_lines = total_lines % parts  # to distribute remainder

    with open(file_path, 'r', encoding='utf-8') as infile:
        reader = csv.reader(infile)
        header = next(reader)

        for i in range(parts):
            part_filename = f"{output_prefix}_part_{i+1}.csv"
            with open(part_filename, 'w', newline='', encoding='utf-8') as outfile:
                writer = csv.writer(outfile)
                writer.writerow(header)

                lines_to_write = lines_per_file + (1 if i < extra_lines else 0)
                for _ in range(lines_to_write):
                    try:
                        writer.writerow(next(reader))
                    except StopIteration:
                        break

    print(f"✅ Done! Split into {parts} parts.")

# Example usage
split_csv_into_parts("your_large_file.csv", "output", parts=10)
