
-- 1.Insert data into Role table
INSERT INTO SchoolHealth.dbo.[Role] (Name)
VALUES 
    ('Admin'),
    ('Nurse'),
    ('Parent');
select * from SchoolHealth.dbo.[Role]

-- 2.Insert data into Users table
INSERT INTO SchoolHealth.dbo.Users (Name, Email, Password, Address, Phone, Gender, DateOfBirth, RoleId)
VALUES 
    ('John Admin', 'john.admin@schoolhealth.com', 'hashed_password_1', '123 Admin St', '555-0101', 'Male', '1980-01-15', 1),
    ('Jane Nurse', 'jane.nurse@schoolhealth.com', 'hashed_password_2', '456 Nurse Ave', '555-0102', 'Female', '1985-03-22', 2),
    ('Alice Parent', 'alice.parent@schoolhealth.com', 'hashed_password_3', '789 Parent Rd', '555-0103', 'Female', '1975-07-10', 3),
    ('Bob Parent', 'bob.parent@schoolhealth.com', 'hashed_password_4', '101 Parent Ln', '555-0104', 'Male', '1978-11-30', 3);
select * from SchoolHealth.dbo.Users

-- 3.Insert data into MedicalSupplys table
INSERT INTO SchoolHealth.dbo.MedicalSupplys (Name, Description, Quantity, LastRestoked)
VALUES 
    ('Bandages', 'Sterile adhesive bandages', 100, '2025-05-01 10:00:00'),
    ('Antiseptic Wipes', 'Alcohol-based cleaning wipes', 50, '2025-04-15 09:00:00'),
    ('Pain Relievers', 'Ibuprofen tablets 200mg', 200, '2025-05-10 12:00:00');
select * from SchoolHealth.dbo.MedicalSupplys

-- 4.Insert data into Students table
INSERT INTO SchoolHealth.dbo.Students (Name, ClassName, Gender, DateOfBirth, ParentId)
VALUES 
    ('Timmy Student', 'Grade 5A', 'Male', '2015-06-12', 3),
    ('Sarah Student', 'Grade 6B', 'Female', '2014-08-20', 4);
select * from SchoolHealth.dbo.Students

-- 5.Insert data into StudentProfiles table
INSERT INTO SchoolHealth.dbo.StudentProfiles (Id, Allergys, ChronicIllnesss, LongTermMedications, OtherMedicalConditions)
VALUES 
    (1, 'Peanuts', 'None', 'None', 'None'),
    (2, 'None', 'Asthma', 'Inhaler', 'None');
select * from SchoolHealth.dbo.StudentProfiles

-- 6.Insert data into BlogPosts table
INSERT INTO SchoolHealth.dbo.BlogPosts (Title, Content, Author, ImageUrl, CreatedAt, UserId)
VALUES 
    ('Health Tips for Kids', 'Tips for maintaining student health...', 'Jane Nurse', 'https://schoolhealth.com/images/tips.jpg', '2025-06-01 08:00:00', 2),
    ('School Safety', 'Ensuring a safe environment...', 'John Admin', 'https://schoolhealth.com/images/safety.jpg', '2025-06-01 09:00:00', 1);
select * from SchoolHealth.dbo.BlogPosts

-- 7.Insert data into Notifications table
INSERT INTO SchoolHealth.dbo.Notifications (Title, [Type], Message, Location, [Date], CreatedAt, CreatedById, AssignedToId, Note)
VALUES 
    ('Health Check Reminder', 'Reminder', 'Annual health check scheduled', 'School Clinic', '2025-06-10 10:00:00', '2025-06-01 07:00:00', 2, 3, 'Please confirm attendance'),
    ('Vaccine Update', 'Update', 'Flu vaccines available', 'School Clinic', '2025-06-15 09:00:00', '2025-06-01 08:30:00', 2, 4, 'Vaccine has updated sucessfully');
select * from SchoolHealth.dbo.Notifications

--Xóa dữ liệu từ bảng cũ sau đó đặt lại id bắt đầu từ 1 
DELETE FROM SchoolHealth.dbo.Notifications;
DBCC CHECKIDENT ('SchoolHealth.dbo.Notifications', RESEED, 0);
--Kết thúc nhiệm vụ

-- 8.Insert data into NotificationStudents table
INSERT INTO SchoolHealth.dbo.NotificationStudents (NotificationId, StudentId, Status, Reason)
VALUES 
    (1, 1, 'Pending', 'Awaiting confirmation'),
    (1, 2, 'Confirmed', NULL),
    (2, 1, 'Pending', 'Awaiting parent approval');
select * from SchoolHealth.dbo.NotificationStudents

-- 9.Insert data into Vaccinations table
INSERT INTO SchoolHealth.dbo.Vaccinations (VaccineName, [Result], [Date], Location, Description, StudentId, UserId)
VALUES 
    ('Flu Vaccine', 'Administered', '2025-05-15 10:00:00', 'School Clinic', 'Annual flu shot', 1, 2),
    ('MMR Vaccine', 'Administered', '2025-05-20 11:00:00', 'School Clinic', 'Measles, Mumps, Rubella vaccine', 2, 2);
select * from Vaccinations

-- 10.Insert data into HealthChecks table
INSERT INTO SchoolHealth.dbo.HealthChecks (Height, Weight, VisionLeft, VisionRight, Bmi, BloodPressure, HeartRate, Location, Description, Conclusion, [Date], StudentId, UserId)
VALUES 
    (150.5, 40.2, 1.0, 1.0, 17.8, '120/80', '72', 'School Clinic', 'Annual health check', 'Healthy', '2025-05-10 09:00:00', 1, 2),
    (145.0, 38.5, 0.9, 0.9, 18.3, '118/78', '70', 'School Clinic', 'Annual health check', 'Healthy', '2025-05-10 09:30:00', 2, 2);
select * from SchoolHealth.dbo.HealthChecks

-- 11.Insert data into MedicalEvents table
INSERT INTO SchoolHealth.dbo.MedicalEvents (EventType, Description, [Date], Status, StudentId, UserId)
VALUES 
    ('Injury', 'Minor cut on knee', '2025-05-20 14:00:00', 'Treated', 1, 2),
    ('Allergic Reaction', 'Mild allergic reaction to food', '2025-05-22 10:00:00', 'Resolved', 2, 2);
select * from SchoolHealth.dbo.MedicalEvents
--Xóa dữ liệu từ bảng cũ sau đó đặt lại id bắt đầu từ 1 
DELETE FROM SchoolHealth.dbo.MedicalEvents;
DBCC CHECKIDENT ('SchoolHealth.dbo.MedicalEvents', RESEED, 0);
--Kết thúc nhiệm vụ

-- 12.Insert data into MedicalEventSupplys table
INSERT INTO SchoolHealth.dbo.MedicalEventSupplys (MedicalEventId, MedicalSupplyId, Quantity)
VALUES 
    (1, 1, 2),
    (1, 2, 1),
    (2, 2, 1);
select * from SchoolHealth.dbo.MedicalEventSupplys

-- 13.Insert data into Medications table
INSERT INTO SchoolHealth.dbo.Medications (Name, Dosage, Status, UserId, StudentId, Note)
VALUES 
    ('Inhaler', '1 puff as needed', 'Active', 2, 2, 'For asthma management'),
    ('Antihistamine', '10mg daily', 'Active', 2, 1, 'For seasonal allergies');

--Thêm cột Note vào bảng do thiếu
alter table SchoolHealth.dbo.Medications 
add Note nvarchar(MAX) null
--Kết thúc việc thêm 
select * from SchoolHealth.dbo.Medications

-- 14.Insert data into __EFMigrationsHistory table
INSERT INTO SchoolHealth.dbo.[__EFMigrationsHistory] (MigrationId, ProductVersion)
VALUES 
    ('20250601000000_InitialCreate', '8.0.0');
select * from SchoolHealth.dbo.[__EFMigrationsHistory]
