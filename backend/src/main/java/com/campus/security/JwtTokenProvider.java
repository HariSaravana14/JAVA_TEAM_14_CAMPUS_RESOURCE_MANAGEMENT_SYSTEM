package com.campus.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

	@Value("${app.jwt.secret}")
	private String jwtSecret;

	@Getter
	@Value("${app.jwt.expiration-ms}")
	private long jwtExpirationMs;

	private Key key;

	@PostConstruct
	void init() {
		byte[] bytes;
		try {
			bytes = Decoders.BASE64.decode(jwtSecret);
		} catch (IllegalArgumentException e) {
			bytes = jwtSecret.getBytes();
		}
		key = Keys.hmacShaKeyFor(bytes);
	}

	public String generateToken(String subject) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + jwtExpirationMs);
		return Jwts.builder()
				.setSubject(subject)
				.setIssuedAt(now)
				.setExpiration(expiry)
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();
	}

	public String getUsernameFromToken(String token) {
		return getAllClaims(token).getSubject();
	}

	public boolean validateToken(String token) {
		try {
			getAllClaims(token);
			return true;
		} catch (Exception e) {
			log.debug("Invalid JWT: {}", e.getMessage());
			return false;
		}
	}

	private Claims getAllClaims(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(key)
				.build()
				.parseClaimsJws(token)
				.getBody();
	}
}
