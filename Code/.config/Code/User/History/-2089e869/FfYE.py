arr = [2010,2011, 2012,2013,2014,2015,2016,2017,2018]

with open("copy.sql", "w") as file:
    for i in arr:
        for j in range(1,10):
            file.write(f"--\COPY cases_clean FROM '/home/arctan/data/justice_data/cases_parts/cases_{i}_part_{j}.csv' WITH (FORMAT CSV, HEADER true, NULL '');\n")
    