CREATE TABLE IF NOT EXISTS invoice (
  id INT NOT NULL AUTO_INCREMENT,
  invoice_no VARCHAR(40) NOT NULL,
  debtor_code VARCHAR(40) NOT NULL,
  invoice_date DATE NOT NULL,
  product_type,
  gross_amount,
  invoice_amount,
  discount,
  maturity_date,
  description,
  settlement_status,
  dr_cr_amount,
  prepaid_amount,
  invoice_balance,
  pdc_due_date,
  pdc_last_settled_amount,
  pdc_total_settled_amount,
  last_invoice_settled_amount,
  history,
  status
  PRIMARY KEY (id)
);
