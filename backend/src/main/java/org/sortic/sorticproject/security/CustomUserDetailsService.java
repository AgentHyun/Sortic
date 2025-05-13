package org.sortic.sorticproject.security;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Mapper.UserMapper;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String userId)
        throws UsernameNotFoundException {

        Users user = userMapper.findByUserId(userId);
        if (user == null) throw new UsernameNotFoundException("User not found");

        /* authority 컬럼이 없다면 ROLE_USER 하나만 부여 */
        return User.withUsername(user.getUserId())
            .password(user.getPassword())
            .roles("USER")
            .build();
    }
}
