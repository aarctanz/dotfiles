import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import psycopg2
 
# Connect to PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    database="justice_data",
    user="arctan",
    password="arcpg17"
)
 
# Fetch total filings per year
query_filed = """
SELECT year, COUNT(ddl_case_id) AS filed_cases
FROM cases_clean
GROUP BY year
ORDER BY year;
"""
df_filed = pd.read_sql_query(query_filed, conn)
 
# Fetch total disposals per year
query_disposed = """
SELECT EXTRACT(YEAR FROM date_of_decision) AS year, COUNT(ddl_case_id) AS disposed_cases
FROM cases_clean
WHERE date_of_decision IS NOT NULL
GROUP BY year
ORDER BY year;
"""
df_disposed = pd.read_sql_query(query_disposed, conn)
 
# Fetch average case duration per year
query_duration = """
SELECT year, AVG(date_of_decision - date_of_filing) AS avg_duration_days
FROM cases_clean
WHERE date_of_decision IS NOT NULL
GROUP BY year
ORDER BY year;
"""
df_duration = pd.read_sql_query(query_duration, conn)

