CREATE DATABASE todolists;

USE todolists;

CREATE TABLE users (
	id int(11) not null auto_increment,
    email varchar(50) not null,
    password varchar(60) not null,
    name_first varchar(30) not null,
    name_last varchar(30) not null,
	primary key(id)
    );
    
CREATE TABLE tasks(
    id int (11) not null auto_increment,
    task_title varchar (150) not null,
    user_id int(11),
    folder_id int(11),
    task_done TINYINT(1) NULL DEFAULT 0,
    created_at timestamp not null default current_timestamp,
    primary key(id)
    );

CREATE TABLE folders(
    id int (11) not null auto_increment,
    folder_name varchar (150) not null,
    user_id int(11),
    created_at timestamp not null default current_timestamp,
    primary key(id)
    );		
