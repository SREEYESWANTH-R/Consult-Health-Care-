use db;
CREATE TABLE signup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT FALSE
);
select * from signup;

CREATE TABLE profile (
    user_id INT PRIMARY KEY,
    mobile VARCHAR(15),
    address VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES signup(id) ON DELETE CASCADE
);
SELECT * From profile;

CREATE TABLE adminLog(
	id INT AUTO_INCREMENT PRIMARY KEY,
    adminname VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL
);

INSERT INTO adminLog (adminname, Password) VALUES
('Admin','Admin@123');

SELECT * FROM adminLog;


CREATE TABLE appointment (
	id INT auto_increment Primary Key,
    name VARCHAR(100) NOT NULL,
    doctor VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender CHAR(1) NOT NULL,
    mobNum VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);
SELECT * FROM appointment;

CREATE TABLE doctor(
	id INT auto_increment Primary Key,
    name VARCHAR(100) NOT NULL,
    gender CHAR(7) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    expertise VARCHAR(100) NOT NULL,
    image BLOB
);
SELECT * FROM doctor;

CREATE TABLE Drugs (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    generic VARCHAR(255),
    dosage_form VARCHAR(255),
    strength VARCHAR(255),
    route VARCHAR(255),
    description TEXT,
    cost DECIMAL(10, 2) NOT NULL
);

select * From Drugs;

CREATE Table Cart(
	 prescription_id INT AUTO_INCREMENT PRIMARY KEY,
     drug_id VARCHAR(10) NOT NULL,
     quantity INT NOT NULL,
	 cost DECIMAL(10, 2) NOT NULL,
     FOREIGN KEY (apppoinment_id) references appointment(id) ON DELETE cascade,
     FOREIGN KEY (drug_id) references Drugs(id) ON delete cascade
);
select * from Cart;
