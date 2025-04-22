SELECT COUNT(*) FROM walmart;

-- Find diffrent payment method, no of transaction and no of quantity sold,

SELECT DISTINCT payment_method from walmart;

SELECT payment_method,  COUNT(*) FROM walmart GROUP BY payment_method;

SELECT payment_method,  COUNT(*), sum(quantity) FROM walmart GROUP BY payment_method;

