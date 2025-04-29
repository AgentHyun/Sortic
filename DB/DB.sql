# 4월 28일
create database sortic;
DROP DATABASE sortic;
use sortic;

CREATE TABLE Users (
  user_id				        VARCHAR(50)  NOT NULL COMMENT '아이디(기본키)',
  password            	VARCHAR(255) NOT NULL COMMENT '비밀번호',
  username            	VARCHAR(100) NOT NULL COMMENT '닉네임',
  phone               	VARCHAR(20)  NOT NULL COMMENT '전화번호',
  email               	VARCHAR(100) NOT NULL COMMENT '이메일',
  region              	VARCHAR(50)  NOT NULL COMMENT '거주지역',
  grade               	INT          NOT NULL COMMENT '구독 등급',
  profile_image       	VARCHAR(255) DEFAULT NULL COMMENT '프로필 이미지 경로',
  created_signup_time TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '회원가입 시간',
  PRIMARY KEY (user_id)
) COMMENT='회원 테이블';

select * from Users;

INSERT INTO Users (user_id, password, username, phone, email, region, grade, created_signup_time)
VALUES ('user123', 'password1234', '홍길동', '010-1234-5678', 'hong@example.com', '서울', 1, NOW());
INSERT INTO Users (
  user_id,
  password,
  username,
  phone,
  email,
  region,
  grade
) VALUES (
           'admin',
           '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EHsM8',
           '관리자',
           '010-0000-0000',
           'admin@example.com',
           '서울',
           999
         );
UPDATE Users
SET password = '$2a$10$99PsEUnjjZTcyXE8wixsrek2DqBelLQgOqpTFMQOLp5pAzg2YuUgm'
WHERE user_id = 'admin';


CREATE TABLE Categories (
  category_id			      INT          NOT NULL AUTO_INCREMENT COMMENT '카테고리 번호(기본키)',
  user_id               VARCHAR(50)  NOT NULL COMMENT '아이디(외래키)',
  category_name         VARCHAR(100) NOT NULL COMMENT '카테고리 이름',
  created_category_time TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP COMMENT '카테고리 생성 시간',
  PRIMARY KEY (category_id),
  CONSTRAINT FK_Users_TO_Categories FOREIGN KEY (user_id) REFERENCES Users (user_id)
) COMMENT='카테고리';


CREATE TABLE Elements_name (
  elements_name_id		  INT          NOT NULL AUTO_INCREMENT COMMENT '요소 이름 (기본키)',
  category_id			      INT          NOT NULL COMMENT '카테고리 번호(외래키)',
  elements_name    		  VARCHAR(100) NOT NULL COMMENT '요소 이름',
  elements_price   		  INT          NOT NULL COMMENT '요소 가격',
  elements_image   		  VARCHAR(255) NOT NULL COMMENT '이미지 주소',
  PRIMARY KEY (elements_name_id),
  CONSTRAINT FK_Categories_TO_Elements_name
    FOREIGN KEY (category_id)
    REFERENCES Categories (category_id)
    ON DELETE CASCADE
) COMMENT='카테고리 요소 헤더';

CREATE TABLE Elements_data (
  elements_id      		  INT          NOT NULL AUTO_INCREMENT COMMENT '요소 번호(기본키)',
  elements_name_id 		  INT          NOT NULL COMMENT '요소 이름(외래키)',
  key_name         		  VARCHAR(100) NOT NULL COMMENT '키 이름',
  value_name       		  VARCHAR(255) NOT NULL COMMENT '값 이름',
  PRIMARY KEY (elements_id),
  CONSTRAINT FK_Elements_name_TO_Elements_data
    FOREIGN KEY (elements_name_id)
    REFERENCES Elements_name (elements_name_id)
    ON DELETE CASCADE
) COMMENT='요소';

CREATE TABLE Sorter (
  sorter_id     		    INT          NOT NULL AUTO_INCREMENT COMMENT '정렬자(기본키)',
  user_id       		    VARCHAR(50)  NOT NULL COMMENT '아이디(외래키)',
  elements_id   		    INT          NULL COMMENT '들어온 요소(외래키)',
  sorter_number 		    INT          NULL COMMENT '사용자에게 보여질 순서 번호',
  sorter_name   		    VARCHAR(100) NOT NULL COMMENT '정렬자 이름',
  PRIMARY KEY (sorter_id),
  CONSTRAINT FK_Users_TO_Sorter FOREIGN KEY (user_id) REFERENCES Users (user_id)
) COMMENT='정렬자';

CREATE TABLE Bill (
  Bill_id           	  INT          NOT NULL AUTO_INCREMENT COMMENT '계산서(기본키)',
  user_id           	  VARCHAR(50)  NOT NULL COMMENT '유저 아이디(외래키)',
  Bill_name         	  VARCHAR(100) NOT NULL COMMENT '계산서 이름',
  created_bill_time 	  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '계산서 생성 시간',
  PRIMARY KEY (Bill_id),
  CONSTRAINT FK_Users_TO_Bill FOREIGN KEY (user_id) REFERENCES Users (user_id)
    ON DELETE CASCADE
) COMMENT='계산서';

CREATE TABLE Bill_Element(
  Bill_Element_id		    INT			     NOT NULL AUTO_INCREMENT COMMENT '계산서_요소 기본키',
  Bill_id				        INT          NOT NULL COMMENT '계산서 아이디(외래키)',
  Elements_Name_id		  INT          NOT NULL COMMENT '요소들 아이디(외래키)',
  PRIMARY KEY(Bill_Element_id),
  CONSTRAINT FK_Element_Name_TO_Bill_Element FOREIGN KEY (Elements_name_id) REFERENCES elements_name(Elements_name_id)
    ON DELETE CASCADE,
  CONSTRAINT FK_Bill_TO_Bill_Elements FOREIGN KEY (Bill_id) REFERENCES Bill (Bill_id)
    ON DELETE CASCADE
) COMMENT='계산서의 요소들';

CREATE TABLE Bill_Commission(
  Bill_Commission_id    INT          NOT NULL AUTO_INCREMENT COMMENT '계산서_수수료',
  Bill_id               INT          NOT NULL COMMENT '계산서 아이디(외래키)',
  Commission            INT          NOT NULL COMMENT '수수료',
  Commission_named      VARCHAR(500) NOT NULL COMMENT '수수료 이름',
  PRIMARY KEY(Bill_Commission_id),
  CONSTRAINT FK_Bill_TO_Bill_Commission FOREIGN KEY (Bill_id) REFERENCES Bill (Bill_id)
    ON DELETE CASCADE
) COMMENT='계산서의 수수료들';
