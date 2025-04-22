ALTER TABLE cases_clean ADD COLUMN judge_gender INT;

UPDATE cases_clean
SET judge_gender = CASE 
  WHEN female_judge = '0 nonfemale' THEN 0
  WHEN female_judge = '1 female' THEN 1
  ELSE NULL  -- Handles -9998, -9999, and other invalid values
END;