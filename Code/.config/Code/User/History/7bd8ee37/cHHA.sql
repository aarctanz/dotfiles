ALTER TABLE state_key
ADD PRIMARY KEY (year, state_code);

ALTER TABLE dist_key
ADD PRIMARY KEY (year, state_code, dist_code);

ALTER TABLE court_key
ADD PRIMARY KEY (year, state_code, court_no);

ALTER TABLE cases_clean
ADD PRIMARY KEY (ddl_case_id);

ALTER TABLE judges_clean
ADD PRIMARY KEY (ddl_judges_id);

ALTER TABLE act_key
ADD PRIMARY KEY (act);

ALTER TABLE section_key
ADD PRIMARY KEY (section);

ALTER TABLE disp_name
ADD PRIMARY KEY (disp_name);

ALTER TABLE purpose_name
ADD PRIMARY KEY (purpose_name);

ALTER TABLE type_name
ADD PRIMARY KEY (type_name);
