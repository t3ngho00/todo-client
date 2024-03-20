drop database if exits todo;
create database todo;
use todo;

create table task (
    id SERIAL primary key,
    description varchar(255) not null
);

insert into task (description) value ('My test task');
insert into task (description) value ('My another task');
