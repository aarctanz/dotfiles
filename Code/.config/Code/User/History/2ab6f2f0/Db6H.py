import matplotlib.pyplot as plt
import re

# Read the file
with open('actstt.txt', 'r') as f:
    content = f.read()
lines = content.split('\n')

# Utility function to parse tables
def parse_table(start_marker, columns, end_marker='rows)'):
    data = []
    capture = False
    header_found = False
    separator_passed = False
    
    for line in lines:
        if start_marker in line:
            capture = True
            continue
        if capture:
            if end_marker in line:
                break
            if not header_found and all(col in line for col in columns):
                header_found = True
                continue
            if header_found and re.match(r'^-+\+', line):
                separator_passed = True
                continue
            if separator_passed and '|' in line:
                parts = [x.strip() for x in line.split('|')]
                # Convert numeric values
                row = []
                for p in parts:
                    p_clean = p.replace(',', '')
                    if p_clean.isdigit():
                        row.append(int(p_clean))
                    elif re.match(r'^\d+\.?\d*$', p_clean):
                        row.append(float(p_clean))
                    else:
                        row.append(p_clean)
                data.append(row)
    return data

# ----------------------------
# 1. Top 20 Acts by Case Volume
# ----------------------------
data_top_acts = parse_table(
    start_marker='Top 20 acts with most number of cases',
    columns=['act_s', 'no_of_cases']
)
acts = [row[0] for row in data_top_acts]
cases = [row[1] for row in data_top_acts]

plt.figure(figsize=(12, 8))
plt.barh(acts[::-1], cases[::-1], color='skyblue')  # Reverse for descending order
plt.title('Top 20 Acts by Case Volume')
plt.xlabel('Number of Cases (in tens of millions)')
plt.tight_layout()
plt.show()

# --------------------------------------
# 2. Average Disposition Days (Top/Bottom)
# --------------------------------------
data_slow = parse_table(
    start_marker='Top 20 acts with most average days in disposition',
    columns=['act_s', 'avg_disposal_days', 'total_cases']
)
data_fast = parse_table(
    start_marker='Top 20 acts with lowest average days in disposition',
    columns=['act_s', 'avg_disposal_days', 'total_cases']
)

# Extract top 5 slow and fast
slow_acts = [row[0] for row in data_slow[:5]]
slow_days = [row[1] for row in data_slow[:5]]
fast_acts = [row[0] for row in data_fast[:5]]
fast_days = [row[1] for row in data_fast[:5]]

plt.figure(figsize=(12, 6))
plt.bar(slow_acts + fast_acts, slow_days + fast_days, color=['red']*5 + ['green']*5)
plt.xticks(rotation=90)
plt.title('Longest vs Shortest Average Disposition Days (Top 5 Each)')
plt.ylabel('Days')
plt.tight_layout()
plt.show()

# -----------------------------
# 3. Bailable vs Non-Bailable
# -----------------------------
data_bailable = parse_table(
    start_marker='Bailable and non bailable cases average disposition day',
    columns=['bailable_ipc', 'avg_disposal_days', 'total_cases']
)
labels = [row[0] for row in data_bailable]
days = [row[1] for row in data_bailable]
sizes = [row[2] for row in data_bailable]

plt.figure(figsize=(8, 8))
plt.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=['lightblue', 'salmon'])
plt.title('Bailable vs Non-Bailable Case Distribution')
plt.show()

# ----------------------------
# 4. State-Wise Dominant Acts
# ----------------------------
data_state = parse_table(
    start_marker='State wise act with most cases',
    columns=['state_name', 'act_s', 'no_of_cases']
)
states = [row[0] for row in data_state]
state_cases = [row[2] for row in data_state]

plt.figure(figsize=(12, 8))
plt.barh(states, state_cases, color='teal')
plt.title('State-Wise Dominant Acts by Case Volume')
plt.xlabel('Number of Cases')
plt.tight_layout()
plt.show()

# ----------------------
# 5. Yearly Trends
# ----------------------
data_yearly = parse_table(
    start_marker='Yearwise trends of these three acts.',
    columns=['year', 'act_s', 'case_count']
)

# Organize data for plotting
years = sorted(list(set(row[0] for row in data_yearly)))
acts_trend = {}
for row in data_yearly:
    act = row[1]
    year = row[0]
    count = row[2]
    if act not in acts_trend:
        acts_trend[act] = {}
    acts_trend[act][year] = count

plt.figure(figsize=(12, 6))
for act, trend in acts_trend.items():
    counts = [trend.get(year, 0) for year in years]
    plt.plot(years, counts, marker='o', label=act)

plt.title('Yearly Trends of Selected Acts')
plt.xlabel('Year')
plt.ylabel('Case Count')
plt.legend()
plt.grid(True)
plt.show()