-- 회원 테이블
CREATE TABLE IF NOT EXISTS Users (
  user_id               VARCHAR(50)   NOT NULL                            COMMENT '아이디(기본키)',
  password              VARCHAR(255)  NOT NULL                            COMMENT '비밀번호',
  username              VARCHAR(100)  NOT NULL                            COMMENT '닉네임',
  phone                 VARCHAR(20)   NOT NULL                            COMMENT '전화번호',
  email                 VARCHAR(100)  NOT NULL                            COMMENT '이메일',
  region                VARCHAR(50)   NOT NULL                            COMMENT '거주지역',
  grade                 INT           NOT NULL                            COMMENT '구독 등급',
  profile_image         VARCHAR(255)  DEFAULT NULL                        COMMENT '프로필 이미지 경로',
  created_signup_time   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT '회원가입 시간',
  PRIMARY KEY (user_id)
) COMMENT='회원 테이블';

-- 카테고리 테이블
CREATE TABLE IF NOT EXISTS Categories (
  category_id           INT           NOT NULL AUTO_INCREMENT             COMMENT '카테고리 번호(기본키)',
  user_id               VARCHAR(50)   NOT NULL                            COMMENT '아이디(외래키)',
  category_name         VARCHAR(100)  NOT NULL                            COMMENT '카테고리 이름',
  created_category_time TIMESTAMP     NULL DEFAULT CURRENT_TIMESTAMP      COMMENT '카테고리 생성 시간',
  PRIMARY KEY (category_id),
  CONSTRAINT FK_Users_TO_Categories FOREIGN KEY (user_id)
    REFERENCES Users (user_id) ON DELETE CASCADE
) COMMENT='카테고리';

-- 요소 이름 테이블
CREATE TABLE IF NOT EXISTS Elements_name (
  elements_name_id      INT           NOT NULL  AUTO_INCREMENT            COMMENT '요소 이름 (기본키)',
  category_id           INT           NOT NULL                            COMMENT '카테고리 번호(외래키)',
  elements_name         VARCHAR(100)  NOT NULL                            COMMENT '요소 이름',
  elements_price        INT           NOT NULL                            COMMENT '요소 가격',
  elements_image        VARCHAR(255)  NOT NULL                            COMMENT '이미지 주소',
  PRIMARY KEY (elements_name_id),
  CONSTRAINT FK_Categories_TO_Elements_name FOREIGN KEY (category_id)
    REFERENCES Categories (category_id) ON DELETE CASCADE
) COMMENT='카테고리 요소 헤더';

-- 요소 상세 데이터 테이블
CREATE TABLE IF NOT EXISTS Elements_data (
  elements_id           INT           NOT NULL AUTO_INCREMENT             COMMENT '요소 번호(기본키)',
  elements_name_id      INT           NOT NULL                            COMMENT '요소 이름(외래키)',
  key_name              VARCHAR(100)  NOT NULL                            COMMENT '키 이름',
  value_name            VARCHAR(255)  NOT NULL                            COMMENT '값 이름',
  PRIMARY KEY (elements_id),
  CONSTRAINT FK_Elements_name_TO_Elements_data FOREIGN KEY (elements_name_id)
    REFERENCES Elements_name (elements_name_id) ON DELETE CASCADE
) COMMENT='요소';

-- 정렬자 테이블
CREATE TABLE IF NOT EXISTS Sorter (
  sorter_id             INT           NOT NULL AUTO_INCREMENT             COMMENT '정렬자(기본키)',
  user_id               VARCHAR(50)   NOT NULL                            COMMENT '아이디(외래키)',
  elements_id           INT           NULL                                COMMENT '들어온 요소(외래키)',
  sorter_number         INT           NULL                                COMMENT '사용자에게 보여질 순서 번호',
  sorter_name           VARCHAR(100)  NOT NULL                            COMMENT '정렬자 이름',
  PRIMARY KEY (sorter_id),
  CONSTRAINT FK_Users_TO_Sorter FOREIGN KEY (user_id)
    REFERENCES Users (user_id) ON DELETE CASCADE
) COMMENT='정렬자';

-- 계산서 테이블
CREATE TABLE IF NOT EXISTS Bill (
  Bill_id               INT           NOT NULL AUTO_INCREMENT             COMMENT '계산서(기본키)',
  user_id               VARCHAR(50)   NOT NULL                            COMMENT '유저 아이디(외래키)',
  Bill_name             VARCHAR(100)  NOT NULL                            COMMENT '계산서 이름',
  created_bill_time     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT '계산서 생성 시간',
  PRIMARY KEY (Bill_id),
  CONSTRAINT FK_Users_TO_Bill FOREIGN KEY (user_id)
    REFERENCES Users (user_id) ON DELETE CASCADE
) COMMENT='계산서';

-- 계산서 요소 테이블
CREATE TABLE IF NOT EXISTS Bill_Element (
  Bill_Element_id       INT           NOT NULL AUTO_INCREMENT             COMMENT '계산서_요소 기본키',
  Bill_id               INT           NOT NULL                            COMMENT '계산서 아이디(외래키)',
  Elements_Name_id      INT           NOT NULL                            COMMENT '요소들 아이디(외래키)',
  PRIMARY KEY (Bill_Element_id),
  CONSTRAINT FK_Element_Name_TO_Bill_Element FOREIGN KEY (Elements_Name_id)
    REFERENCES Elements_name (Elements_name_id) ON DELETE CASCADE,
  CONSTRAINT FK_Bill_TO_Bill_Elements FOREIGN KEY (Bill_id)
    REFERENCES Bill (Bill_id) ON DELETE CASCADE
) COMMENT='계산서의 요소들';

-- 계산서 수수료 테이블
CREATE TABLE IF NOT EXISTS Bill_Commission (
  Bill_Commission_id    INT           NOT NULL AUTO_INCREMENT             COMMENT '계산서_수수료 기본키',
  Bill_id               INT           NOT NULL                            COMMENT '계산서 아이디(외래키)',
  Commission            INT           NOT NULL                            COMMENT '수수료',
  Commission_named      VARCHAR(500)  NOT NULL                            COMMENT '수수료 이름',
  PRIMARY KEY (Bill_Commission_id),
  CONSTRAINT FK_Bill_TO_Bill_Commission FOREIGN KEY (Bill_id)
    REFERENCES Bill (Bill_id) ON DELETE CASCADE
) COMMENT='계산서의 수수료들';

-- 리프레시 토큰 테이블
CREATE TABLE IF NOT EXISTS refresh_token (
  user_id               VARCHAR(50)   PRIMARY KEY                         COMMENT '유저 아이디(기본키, 외래키)',
  token                 VARCHAR(500)  NOT NULL                            COMMENT '리프레시 토큰 값',
  expiry                BIGINT        NOT NULL                            COMMENT '만료 시간 (Unix Timestamp 기준)',
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT='리프레시 토큰 테이블';
