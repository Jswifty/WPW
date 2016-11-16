CREATE TABLE IF NOT EXISTS invoice (
  id INT NOT NULL AUTO_INCREMENT,
  invoice_no VARCHAR(40) NOT NULL,
  debtor_code VARCHAR(40) NOT NULL,
  date DATE NOT NULL,
  product_type VARCHAR(40) NOT NULL,
  gross_amt DECIMAL(17, 2) DEFAULT 0.00,
  invoice_amt DECIMAL(17, 2) DEFAULT 0.00,
  discount DECIMAL(5, 2) DEFAULT 0.00,
  maturity_date DATE NOT NULL,
  description TEXT,
  dr_cr_amt DECIMAL(17, 2) DEFAULT 0.00,
  prepaid_amt DECIMAL(17, 2) DEFAULT 0.00,
  invoice_balance DECIMAL(17, 2) DEFAULT 0.00,
  pdc_due_date DATE,
  pdc_last_settled_amt DECIMAL(17, 2) DEFAULT 0.00,
  pdc_total_settled_amt DECIMAL(17, 2) DEFAULT 0.00,
  last_invoice_settled_amt DECIMAL(17, 2) DEFAULT 0.00,
  history TEXT,
  invoice_status VARCHAR(40) NOT NULL,
  PRIMARY KEY (id)
);