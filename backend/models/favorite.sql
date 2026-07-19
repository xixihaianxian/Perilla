use perilla;

show tables ;

select * from topic_start_browser;


show tables ;


show create table topic;


show create table user;


create table if not exists favorite(
    id bigint auto_increment primary key ,
    user_id bigint not null ,
    topic_id bigint not null unique ,
    created_at datetime not null ,
    constraint fk_favorite_user_id foreign key (user_id) references user(id) on update cascade on delete cascade ,
    constraint fk_favorite_topic_id foreign key (topic_id) references topic(id) on update cascade on delete cascade
);

show index from favorite;

create index user_id_index on favorite(user_id);

create index topic_id_index on favorite(topic_id);

drop table favorite;

alter table favorite modify created_at datetime not null default current_timestamp;

show create table favorite;

desc favorite;

select * from favorite;

show create table favorite;

select * from user_token;

select * from topic_start_browser;

select * from user_token;

show index from user_token;

select * from user;

show create table user;

show create table user_token;

create table if not exists update_start_log(
    id bigint auto_increment primary key ,
    user_id bigint not null ,
    topic_id bigint not null ,
    control varchar(10) not null ,
    detail text default null,
    constraint update_start_log_user_id foreign key (user_id) references user(id) on DELETE cascade on update cascade ,
    constraint update_start_log_topic_id foreign key (topic_id) references topic(id) on delete cascade on update cascade
);