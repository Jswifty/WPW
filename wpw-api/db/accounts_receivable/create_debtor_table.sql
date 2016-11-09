CREATE TABLE IF NOT EXISTS debtor (
  id INT NOT NULL AUTO_INCREMENT,
  debtor_no VARCHAR(20) NOT NULL,
  debtor_name VARCHAR(40) NOT NULL,
  debtor_name_chinese VARCHAR(40) NOT NULL,
  credit_term INT NOT NULL,
  billing_address VARCHAR(40),
  factory_address VARCHAR(40),
  telephone VARCHAR(20),
  fax VARCHAR(20),
  contact_name VARCHAR(20),
  company_profile VARCHAR(40),
  email VARCHAR(40),
  PRIMARY KEY (id)
);
