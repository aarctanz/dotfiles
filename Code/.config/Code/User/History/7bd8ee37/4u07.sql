ALTER TABLE State
ADD PRIMARY KEY (year, state_code);

ALTER TABLE District
ADD PRIMARY KEY (year, state_code, dist_code);

ALTER TABLE Court
ADD PRIMARY KEY (year, state_code, court_no);

ALTER TABLE Cases ADD PRIMARY KEY (ddl_case_id);

ALTER TABLE Judges ADD PRIMARY KEY (ddl_judges_id);

ALTER TABLE Act ADD PRIMARY KEY (act);

ALTER TABLE Section ADD PRIMARY KEY (section);

ALTER TABLE Disposition ADD PRIMARY KEY (disp_name);

ALTER TABLE Purpose ADD PRIMARY KEY (purpose_name);

ALTER TABLE Type ADD PRIMARY KEY (type_name);

