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

delete from user where username='lisisi';

select * from user_token;

show tables ;

select token from user_token where user_id=16;

select * from user where id=16;

select * from user;

select user_id from user_token where token='217af910-22ed-4a70-a316-378c75787021';

select user.id, username, user.avatar,status
from user
         inner join (select user_id from user_token where token = '217af910-22ed-4a70-a316-378c75787021') as id
                    on id.user_id = user.id;

update user set bio='这个人很神秘，什么都没留下！' where id between 13 and 17;

show create table user;

alter table user modify bio varchar(500) default '这个人很神秘，什么都没留下！';

alter table user modify status int default null;

create table status(
    id int auto_increment primary key ,
    name varchar(10) not null
);

drop table status;

INSERT INTO status (name) VALUES
('放松'),
('兴奋'),
('开怀'),
('大笑'),
('美妙'),
('不悦'),
('调皮'),
('质疑'),
('小狗'),
('愉悦'),
('放松'),
('友好'),
('高兴'),
('自信'),
('自豪'),
('美妙'),
('大笑'),
('开怀'),
('微笑'),
('咀嚼'),
('疑惑'),
('男士'),
('女士'),
('开心'),
('友好');

alter table user add constraint fk_user_status foreign key user(status) references status(id) on delete set null on update cascade ;

show tables ;

select * from status;

show create table user;

update user set status=null where username='Aime';

select * from user;

select name,user_status.status
from status
         right join(select status
                     from user
                              inner join (select user_id
                                          from user_token
                                          where token = '217af910-22ed-4a70-a316-378c75787021') as id
                                         on id.user_id = user.id) as user_status on user_status.status = status.id;

select * from topic limit 10 offset 0;

select * from topic limit 10 offset 10;

select title from topic order by id;

select * from user;

create procedure rename_cover()
begin
    declare i int default 1;
    while i<=50 do
        update topic set cover_url=concat_ws('/','covers',concat(i,'.png')) where id=i;
        set i=i+1;
        end while;
end;

call rename_cover();

select * from topic;

show tables ;

select * from topic_media;

show create table user;