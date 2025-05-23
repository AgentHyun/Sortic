package org.sortic.sorticproject.Util;

import java.util.regex.Pattern;

/**
 * 회원정보 유효성 검증 유틸리티 클래스
 */
public class ValidationUtil {

    private static final Pattern USER_ID_PATTERN = Pattern.compile("^[a-zA-Z0-9@._-]{4,20}$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\d{11}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[\\w-\\.]+@[\\w-]+\\.[a-z]{2,4}$");

    /**
     * 아이디 유효성 검사
     */
    public static void validateUserId(String userId) {
        if (userId == null || !USER_ID_PATTERN.matcher(userId).matches()) {
            throw new IllegalArgumentException("아이디는 4~20자, 영어/숫자/@._-만 허용됩니다.");
        }
    }

    /**
     * 비밀번호 유효성 검사
     */
    public static void validatePassword(String password, String userId) {
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 최소 8자 이상 입력해주세요.");
        }
        if (userId != null && password.contains(userId.substring(0, Math.min(3, userId.length())))) {
            throw new IllegalArgumentException("아이디의 연속된 3자 이상을 포함할 수 없습니다.");
        }

        int complexity = 0;
        if (password.matches(".*[a-z].*")) complexity++;
        if (password.matches(".*[A-Z].*")) complexity++;
        if (password.matches(".*\\d.*")) complexity++;
        if (password.matches(".*[^a-zA-Z0-9].*")) complexity++;

        if (complexity < 2) {
            throw new IllegalArgumentException("비밀번호는 영문 대소문자/숫자/특수문자 중 2가지 이상을 포함해야 합니다.");
        }
    }

    /**
     * 상호명 유효성 검사
     */
    public static void validateStoreName(String storeName) {
        if (storeName == null || storeName.length() < 2 || storeName.length() > 10) {
            throw new IllegalArgumentException("상호명은 2~10자 이내여야 합니다.");
        }
    }

    /**
     * 이메일 유효성 검사
     */
    public static void validateEmail(String email) {
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("유효한 이메일 형식이 아닙니다.");
        }
    }

    /**
     * 전화번호 유효성 검사
     */
    public static void validatePhone(String phone) {
        if (phone == null || !PHONE_PATTERN.matcher(phone).matches()) {
            throw new IllegalArgumentException("전화번호는 숫자만 11자리로 입력해주세요.");
        }
    }
}
