import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load the training dataset (adjust the file name/path as needed)
df = pd.read_csv('train_data.csv')

# Convert percentage columns (e.g., "77%") to numeric values
def convert_percent(x):
    try:
        if isinstance(x, str) and '%' in x:
            return float(x.replace('%', '').strip())
        return float(x)
    except:
        return np.nan

# Loop over columns and convert those with '%' in the first row's value
for col in df.columns:
    if isinstance(df[col].iloc[0], str) and '%' in df[col].iloc[0]:
        df[col] = df[col].apply(convert_percent)

# Display the first few rows to verify changes
print("First few rows of the dataset:")
print(df.head())

# Get summary statistics for numeric features
print("\nSummary statistics:")
print(df.describe())

# Check for missing values in each column
print("\nMissing values by column:")
print(df.isnull().sum())

# Visualize the distributions of numerical features
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
for col in numeric_cols:
    plt.figure(figsize=(8, 4))
    sns.histplot(df[col].dropna(), kde=True)
    plt.title(f'Distribution of {col}')
    plt.xlabel(col)
    plt.ylabel("Frequency")
    plt.show()

# Plot a correlation heatmap to see relationships (especially with the target 'Fat_Content')
plt.figure(figsize=(12, 10))
corr_matrix = df.corr()
sns.heatmap(corr_matrix, annot=True, fmt=".2f", cmap='coolwarm')
plt.title("Correlation Matrix")
plt.show()