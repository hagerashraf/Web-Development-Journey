CREATE TABLE Employee (
    Name VARCHAR(50) NOT NULL,
    ID INT NOT NULL UNIQUE ,
    Birth_Date DATE ,
    Speciality VARCHAR(50) NOT NULL,
    Contact_Info VARCHAR(11) ,
    User_Name VARCHAR(10) NOT NULL UNIQUE ,
    Password VARCHAR(15) NOT NULL,
    Salary INT ,
    PRIMARY KEY (ID)
);

CREATE TABLE Patient (
    Name VARCHAR(50) NOT NULL,
    P_ID INT NOT NULL UNIQUE ,
    Gender CHAR(1) NOT NULL,
    Age INT NOT NULL,
    Supervising_Doctor INT,
    Stays_At INT,
    PRIMARY KEY (P_ID)
);

CREATE TABLE Medical_Device(
    Device_Name VARCHAR(50) NOT NULL,
    Device_ID INT NOT NULL UNIQUE ,
    Last_Calibration_Date DATE ,
    Next_Calibration_Date DATE ,
    Responsible_Worker INT,
    PRIMARY KEY (Device_ID)
);

CREATE TABLE Tests(
    Test_Name VARCHAR(50) NOT NULL,
    Test_ID INT NOT NULL UNIQUE ,
    Test_Img VARCHAR(50),
    Test_Report VARCHAR(100),
    Expenses INT ,
    Done_date DATE ,
    Out_date DATE ,
    Done_By INT ,
    Done_To INT ,
    Referred_By INT ,
    PRIMARY KEY (Test_ID)
);

CREATE TABLE Department_Space(
    Space_ID INT NOT NULL UNIQUE ,
    Location VARCHAR(50) ,
    Staff_ID INT ,
    Medical_Supplies VARCHAR(250),
    Food VARCHAR(250),
    Other_Supplies VARCHAR(250),
    PRIMARY KEY (Space_ID)
    
);

CREATE TABLE Rooms (
    Room_ID INT NOT NULL UNIQUE ,
    Check_In DATE ,
    Check_out DATE ,
    Part_Of INT,
    Responsibility_Of INT,
    PRIMARY KEY (Room_ID)
);

ALTER TABLE Patient
    ADD FOREIGN KEY (Supervising_Doctor) REFERENCES Employee(ID),
    ADD FOREIGN KEY (Stays_At) REFERENCES Rooms(Room_ID);

ALTER TABLE Rooms
    ADD FOREIGN KEY (Part_Of) REFERENCES Department_Space(Space_ID),
    ADD FOREIGN KEY (Responsibility_Of) REFERENCES Employee(ID);

ALTER TABLE Medical_Device
       ADD FOREIGN KEY (Responsible_Worker) REFERENCES Employee(ID);

ALTER TABLE Tests
    ADD FOREIGN KEY (Done_By) REFERENCES Medical_Device(Device_ID),
    ADD FOREIGN KEY (Done_To) REFERENCES Patient(P_ID),
    ADD FOREIGN KEY (Referred_By) REFERENCES Employee(ID);

ALTER TABLE Department_Space
    ADD FOREIGN KEY (Staff_ID) REFERENCES Employee(ID);