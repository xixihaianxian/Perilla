use perilla;

select * from user;

show create table user;

alter table user modify avatar varchar(500) null ;

show index from user;

# create index idx_username on user(username);
#
# drop index idx_username on user;

create table user_token(
    id bigint auto_increment primary key ,
    user_id bigint unique ,
    token varchar(200) unique ,
    expires_at datetime default null comment '过期时间，和创建时间相差7天',
    created_at datetime default current_timestamp on update current_timestamp,
    constraint fk_user_id foreign key (user_id) references user(id) on delete cascade on update cascade,
    index idx_user_id (user_id)
);

# create trigger trg_insert_token
#     after insert on user_token
#     for each row
#     begin
#         update user_token set NEW.expires_at=DATE_ADD(NEW.created_at,interval 7 day ) where id=NEW.id;
#     end;