CREATE USER 'lucasaguero_ensolvers'@'localhost' IDENTIFIED BY 'ensolvers1308';

GRANT ALL PRIVILEGES ON todolists_lucasaguero.* TO 'lucasaguero_ensolvers'@'localhost';

FLUSH PRIVILEGES;
