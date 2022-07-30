create table room(
	id bigint PRIMARY KEY NOT NULL IDENTITY,-- 編號 ( 1, 2, 3 ... )
	name nvarchar(255),
	createrId bigint, 
	player1Id bigint,
	player2Id bigint,
	start int,
	password bigint,
	nowPlayer varchar(10),
	circleId bigint
);

---

create table player(
	id bigint PRIMARY KEY NOT NULL IDENTITY,-- 編號 ( 1, 2, 3 ... )
	name nvarchar(255),
	introduce nvarchar(255), 
	level int,
	totalGame bigint,
	winGame bigint,
	account varchar(255),
	password varchar(255),
	token nvarchar(255)
);


---

create table circle(
	id bigint PRIMARY KEY NOT NULL IDENTITY,-- 編號 ( 1, 2, 3 ... )
	owner varchar(10),
	introduce nvarchar(255), 
	status varchar(255),
	hp varchar(25),
	temper varchar(255)
);

---

 create table chat(
	id bigint PRIMARY KEY NOT NULL IDENTITY,-- 編號 ( 1, 2, 3 ... )
	name nvarchar(255),
	chat nvarchar(255)

 );