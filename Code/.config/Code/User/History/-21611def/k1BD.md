
## Average duration when Petitioner, lawer,and judge are female
```sql
avg_duration_days
-------------------
               236
(1 row)
```
```sql
SELECT
  ROUND(AVG(cc.date_of_decision - cc.date_of_filing)) AS avg_duration_days
FROM
  cases_clean cc
JOIN
  judge_case judge_case ON cc.ddl_case_id = judge_case.ddl_case_id
JOIN
  judges_clean jc ON judge_case.ddl_filing_judge_id = jc.ddl_judge_id
WHERE
  cc.female_adv_pet = '1'
  AND cc.female_petitioner = '1 female' AND jc.female_judge='1 female'
  AND cc.date_of_decision IS NOT NULL
  AND cc.date_of_filing IS NOT NULL
GROUP BY
  jc.female_judge;
```
 ## when defendant is not female
```sql avg_duration_days
-------------------
               314
(1 row)
```

```sql
 SELECT
  ROUND(AVG(cc.date_of_decision - cc.date_of_filing)) AS avg_duration_days
FROM
  cases_clean cc
JOIN
  judge_case judge_case ON cc.ddl_case_id = judge_case.ddl_case_id
JOIN
  judges_clean jc ON judge_case.ddl_filing_judge_id = jc.ddl_judge_id
WHERE
  cc.female_adv_pet = '1'
  AND cc.female_petitioner = '1 female' AND jc.female_judge='1 female' AND cc.female_defendant = '0 male'
  AND cc.date_of_decision IS NOT NULL
  AND cc.date_of_filing IS NOT NULL
GROUP BY
  jc.female_judge;
  ```
