use perilla;

show tables ;

create table if not exists categories(
    id bigint auto_increment,
    name varchar(100) not null unique ,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp,
    constraint primary key (id)
);

insert into categories(name)
values ('穿搭'),
       ('美食'),
       ('旅行'),
       ('摄影'),
       ('家居'),
       ('美妆'),
       ('健身'),
       ('读书'),
       ('设计'),
       ('宠物'),
       ('手工'),
       ('数码'),
       ('科技'),
       ('游戏'),
       ('动漫'),
       ('影视'),
       ('音乐'),
       ('绘画'),
       ('职场'),
       ('学习'),
       ('编程'),
       ('创业'),
       ('投资理财'),
       ('汽车'),
       ('母婴'),
       ('情感'),
       ('校园'),
       ('健康养生'),
       ('运动'),
       ('露营'),
       ('户外'),
       ('咖啡'),
       ('烘焙'),
       ('探店'),
       ('装修'),
       ('收纳'),
       ('艺术'),
       ('潮玩'),
       ('文化'),
       ('历史');

select * from categories where name='动漫';

truncate table categories;

CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    nickname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(500) not null ,
    bio VARCHAR(500),
    gender TINYINT DEFAULT 0,
    birthday DATE,
    status TINYINT DEFAULT 1,
    last_login_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

drop table user;

create table topic(
    id bigint auto_increment primary key ,
    title varchar(100) not null unique ,
    description varchar(500),
    cover_url varchar(500),
    author_id bigint ,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp,
    category_id bigint comment '种类id',
    constraint fk_categories_category_id foreign key (category_id) references categories(id) on update set null on delete cascade ,
    index index_categories_id (category_id)
);

create index index_created_at on topic(created_at);

alter table topic add constraint fk_user_author_id foreign key topic(author_id) references user(id) on update set null on delete cascade ;

drop table topic;

INSERT INTO user (
    username,
    nickname,
    email,
    phone,
    password_hash,
    avatar,
    bio,
    gender,
    birthday,
    status,
    last_login_time
)
VALUES
(
    'alice01',
    'Alice',
    'alice01@example.com',
    '13800000001',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOHi2A6G8W8J9JQ5dTj2K8Q0rKJQz9Y7W',
    'https://i.pravatar.cc/300?img=1',
    '喜欢旅行和摄影📷',
    2,
    '1999-05-18',
    1,
    NOW()
),
(
    'bob02',
    'Bob',
    'bob02@example.com',
    '13800000002',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOHi2A6G8W8J9JQ5dTj2K8Q0rKJQz9Y7W',
    'https://i.pravatar.cc/300?img=2',
    '健身爱好者💪',
    1,
    '1998-11-06',
    1,
    NOW()
),
(
    'charlie03',
    'Charlie',
    'charlie03@example.com',
    '13800000003',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOHi2A6G8W8J9JQ5dTj2K8Q0rKJQz9Y7W',
    'https://i.pravatar.cc/300?img=3',
    '记录生活中的美好瞬间✨',
    1,
    '2000-02-15',
    1,
    NOW()
),
(
    'daisy04',
    'Daisy',
    'daisy04@example.com',
    '13800000004',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOHi2A6G8W8J9JQ5dTj2K8Q0rKJQz9Y7W',
    'https://i.pravatar.cc/300?img=4',
    '美食探店达人🍰',
    2,
    '2001-03-08',
    1,
    NOW()
),
(
    'ethan05',
    'Ethan',
    'ethan05@example.com',
    '13800000005',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOHi2A6G8W8J9JQ5dTj2K8Q0rKJQz9Y7W',
    'https://i.pravatar.cc/300?img=5',
    '热爱编程和AI',
    1,
    '1997-08-22',
    1,
    NOW()
),
(
    'fiona06',
    'Fiona',
    'fiona06@example.com',
    '13800000006',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOHi2A6G8W8J9JQ5dTj2K8Q0rKJQz9Y7W',
    'https://i.pravatar.cc/300?img=6',
    '分享日常穿搭👗',
    2,
    '2002-01-11',
    1,
    NOW()
),
(
    'george07',
    'George',
    'george07@example.com',
    '13800000007',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOHi2A6G8W8J9JQ5dTj2K8Q0rKJQz9Y7W',
    'https://i.pravatar.cc/300?img=7',
    '数码产品发烧友📱',
    1,
    '1996-12-09',
    1,
    NOW()
),
(
    'hannah08',
    'Hannah',
    'hannah08@example.com',
    '13800000008',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOHi2A6G8W8J9JQ5dTj2K8Q0rKJQz9Y7W',
    'https://i.pravatar.cc/300?img=8',
    '阅读让生活更丰富📚',
    2,
    '2000-07-19',
    1,
    NOW()
),
(
    'ivan09',
    'Ivan',
    'ivan09@example.com',
    '13800000009',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOHi2A6G8W8J9JQ5dTj2K8Q0rKJQz9Y7W',
    'https://i.pravatar.cc/300?img=9',
    '热爱户外与露营⛺',
    1,
    '1999-10-01',
    1,
    NOW()
),
(
    'jenny10',
    'Jenny',
    'jenny10@example.com',
    '13800000010',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOHi2A6G8W8J9JQ5dTj2K8Q0rKJQz9Y7W',
    'https://i.pravatar.cc/300?img=10',
    '咖啡重度爱好者☕',
    2,
    '2001-09-25',
    1,
    NOW()
);

select * from user;

INSERT INTO `topic` (`title`, `description`, `cover_url`, `author_id`, `category_id`) VALUES
('为何说《天地创造设计部》是被低估的搞笑科普神作？', '这部2021年的番剧脑洞真的很大！设定是神明将设计动物的工作外包给一个设计部，比如为了设计出“能吃到高处树叶的动物”，他们居然搞出了天马、乒乓球树海绵和长颈鹿三个方案。虽然制作经费看起来不太足，画面偶尔崩坏，但幽默的剧情和硬核的动物知识科普绝对值得一看，特别是对生物感兴趣的朋友。豆瓣评分7.9，属于那种看了就停不下来的冷门佳作。', 'https://picsum.photos/800/600?random=1', 1, 15),
('深度解析：《千与千寻》里那些被我们忽略的成人隐喻', '汤婆婆的油屋真的是个童话世界吗？重看《千与千寻》，才发现这其实是一个关于迷失与找回自我的成人寓言。无脸男的孤独与暴食，反映了现代人的空虚；而“不劳动就会变成动物”的规则，更是对资本主义社会的辛辣讽刺。宫崎骏老爷子用动画的形式，为成年人讲述了一个关于生活的理由和力量的故事，每一次看都会有新的感悟。', 'https://picsum.photos/800/600?random=2', 2, 15),
('喜报！《罗小黑战记》TV动画时隔4年回归，新篇章“学前篇”要来啦！', '鸽了这么久，终于有消息了！根据B站2025-2026国创发布会消息，我们的“有生之年”系列《罗小黑战记》TV动画要回归了，这次开启的是新篇章“学前篇”，讲述“众生之门”之后的故事。同时，剧场版《罗小黑战记2》也已经在制作中。木头终于想起来填坑了，虽然不知道具体定档日期，但有了盼头总是好的。', 'https://picsum.photos/800/600?random=3', 3, 15),
('从《辉夜姬物语》的水墨风格，看高畑勋对日本传统美学的执念', '不同于吉卜力其他作品的奇幻色彩，《辉夜姬物语》采用了极简的水墨画风，线条灵动，留白写意。这种被称为“线描”的手法，其实是对日本古典绘画（如《鸟兽人物戏画》）的致敬。高畑勋用这种返璞归真的方式，完美呈现了《竹取物语》中辉夜姬的纯真与悲伤，当花瓣飞离花朵，那种物哀之美真的让人心碎。', 'https://picsum.photos/800/600?random=4', 4, 15),
('《中国奇谭2》定档2026年1月1日！这波国产动画排面拉满', '还记得两年前那部惊艳众人的《中国奇谭》吗？续作终于来了！第二季将包含9个风格迥异的短片故事，继续由上海美术电影制片厂和B站联合打造。从第一季的《小妖怪的夏天》到《鹅鹅鹅》，我们看到了国产动画在奇谭、志怪题材上的无限潜力。第二季会讲什么新故事？已经迫不及待了。', 'https://picsum.photos/800/600?random=5', 5, 15),
('推荐一本冷门佳作：《经典动画作品解析》，大学老师的硬核书单', '想深入了解动画视听语言和剧作结构的话，强烈推荐董立荣老师的《经典动画作品解析》。这本书不仅分析了《千与千寻》《大圣归来》，还兼顾了《辉夜姬物语》《蒸汽男孩》甚至法国的《失物招领》。书中图文并茂，对动画片的角色设计、经典场景和幕后花絮都有详细介绍，是动画专业学生和硬核爱好者的福音。', 'https://picsum.photos/800/600?random=6', 6, 15),
('重温手冢治虫：《铁臂阿童木》不只是热血，更是对科技的反思', '作为日本第一部国产电视动画，《铁臂阿童木》的影响力远不止“十万马力”那么简单。手冢治虫在60年前就在探讨“人类与机器人”的关系问题。阿童木虽然是机器人，却拥有人类最纯真的心灵，他时常对自己既不是人也不是机器的身份感到困惑。这反映出作者对科技发展的忧虑，他认为滥用科学技术会产生负作用，导致人情淡薄。', 'https://picsum.photos/800/600?random=7', 7, 15),
('等等党胜利！《凡人修仙传》新一季明年播出，还有院线电影？', '追番人狂喜！B站国创发布会上宣布，《凡人修仙传》年番新一季将在2026年上半年播出，而且同IP的院线电影《瀚海迷踪》和番外篇《玄骨传》也在制作中。韩老魔的修仙之路还在继续，作为国漫3D修仙的顶流，这部的打斗设计和人物建模一直是标杆，期待电影版能带来更大的视觉冲击。', 'https://picsum.photos/800/600?random=8', 8, 15),
('吐槽一下《进击的巨人》结局：耶蕾娜的那段审判台词真是绝了', '最近在重刷巨人，发现耶蕾娜在救世小队出发前夜对众人的那段“数罪”台词真是全剧的高光时刻之一。她细数了每个人的罪恶，让这群人在赴死前达成了暂时的和解。这段文戏写得极好，把战争下的无奈和人性的复杂展现得淋漓尽致。虽然结局争议很大，但巨人带给我们的震撼是实打实的。', 'https://picsum.photos/800/600?random=9', 9, 15),
('据说《仙剑奇侠传四》要动画化了？这个PV你看了吗？', '真的是“我死后哪怕洪水滔天”，有生之年居然等到了《仙剑四》动画化！虽然具体播出时间未定，但B站发布会上已经曝光了最新预告。云天河、韩菱纱、柳梦璃、慕容紫英，这四个人的故事是多少人的青春啊。只要动画能还原出即墨烟花那一段的感动，我就吹爆！希望制作组给力点。', 'https://picsum.photos/800/600?random=10', 10, 15),
('《间谍过家家》第二季开播！阿尼亚的颜艺依然是快乐源泉', '劳埃德、约尔和阿尼亚的虚假家庭继续营业！第二季延续了第一季的搞笑与温情并存的风格，阿尼亚在伊甸学园的日常依然充满笑点。虽然主线推进缓慢，但这种轻松治愈的日常番正是我们需要的电子榨菜。', 'https://picsum.photos/800/600?random=11', 1, 15),
('为什么《钢之炼金术师FA》是零差评的神作？', '从等价交换的哲学到对战争与人性的深刻反思，FA的剧情结构堪称完美。没有机械降神，没有烂尾，每一个伏笔都有回收。爱德华兄弟的救赎之路，是少年漫改动画的天花板。', 'https://picsum.photos/800/600?random=12', 2, 15),
('《葬送的芙莉莲》：用温柔的视角讲述时间与生命', '勇者打败魔王之后的故事。芙莉莲作为长寿的精灵，开始重新理解人类的情感与短暂的生命。这部番节奏舒缓，但每一集都能触动人心，是近年来难得的治愈系奇幻佳作。', 'https://picsum.photos/800/600?random=13', 3, 15),
('《咒术回战》涩谷事变：动画史上最惨烈的战役之一', 'MAPPA的作画在涩谷事变篇达到了巅峰。五条悟被封印、虎杖的绝望、真人的疯狂，这场战役彻底改变了咒术界的格局。虽然剧情走向让人胃疼，但制作质量无可挑剔。', 'https://picsum.photos/800/600?random=14', 4, 15),
('《鬼灭之刃》无限城篇剧场版：飞碟社的经费在燃烧', '无限列车之后，鬼杀队终于迎来了与无惨的最终决战。飞碟社的特效和摄影依然是业界标杆，每一帧都是壁纸。虽然变成了三部曲剧场版，但为了这作画，值了！', 'https://picsum.photos/800/600?random=15', 5, 15),
('《灵笼》第二季：国产科幻动画的里程碑', '马克的噬极兽形态、灯塔与地面的冲突，灵笼构建了一个庞大而残酷的末世世界观。第二季在人物塑造和世界观展开上更加深入，国产3D动画能做到这个程度，真的骄傲。', 'https://picsum.photos/800/600?random=16', 6, 15),
('《时光代理人》：穿越时空的悬疑与感动', '程小时和陆光的搭档太有默契了！通过照片穿越回过去，改变不了结果但可以弥补遗憾。每一个单元故事都直击社会痛点，主线悬疑也越来越精彩。', 'https://picsum.photos/800/600?random=17', 7, 15),
('《雾山五行》：水墨动作动画的极致美学', '林魂导演一个人肝出来的神作！水墨画风结合硬核打斗，火行与嗔兽孔雀的对决看得人热血沸腾。虽然集数少，但每一秒都是经费在燃烧。', 'https://picsum.photos/800/600?random=18', 8, 15),
('《双城之战》：英雄联盟宇宙的巅峰之作', '不管你是不是LOL玩家，这部动画都值得看。金克丝和蔚的姐妹情、祖安与皮城的阶级矛盾，剧情深度和美术风格都是顶级。这才是游戏改动画的正确打开方式。', 'https://picsum.photos/800/600?random=19', 9, 15),
('《夏日重现》：轮回系悬疑的天花板', '男主慎平回到故乡参加青梅竹马的葬礼，却陷入了时间循环。影子的设定、智斗的剧情、紧凑的节奏，这部番完美诠释了什么是“一口气看完”。', 'https://picsum.photos/800/600?random=20', 10, 15),
('《孤独摇滚！》：社恐少女的摇滚成长史', '波奇酱的社恐表现太真实了！各种脑洞大开的演出和颜艺，配上神仙级别的乐队歌曲，这部番简直是年度黑马。看完只想拿起吉他！', 'https://picsum.photos/800/600?random=21', 1, 15),
('《电锯人》：藤本树的疯狂与浪漫', '玛奇玛、早川秋、电次，这群边缘人的日常充满了黑色幽默与暴力美学。MAPPA的电影级运镜和配乐，让电锯人的世界更加迷人。虽然第一季没做到蕾塞篇，但依然封神。', 'https://picsum.photos/800/600?random=22', 2, 15),
('《排球少年！！》：没有超能力的纯粹热血', '乌野高中从“没落的强豪”到全国大赛，每一场比赛都让人热血沸腾。没有必杀技，只有无数次的练习和团队配合。这才是运动番该有的样子！', 'https://picsum.photos/800/600?random=23', 3, 15),
('《药屋少女的呢喃》：猫猫的推理日常太有趣了', '在宫廷里当医官的猫猫，用毒理学知识解决各种离奇案件。猫猫的性格太讨喜了，对毒药的热爱和对帅哥的无感，反差萌拉满。', 'https://picsum.photos/800/600?random=24', 4, 15),
('《迷宫饭》：在地下城里做饭也太硬核了', '为了救妹妹，主角团开始在迷宫里狩猎魔物做菜。史莱姆欧姆蛋、烤飞龙、曼德拉草沙拉……这部番把奇幻设定和美食完美结合，看着看着就饿了。', 'https://picsum.photos/800/600?random=25', 5, 15),
('《葬送的芙莉莲》：魔法的本质是想象力', '芙莉莲在旅途中不断收集各种奇怪的魔法，比如“变出花田的魔法”、“清除铜像的魔法”。这些看似无用的魔法，背后都藏着温暖的回忆。', 'https://picsum.photos/800/600?random=26', 6, 15),
('《间谍过家家》：黄昏的真实身份快藏不住了', '随着约尔越来越强、阿尼亚越来越聪明，这个虚假家庭的裂缝也越来越大。但正是这种随时可能崩塌的紧张感，让每一次温馨日常都更加珍贵。', 'https://picsum.photos/800/600?random=27', 7, 15),
('《咒术回战》：宿傩的压迫感太强了', '两面宿傩作为诅咒之王，每次出场都让人窒息。他的强大不仅在于实力，更在于那种视万物为刍狗的傲慢。虎杖要怎样才能超越他？', 'https://picsum.photos/800/600?random=28', 8, 15),
('《进击的巨人》：自由之翼的代价', '从艾伦喊出“我要把巨人一个不剩地驱逐出去”到最终季的真相揭露，这部番探讨了太多沉重的话题。战争没有赢家，只有无尽的仇恨连锁。', 'https://picsum.photos/800/600?random=29', 9, 15),
('《罗小黑战记》：人与妖的共存之道', '风息和无限的立场之争，本质上是发展与传统、人类与自然的矛盾。小黑在两者之间找到了自己的答案，这个成长过程太治愈了。', 'https://picsum.photos/800/600?random=30', 10, 15),
('《凡人修仙传》：韩立的苟道哲学', '韩跑跑之所以能活到最后，靠的就是谨慎和果断。没有无脑热血，只有修仙界的残酷现实。这种写实风格的修仙，才是成年人爱看的。', 'https://picsum.photos/800/600?random=31', 1, 15),
('《中国奇谭》：中式奇幻的回归', '《小妖怪的夏天》里小猪妖的打工人日常，《鹅鹅鹅》的诡异美学，上美影用短片证明了国产动画的无限可能。期待第二季！', 'https://picsum.photos/800/600?random=32', 2, 15),
('《铁臂阿童木》：跨越时代的科幻启蒙', '手冢治虫在60年代就提出了机器人权利的问题，这在今天AI时代看来更加超前。阿童木不仅是英雄，更是连接人与机器的桥梁。', 'https://picsum.photos/800/600?random=33', 3, 15),
('《天地创造设计部》：生物学家的脑洞大开', '长颈鹿的脖子、企鹅的翅膀，这些看似不合理的设计背后都有合理的演化逻辑。这部番是披着搞笑外衣的硬核科普。', 'https://picsum.photos/800/600?random=34', 4, 15),
('《千与千寻》：不要忘记自己的名字', '千寻在油屋的成长，其实就是我们步入社会的缩影。记住名字就是记住自我，在物欲横流的世界里保持初心太难了。', 'https://picsum.photos/800/600?random=35', 5, 15),
('《辉夜姬物语》：水墨画里的物哀之美', '高畑勋用十年时间打磨这部作品，每一帧都是艺术品。辉夜姬的悲伤不是矫情，而是对人间羁绊的眷恋与无奈。', 'https://picsum.photos/800/600?random=36', 6, 15),
('《经典动画作品解析》：动画专业的必修课', '董立荣老师这本书从视听语言角度拆解经典，看完你会发现自己以前看动画都白看了。强烈推荐想深入了解动画的朋友阅读。', 'https://picsum.photos/800/600?random=37', 7, 15),
('《仙剑奇侠传四》：我命由我不由天', '云天河的纯真、韩菱纱的洒脱、柳梦璃的温柔、慕容紫英的坚守，这四个人的故事是国产RPG的巅峰。动画化如果能还原即墨烟花，我就给满分。', 'https://picsum.photos/800/600?random=38', 8, 15),
('《灵笼》：马克的抉择太痛苦了', '作为噬极兽却拥有人类记忆，马克在两个身份之间挣扎。灯塔的虚伪和地面的残酷，让他不得不做出选择。', 'https://picsum.photos/800/600?random=39', 9, 15),
('《时光代理人》：照片背后的秘密', '每一个委托背后都有一个悲伤的故事。程小时和陆光在改变过去的同时，也在治愈自己。', 'https://picsum.photos/800/600?random=40', 10, 15),
('《雾山五行》：水墨与动作的完美融合', '林魂导演的坚持让这部作品得以面世。传统水墨画风结合现代动作设计，开创了独属于中国的动画美学。', 'https://picsum.photos/800/600?random=41', 1, 15),
('《双城之战》：金克丝的疯狂与悲伤', '从爆爆到金克丝，她的黑化不是突然的，而是无数次被抛弃、被误解的结果。蔚的愧疚和希尔科的扭曲父爱，构成了最复杂的亲情。', 'https://picsum.photos/800/600?random=42', 2, 15),
('《夏日重现》：慎平的智商一直在线', '不同于其他轮回番主角的降智，慎平每次轮回都在收集信息、制定计划。这种智斗的快感太爽了。', 'https://picsum.photos/800/600?random=43', 3, 15),
('《孤独摇滚！》：社恐也能闪闪发光', '波奇酱虽然社恐，但在舞台上弹吉他时却无比耀眼。这部番告诉我们，即使有缺陷，也能找到属于自己的舞台。', 'https://picsum.photos/800/600?random=44', 4, 15),
('《电锯人》：藤本树的脑洞没有上限', '从电锯人到枪之恶魔，藤本树的剧情永远猜不到下一步。这种不按套路出牌的叙事，正是电锯人的魅力所在。', 'https://picsum.photos/800/600?random=45', 5, 15),
('《排球少年！！》：输赢之外的成长', '即使输了比赛，球员们也在成长。排球少年没有贬低对手，而是尊重每一个全力以赴的人。', 'https://picsum.photos/800/600?random=46', 6, 15),
('《药屋少女的呢喃》：猫猫的毒理学课堂', '通过猫猫的推理，我们了解到了古代宫廷的医药知识。这种寓教于乐的方式，比枯燥的科普有趣多了。', 'https://picsum.photos/800/600?random=47', 7, 15),
('《迷宫饭》：魔物料理的无限可能', '从史莱姆到龙，每种魔物都有独特的烹饪方法。这部番让我相信，只要厨艺够好，没有什么不能吃。', 'https://picsum.photos/800/600?random=48', 8, 15),
('《葬送的芙莉莲》：旅途的意义在于过程', '芙莉莲花了十年才理解辛美尔的心意，但剩下的时间她会好好珍惜。这部番教会我们，不要等失去了才后悔。', 'https://picsum.photos/800/600?random=49', 9, 15),
('《间谍过家家》：虚假家庭里的真实感情', '虽然三人都有秘密，但在一起时的快乐是真实的。这种超越血缘的羁绊，比任何血缘关系都更动人。', 'https://picsum.photos/800/600?random=50', 10, 15);

select topic.*,user.username,user.avatar from topic left outer join user on topic.author_id=user.id where category_id=15;

# 存放话题素材
create table topic_media(
    id bigint primary key auto_increment,
    note_id bigint,
    media_url varchar(500) not null ,
    media_type ENUM('image','video') default 'image',
    created_at datetime default current_timestamp,
    update_at datetime default current_timestamp on update current_timestamp,
    constraint fk_topic_id foreign key (note_id) references topic(id) on delete cascade on update cascade
);

# 存放话题收藏
create table topic_start_browser(
    id bigint primary key auto_increment,
    note_id bigint not null unique ,
    start bigint,
    browser bigint,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp,
    constraint fk_start_topic_id foreign key (note_id) references topic(id) on delete cascade on update cascade
);

drop table topic_start_browser;

select * from user;

INSERT INTO topic_media(note_id, media_url) VALUES
-- topic 1
(1,'https://picsum.photos/id/1015/1200/800'),
(1,'https://picsum.photos/id/1016/1200/800'),
(1,'https://picsum.photos/id/1018/1200/800'),

-- topic 2
(2,'https://picsum.photos/id/1020/1200/800'),
(2,'https://picsum.photos/id/1024/1200/800'),
(2,'https://picsum.photos/id/1025/1200/800'),

-- topic 3
(3,'https://picsum.photos/id/1031/1200/800'),
(3,'https://picsum.photos/id/1033/1200/800'),
(3,'https://picsum.photos/id/1035/1200/800'),

-- topic 4
(4,'https://picsum.photos/id/1036/1200/800'),
(4,'https://picsum.photos/id/1037/1200/800'),
(4,'https://picsum.photos/id/1040/1200/800'),

-- topic 5
(5,'https://picsum.photos/id/1041/1200/800'),
(5,'https://picsum.photos/id/1042/1200/800'),
(5,'https://picsum.photos/id/1043/1200/800'),

-- topic 6
(6,'https://picsum.photos/id/1050/1200/800'),
(6,'https://picsum.photos/id/1051/1200/800'),
(6,'https://picsum.photos/id/1052/1200/800'),

-- topic 7
(7,'https://picsum.photos/id/1060/1200/800'),
(7,'https://picsum.photos/id/1062/1200/800'),
(7,'https://picsum.photos/id/1063/1200/800'),

-- topic 8
(8,'https://picsum.photos/id/1070/1200/800'),
(8,'https://picsum.photos/id/1071/1200/800'),
(8,'https://picsum.photos/id/1074/1200/800'),

-- topic 9
(9,'https://picsum.photos/id/1080/1200/800'),
(9,'https://picsum.photos/id/1081/1200/800'),
(9,'https://picsum.photos/id/1082/1200/800'),

-- topic 10
(10,'https://picsum.photos/id/1084/1200/800'),
(10,'https://picsum.photos/id/1085/1200/800'),
(10,'https://picsum.photos/id/1086/1200/800'),

-- topic 11
(11,'https://picsum.photos/id/1090/1200/800'),
(11,'https://picsum.photos/id/1091/1200/800'),
(11,'https://picsum.photos/id/1092/1200/800'),

-- topic 12
(12,'https://picsum.photos/id/1100/1200/800'),
(12,'https://picsum.photos/id/1101/1200/800'),
(12,'https://picsum.photos/id/1102/1200/800'),

-- topic 13
(13,'https://picsum.photos/id/1110/1200/800'),
(13,'https://picsum.photos/id/1111/1200/800'),
(13,'https://picsum.photos/id/1112/1200/800'),

-- topic 14
(14,'https://picsum.photos/id/1120/1200/800'),
(14,'https://picsum.photos/id/1121/1200/800'),
(14,'https://picsum.photos/id/1122/1200/800'),

-- topic 15
(15,'https://picsum.photos/id/1130/1200/800'),
(15,'https://picsum.photos/id/1131/1200/800'),
(15,'https://picsum.photos/id/1132/1200/800'),

-- topic 16
(16,'https://picsum.photos/id/1140/1200/800'),
(16,'https://picsum.photos/id/1141/1200/800'),
(16,'https://picsum.photos/id/1142/1200/800'),

-- topic 17
(17,'https://picsum.photos/id/1150/1200/800'),
(17,'https://picsum.photos/id/1151/1200/800'),
(17,'https://picsum.photos/id/1152/1200/800'),

-- topic 18
(18,'https://picsum.photos/id/1160/1200/800'),
(18,'https://picsum.photos/id/1161/1200/800'),
(18,'https://picsum.photos/id/1162/1200/800'),

-- topic 19
(19,'https://picsum.photos/id/1170/1200/800'),
(19,'https://picsum.photos/id/1171/1200/800'),
(19,'https://picsum.photos/id/1172/1200/800'),

-- topic 20
(20,'https://picsum.photos/id/1180/1200/800'),
(20,'https://picsum.photos/id/1181/1200/800'),
(20,'https://picsum.photos/id/1182/1200/800');

select * from topic_media;

truncate table topic_start_browser;

INSERT INTO topic_start_browser(note_id,start,browser)
VALUES
(1,125,1250),
(2,186,1560),
(3,240,1800),
(4,315,2100),
(5,390,2600),
(6,480,3200),
(7,600,4000),
(8,675,4500),
(9,810,5400),
(10,960,6400),

(11,1125,7500),
(12,1290,8600),
(13,1470,9800),
(14,1710,11400),
(15,1920,12800),
(16,2250,15000),
(17,2460,16400),
(18,2700,18000),
(19,2940,19600),
(20,3300,22000),

(21,3600,24000),
(22,3900,26000),
(23,4200,28000),
(24,4500,30000),
(25,4800,32000),
(26,5100,34000),
(27,5400,36000),
(28,5700,38000),
(29,6000,40000),
(30,6300,42000),

(31,6600,44000),
(32,6900,46000),
(33,7200,48000),
(34,7500,50000),
(35,7350,49000),
(36,7050,47000),
(37,6750,45000),
(38,6450,43000),
(39,6150,41000),
(40,5850,39000),

(41,5550,37000),
(42,5250,35000),
(43,4950,33000),
(44,4650,31000),
(45,4350,29000),
(46,4050,27000),
(47,3750,25000),
(48,3450,23000),
(49,3150,21000),
(50,2850,19000);

select * from topic_start_browser;

select author_id,description,title,created_at from topic where topic.id=12;

select t.author_id, t.description, t.title, t.created_at, user.username, user.bio
from (select author_id, description, title, created_at from topic where topic.id = 12) as t
         inner join user on user.id = t.author_id;

select topic_start_browser.start, topic_start_browser.browser
from (select id from topic where topic.id = 12) as t
         left outer join topic_start_browser on topic_start_browser.note_id = t.id;

create table topic_comments_number(
    id bigint auto_increment primary key ,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp,
    number bigint default 0,
    topic_id bigint not null ,
    constraint fk_topic_comment_topic_id foreign key (topic_id) references topic(id) on delete cascade on update cascade
);

drop table topic_comments_number;

truncate table topic_comments_number;

INSERT INTO topic_comments_number(topic_id,number)
VALUES
(1,12),
(2,15),
(3,18),
(4,21),
(5,25),
(6,29),
(7,35),
(8,38),
(9,43),
(10,48),

(11,55),
(12,60),
(13,68),
(14,75),
(15,82),
(16,95),
(17,102),
(18,110),
(19,118),
(20,130),

(21,140),
(22,150),
(23,160),
(24,170),
(25,180),
(26,190),
(27,200),
(28,210),
(29,220),
(30,230),

(31,240),
(32,250),
(33,260),
(34,270),
(35,265),
(36,255),
(37,245),
(38,235),
(39,225),
(40,215),

(41,205),
(42,195),
(43,185),
(44,175),
(45,165),
(46,155),
(47,145),
(48,135),
(49,125),
(50,115);

INSERT INTO topic_media (note_id, media_url, media_type)
SELECT
    t.id,
    CONCAT(
        'https://picsum.photos/id/',
        ((t.id - 1) * 3 + n.num),
        '/1200/800'
    ),
    'image'
FROM topic t
CROSS JOIN (
    SELECT 1 AS num
    UNION ALL
    SELECT 2
    UNION ALL
    SELECT 3
) n
WHERE t.id BETWEEN 1 AND 50;

truncate table topic_media;

update topic_start_browser set browser=3 where note_id=1;

select * from topic where id=1;