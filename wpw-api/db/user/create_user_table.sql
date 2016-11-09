CREATE TABLE IF NOT EXISTS user (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  password VARCHAR(40) NOT NULL,
  authentication_token VARCHAR(40),
  privilege VARCHAR(20) NOT NULL,
  PRIMARY KEY (id)
);
