ALTER TABLE cases_clean ADD COLUMN adv_defendant_gender INT;
ALTER TABLE cases_clean ADD COLUMN adv_petitioner_gender INT;

-- Map values and handle NULLs
UPDATE cases_clean
SET adv_defendant_gender = CASE 
  WHEN female_adv_pet = '0' THEN 0
  WHEN female_adv_pet = '1' THEN 1
  ELSE NULL  -- Handles -9998, -9999, and other invalid values
END;

UPDATE cases_clean
SET adv_petitioner_gender = CASE 
  WHEN female_adv_pet = '0' THEN 0
  WHEN female_adv_pet = '1' THEN 1
  ELSE NULL  -- Handles -9998, -9999, and other invalid values
END;

-- Drop the old column and rename the new one (optional)
ALTER TABLE cases_clean 
DROP COLUMN female_adv_def,
RENAME COLUMN adv_defendant_gender TO female_adv_def;

ALTER TABLE cases_clean 
DROP COLUMN female_adv_pet,
RENAME COLUMN adv_petitioner_gender TO female_adv_pet;
