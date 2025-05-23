plugins {
    java
    id("org.springframework.boot") version "3.2.3"
    id("io.spring.dependency-management") version "1.1.4"
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.spring") version "1.9.22"
}

group = "org.sortic"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
  // ── Spring Boot Starters ───────────────────────────────────────────────
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-security")
  implementation("org.springframework.boot:spring-boot-starter-validation")

  // ── JWT ───────────────────────────────────────────────────────────────
  api("io.jsonwebtoken:jjwt-api:0.11.5")
  runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
  runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")

  // ── Kotlin Support ────────────────────────────────────────────────────
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")

  // ── Database ──────────────────────────────────────────────────────────
  implementation("org.mybatis.spring.boot:mybatis-spring-boot-starter:3.0.3")
  runtimeOnly("mysql:mysql-connector-java:8.0.33")

  // ── MapStruct + Lombok ────────────────────────────────────────────────
  implementation("org.mapstruct:mapstruct:1.5.5.Final")            // ❶
  annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final") // ❶
  compileOnly("org.projectlombok:lombok")
  annotationProcessor("org.projectlombok:lombok")

  // ── Dev Tools ────────────────────────────────────────────────────────
  developmentOnly("org.springframework.boot:spring-boot-devtools")
  annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")

  // ── Mail ─────────────────────────────────────────────────────────────
  implementation("org.springframework.boot:spring-boot-starter-mail")

  // ── Redis ────────────────────────────────────────────────────────────
  implementation("org.springframework.boot:spring-boot-starter-data-redis")

  // ── Test ─────────────────────────────────────────────────────────────
  testImplementation("org.springframework.boot:spring-boot-starter-test") {
    exclude(group = "org.junit.vintage", module = "junit-vintage-engine")
  }
  testImplementation("org.springframework.security:spring-security-test")
  testRuntimeOnly("org.junit.platform:junit-platform-launcher")



}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "17"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

