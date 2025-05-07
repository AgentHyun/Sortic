package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Random;
import jakarta.annotation.PostConstruct;

/**
 * UserService 인터페이스의 구현체
 * 실제 사용자 관련 비즈니스 로직을 처리
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private final String uploadDir = "uploads/profile-images/";
    private final String defaultProfileImage = "/public/profile-images/profile-default.png";

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    @Transactional
    public Users signup(Users user) {
        if (userMapper.existsByUserId(user.getUserId())) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setGrade(0);

        userMapper.insertUser(user);
        return user;
    }

    @Override
    public boolean checkUserId(String user_id) {
        return !userMapper.existsByUserId(user_id);
    }

    @Override
    public Users findByUserId(String user_id) {
        Users user = userMapper.findByUserId(user_id);
        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }
        return user;
    }

    @Override
    public boolean existsByUserId(String user_id) {
        return userMapper.existsByUserId(user_id);
    }

    @Override
    public String uploadProfileImage(String user_id, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFileName = user_id + "_" + System.currentTimeMillis() + fileExtension;

        File targetFile = new File(uploadDir + newFileName);
        file.transferTo(targetFile);

        String imageUrl = "/uploads/" + newFileName;
        userMapper.updateProfileImage(user_id, imageUrl);

        return imageUrl;
    }

    @Override
    public void setDefaultProfileImage(String user_id) {
        userMapper.updateProfileImage(user_id, defaultProfileImage);
    }

    @Override
    public void updateUserProfile(Users user) {
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            userMapper.updatePassword(user.getUserId(), encodedPassword);
        }

        userMapper.updateUserProfile(user);
    }

    @Override
    public void sendTemporaryPassword(String email) {
        Users user = userMapper.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("해당 이메일로 등록된 사용자가 없습니다.");
        }

        String temporaryPassword = generateTemporaryPassword();
        String encodedPassword = passwordEncoder.encode(temporaryPassword);
        user.setPassword(encodedPassword);

        userMapper.updatePassword(user.getUserId(), encodedPassword);

        // TODO: 이메일 발송 로직 구현
        // emailService.sendTemporaryPassword(email, temporaryPassword);
    }

    @Override
    public String findUserIdByEmailAndUsername(String email, String username) {
        Users user = userMapper.findByEmailAndUsername(email, username);
        if (user == null) {
            throw new RuntimeException("일치하는 사용자 정보가 없습니다.");
        }
        return user.getUserId();
    }

    @Override
    public void changePassword(String user_id, String currentPassword, String newPassword) {
        Users user = userMapper.findByUserId(user_id);
        if (user == null) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }

        String encodedNewPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedNewPassword);
        userMapper.updatePassword(user_id, encodedNewPassword);
    }

    private String generateTemporaryPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
