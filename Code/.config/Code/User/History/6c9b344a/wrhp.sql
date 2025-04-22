ALTER TABLE cases_clean ADD COLUMN adv_defendant_gender INT;
ALTER TABLE cases_clean ADD COLUMN adv_petitioner_gender INT;

-- Map values and handle NULLs
UPDATE cases_clean
SET defendant_gender = CASE 
  WHEN female_defendant = '0 male' THEN 0
  WHEN female_defendant = '1 female' THEN 1
  ELSE NULL  -- Handles -9998, -9999, and other invalid values
END;

UPDATE cases_clean
SET petitioner_gender = CASE 
  WHEN female_petitioner = '0 male' THEN 0
  WHEN female_petitioner = '1 female' THEN 1
  ELSE NULL  -- Handles -9998, -9999, and other invalid values
END;

-- Drop the old column and rename the new one (optional)
ALTER TABLE cases_clean 
DROP COLUMN female_defendant,
RENAME COLUMN defendant_gender TO female_defendant;
