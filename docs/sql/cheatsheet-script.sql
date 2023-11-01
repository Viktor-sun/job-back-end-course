DROP TABLE IF EXISTS boxes CASCADE;

DROP TABLE IF EXISTS cars CASCADE;

DROP TABLE IF EXISTS sellers CASCADE;

DROP TABLE IF EXISTS cars_sellers;

CREATE TABLE boxes 
(
box_id INTEGER PRIMARY KEY, 
box_name VARCHAR(100) NOT NULL, 
city TEXT NULL, 
number_of_cars INTEGER NULL
);

CREATE TABLE cars 
(
car_id INTEGER PRIMARY KEY, 
car_brand VARCHAR(100) NOT NULL, 
car_state TEXT NOT NULL, 
car_owner VARCHAR(50) NOT NULL
);

CREATE TABLE sellers 
(
seller_id INTEGER PRIMARY KEY, 
seller_name VARCHAR(100) NOT NULL, 
address TEXT NULL,
manager_id INTEGER,
FOREIGN KEY (manager_id) REFERENCES sellers (seller_id)
);

INSERT INTO
	boxes
VALUES	
(1, 'just box', 'Kharkiv', NULL),
(2, 'summer time', 'Ternopil', NULL),
(3, 'one love', 'Ibiza', NULL),
(4, 'best box', 'Ibiza', NULL);

INSERT INTO
	cars
VALUES	
(1, 'BMW', 'ready to go', 'Maria'),
(2, 'Mercedes-Benz', 'ready to go', 'Antonio'),
(3, 'Audi', 'in need of repair', 'Thomas'),
(4, 'Chevrolet', 'in need of repair', 'Christina'),
(5, 'Cadillac', 'in need of repair', 'Hanna'),
(6, 'Chevrolet', 'ready to go', 'Frédérique'),
(7, 'BMW', 'ready to go', 'Martín'),
(8, 'Mercedes-Benz', 'ready to go', 'Laurence'),
(9, 'Audi', 'in need of repair', 'Elizabeth'),
(10, 'BMW', 'in need of repair', 'Victoria'),
(11, 'BMW', 'in need of repair', 'Patricio'),
(12, 'Chevrolet', 'ready to go', 'Yang'),
(13, 'BMW', 'ready to go', 'Pedro'),
(14, 'Mercedes-Benz', 'ready to go', 'Sven'),
(15, 'Audi', 'in need of repair', 'Janine'),
(16, 'Mercedes-Benz', 'in need of repair', 'Ann'),
(17, 'Chevrolet', 'in need of repair', 'Roland'),
(18, 'Mercedes-Benz', 'ready to go', 'Salchichas');

INSERT INTO
	sellers
VALUES	
(1, 'Bob', 'Kharkiv', 3),
(2, 'Bill', 'kyiv', 3),
(3, 'Stephan', 'Odessa', NULL),
(4, 'John', 'Ibiza', 2),
(5, 'Eduard', 'Odessa', 2);

ALTER TABLE sellers
RENAME COLUMN address TO city;

-- add fk box_id column to cars table
ALTER TABLE cars
ADD COLUMN box_id INTEGER;

ALTER TABLE cars
ADD CONSTRAINT box_id 
FOREIGN KEY(box_id) REFERENCES boxes(box_id);

-- set value to box_id
UPDATE cars
SET
	box_id = 1
WHERE car_id <= 4;

UPDATE cars
SET
	box_id = 2
WHERE car_id > 4
AND car_id < 8;

UPDATE cars
SET
	box_id = 3
WHERE car_id BETWEEN 8 AND 12;

UPDATE cars
SET
	box_id = 4
WHERE car_id > 12;

-- set value to number_of_cars column in the boxes table
UPDATE boxes
SET
	number_of_cars = (
	SELECT COUNT(*)
FROM cars
WHERE box_id = 1)
WHERE box_id = 1;

UPDATE boxes
SET
	number_of_cars = (
	SELECT COUNT(*)
FROM cars
WHERE box_id = 2)
WHERE box_id = 2;

UPDATE boxes
SET
	number_of_cars = (
	SELECT COUNT(*)
FROM cars
WHERE box_id = 3)
WHERE box_id = 3;

UPDATE boxes
SET
	number_of_cars = (
	SELECT COUNT(*)
FROM cars
WHERE box_id = 4)
WHERE box_id = 4;

-- create table cars_sellers (many to many)
CREATE TABLE cars_sellers
(
car_id INTEGER REFERENCES cars(car_id), 
seller_id INTEGER REFERENCES sellers(seller_id), 
CONSTRAINT car_seller_id PRIMARY KEY (car_id, seller_id) -- composite key
);

INSERT INTO
	cars_sellers
VALUES 
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 3),
(11, 3),
(12, 3),
(13, 3),
(14, 3),
(15, 4),
(16, 4),
(17, 5),
(18, 5);

-- HW =========================================================================

SELECT MIN(number_of_cars) --max, avg
FROM boxes;

SELECT *
FROM cars
WHERE car_brand IN ('BMW', 'Audi');

-- ORDER BY
SELECT car_brand, COUNT(*) AS the_number_of_cars
FROM cars
WHERE car_state = 'ready to go'
GROUP BY	car_brand
ORDER BY COUNT(*) DESC;

SELECT car_brand, COUNT(*) AS the_number_of_cars
FROM cars
WHERE car_state = 'in need of repair'
GROUP BY	car_brand
HAVING	COUNT(*) > 1
ORDER BY	COUNT(*) ASC;

-- UNIONS
SELECT city
FROM boxes
UNION
SELECT city
FROM sellers;

SELECT city
FROM boxes
INTERSECT 
SELECT city
FROM sellers;

SELECT city
FROM boxes
EXCEPT  
SELECT city
FROM sellers;

-- JOINS
SELECT car_brand, car_owner, box_name, city
FROM cars
LEFT JOIN boxes ON cars.box_id = boxes.box_id 
WHERE boxes.box_id = 1;
--WHERE boxes.box_name  = 'just box';

SELECT car_brand, car_owner, box_name, city
FROM cars
LEFT JOIN boxes ON	cars.box_id = boxes.box_id
--WHERE  car_brand ILIKE  '%C%'
--WHERE  car_brand LIKE  '_u%'
WHERE car_brand LIKE 'M%';

-- LIMIT OFFSET
SELECT car_id, car_brand
FROM cars
LEFT JOIN boxes ON	cars.box_id = boxes.box_id
LIMIT  5 OFFSET  0;

SELECT car_id, car_brand
FROM cars
LEFT JOIN boxes ON	cars.box_id = boxes.box_id
LIMIT 5 OFFSET 5;

SELECT car_id, car_brand
FROM cars
LEFT JOIN boxes ON	cars.box_id = boxes.box_id
LIMIT 5 OFFSET 10;

SELECT car_id, car_brand
FROM cars
LEFT JOIN boxes ON	cars.box_id = boxes.box_id
LIMIT 5 OFFSET 15;

-- MULTIPLE JOINS
SELECT COUNT(cars_sellers.seller_id) AS  count_number_of_connected_entities_from_the_3rd_table
FROM cars 
LEFT JOIN boxes ON	cars.box_id = boxes.box_id
INNER JOIN cars_sellers ON cars.car_id  = cars_sellers.car_id;

-- which cars does a particular seller sell?
SELECT seller_name, car_brand
FROM cars 
LEFT JOIN cars_sellers ON	cars.car_id  = cars_sellers.car_id
INNER JOIN sellers ON cars_sellers.seller_id = sellers.seller_id 
WHERE sellers.seller_id = 1
ORDER BY car_brand DESC;

-- which sellers sell a specific car brand?
SELECT car_brand, seller_name
FROM cars 
LEFT JOIN cars_sellers ON	cars.car_id  = cars_sellers.car_id
INNER JOIN sellers ON cars_sellers.seller_id = sellers.seller_id 
WHERE cars.car_brand  = 'BMW';

-- how many cars does each seller sell?
SELECT seller_name, COUNT(*)
FROM cars 
LEFT JOIN cars_sellers ON	cars.car_id  = cars_sellers.car_id
INNER JOIN sellers ON cars_sellers.seller_id = sellers.seller_id
GROUP BY seller_name
ORDER BY COUNT(*) ASC;

-- just info
SELECT car_brand, car_owner, box_name, boxes.city, seller_name
FROM cars 
LEFT JOIN boxes ON	cars.box_id = boxes.box_id
INNER JOIN cars_sellers ON cars.car_id  = cars_sellers.car_id
INNER JOIN sellers ON cars_sellers.seller_id = sellers.seller_id;
--WHERE seller_name LIKE '%b';

-- USING
SELECT car_brand, car_owner, box_name, boxes.city, seller_name
FROM cars 
LEFT JOIN boxes USING(box_id) --ON	cars.box_id = boxes.box_id
INNER JOIN cars_sellers USING(car_id) --ON cars.car_id  = cars_sellers.car_id
INNER JOIN sellers USING(seller_id); --ON cars_sellers.seller_id = sellers.seller_id 

-- SELF JOIN
SELECT s.seller_name AS seller,
	     m.seller_name AS manager
FROM sellers s
LEFT JOIN sellers m ON m.seller_id = s.manager_id;

SELECT s.seller_name || ' ' || s.city AS seller,
	     m.seller_name || ' ' || m.city AS manager
FROM sellers s
LEFT JOIN sellers m ON m.seller_id = s.manager_id
ORDER BY manager;

