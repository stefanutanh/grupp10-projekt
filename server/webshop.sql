/* npx sequelize-cli db:create */
USE webshop;

-- Temporärt inaktivera foreign key constraints
SET FOREIGN_KEY_CHECKS = 0;

-- Ta bort tabeller i rätt ordning
DROP TABLE IF EXISTS cart_row;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Återaktivera foreign key constraints
SET FOREIGN_KEY_CHECKS = 1;

-- Skapa users-tabell
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  image_url VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skapa products-tabell
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url VARCHAR(255),
  user_id INT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Skapa ratings-tabell
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Skapa cart-tabell
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Skapa cart_row-tabell
CREATE TABLE cart_row (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  amount INT NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Lägg till användare
INSERT INTO users (username, email, first_name, last_name, image_url)
VALUES 
  ("user1", "maile@du.se", "Förnamn1", "Efternamn1", ""),
  ("user2", "maile@du.se", "Förnamn2", "Efternamn2", "");

-- Lägg till produkter
INSERT INTO products (title, description, price, image_url, user_id)
VALUES 
  ("Produkt1", "Beskrivning av produkt 1", 99.00, "https://example.com/image1.jpg", 1),
  ("Produkt2", "Beskrivning av produkt 2", 199.00, "https://example.com/image2.jpg", 2);

-- Lägg till varukorg för user1
INSERT INTO cart (user_id, completed)
VALUES (1, false);

-- Lägg till produkter i varukorgen
INSERT INTO cart_row (cart_id, product_id, amount)
VALUES 
  (1, 1, 2),
  (1, 2, 1);
