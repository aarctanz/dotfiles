-- COPY (
--   SELECT
--     c.ddl_case_id,
--     c.date_of_filing,
--     c.date_of_decision,
--     female_defendant,
--     female_petitioner,
--     jc.female_judge,
--     a.act_s,
--     s.section_s,
--     date_of_filing,
--     date_of_decision,
--     d.disp_name_s
--   FROM cases_clean c
--   JOIN disp_name d ON c.disp_name = d.disp_name AND c.year = d.year
--   JOIN type_name t ON c.type_name = t.type_name AND c.year = t.year
--   JOIN judge_case jc ON c.ddl_case_id = jc.ddl_case_id
--   JOIN judges_clean j ON j.ddl_judge_id = jc.ddl_filing_judge_id
--   JOIN acts_sections acsc ON c.ddl_case_id = a.ddl_case_id
--   JOIN act_key a ON a.act = acsc.act
--   JOIN section_key s ON s.section = acsc.section
--   WHERE data_of_decision IS NOT NULL 
--   AND acsc.section IS NOT NULL
--   AND t.type_name_s='criminal case'
--   AND jc.ddl_filing_judge_id=jc.ddl_decision_judge_id
--   LIMIT 5
-- ) TO '/home/arctan/data/justice_data/sample.csv' WITH CSV HEADER;

-- \COPY (
--   SELECT
--     c.ddl_case_id,
--     c.date_of_filing,
--     c.date_of_decision,
--     EXTRACT(YEAR FROM c.date_of_filing) AS filing_year,  -- Temporal control
--     c.state_code,  -- Regional control
--     c.court_no,

--     c.female_defendant,
--     c.female_petitioner,
--     j.female_judge,
--     a.act_s,
--     s.section_s,
--     d.disp_name_s
--     acsc.bailable_ipc,           -- Bailable offense (Y/N)
--     acsc.number_sections_ipc,    -- Severity proxy
--     d.disp_name_s AS disposition,
--   FROM cases_clean c
--   JOIN disp_name d ON c.disp_name = d.disp_name AND c.year = d.year
--   JOIN type_name t ON c.type_name = t.type_name AND c.year = t.year
--   JOIN judge_case jc ON c.ddl_case_id = jc.ddl_case_id
--   JOIN judges_clean j ON j.ddl_judge_id = jc.ddl_filing_judge_id
--   JOIN acts_sections acsc ON c.ddl_case_id = acsc.ddl_case_id
--   JOIN act_key a ON a.act = acsc.act
--   JOIN section_key s ON s.section = acsc.section
--   WHERE c.date_of_decision IS NOT NULL
--     AND acsc.section IS NOT NULL
--     AND t.type_name_s = 'criminal case'
--     AND jc.ddl_filing_judge_id = jc.ddl_decision_judge_id
--     AND ascs.bailable_ipc IN ('bailable', 'non-bailable')
--     AND acsc.number_sections_ipc IS NOT NULL
--     AND d.disp_name_s IN ('convicted', 'acquitted')
--   LIMIT 5
-- ) TO '/home/arctan/data/justice_data/sample.csv' WITH CSV HEADER;


\COPY (
  SELECT
    c.ddl_case_id,
    c.date_of_filing,
    c.date_of_decision,
    EXTRACT(YEAR FROM c.date_of_filing) AS filing_year,
    c.state_code,
    c.court_no,
    c.female_defendant,
    c.female_petitioner,
    j.female_judge,
    a.act_s,
    s.section_s,  
    acsc.bailable_ipc,
    acsc.number_sections_ipc,
    d.disp_name_s AS disposition
  FROM cases_clean c
  JOIN disp_name d ON c.disp_name = d.disp_name AND c.year = d.year
  JOIN type_name t ON c.type_name = t.type_name AND c.year = t.year
  JOIN judge_case jc ON c.ddl_case_id = jc.ddl_case_id
  JOIN judges_clean j ON j.ddl_judge_id = jc.ddl_filing_judge_id
  JOIN acts_sections acsc ON c.ddl_case_id = acsc.ddl_case_id
  JOIN act_key a ON a.act = acsc.act
  JOIN section_key s ON s.section = acsc.section
  WHERE 
    c.date_of_decision IS NOT NULL
    AND acsc.section IS NOT NULL
    AND t.type_name_s = 'criminal case'
    AND jc.ddl_filing_judge_id = jc.ddl_decision_judge_id
    AND acsc.bailable_ipc IN ('bailable', 'non-bailable') 
    AND acsc.number_sections_ipc IS NOT NULL
    AND d.disp_name_s IN ('convicted', 'acquitted')
  LIMIT 50  
) TO '/home/arctan/data/justice_data/sample.csv' WITH CSV HEADER;