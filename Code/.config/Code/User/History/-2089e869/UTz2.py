arr = [2010,2011, 2012,2013,2014,2015,2016,2017,2018]

with open("copy.sql", "w") as file:
\COPY cases_clean FROM '/home/arctan/data/justice_data/cases_parts/cases_2010_part_10.csv' WITH (FORMAT CSV, HEADER true, NULL '');
    file.write("")