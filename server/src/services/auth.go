package services

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/skygenesisenterprise/aether-shield/server/src/model"
)

type AuthService struct {
	jwtSecret          []byte
	refreshTokenSecret []byte
	users              map[string]model.User
	refreshTokens      map[string]string
}

func NewAuthService(jwtSecret, refreshTokenSecret string) *AuthService {
	return &AuthService{
		jwtSecret:          []byte(jwtSecret),
		refreshTokenSecret: []byte(refreshTokenSecret),
		users:              make(map[string]model.User),
		refreshTokens:      make(map[string]string),
	}
}

func (s *AuthService) Login(username, password string) (*model.LoginResponse, error) {
	user, exists := s.users[username]
	if !exists {
		return nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	token, expiresAt, err := s.generateJWT(user.ID, user.Username)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	refreshToken, err := s.generateRefreshToken(user.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to generate refresh token: %w", err)
	}

	return &model.LoginResponse{
		Token:        token,
		RefreshToken: refreshToken,
		ExpiresAt:    expiresAt,
		User:         user,
	}, nil
}

func (s *AuthService) Logout(refreshToken string) error {
	delete(s.refreshTokens, refreshToken)
	return nil
}

func (s *AuthService) RefreshToken(refreshToken string) (*model.LoginResponse, error) {
	userID, exists := s.refreshTokens[refreshToken]
	if !exists {
		return nil, errors.New("invalid refresh token")
	}

	user, exists := s.getUserByID(userID)
	if !exists {
		return nil, errors.New("user not found")
	}

	newToken, expiresAt, err := s.generateJWT(user.ID, user.Username)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	newRefreshToken, err := s.generateRefreshToken(user.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to generate refresh token: %w", err)
	}

	delete(s.refreshTokens, refreshToken)

	return &model.LoginResponse{
		Token:        newToken,
		RefreshToken: newRefreshToken,
		ExpiresAt:    expiresAt,
		User:         user,
	}, nil
}

func (s *AuthService) GetMe(userID string) (*model.User, error) {
	user, exists := s.getUserByID(userID)
	if !exists {
		return nil, errors.New("user not found")
	}
	return &user, nil
}

func (s *AuthService) ForgotPassword(email string) error {
	for _, user := range s.users {
		if user.Email == email {
			return nil
		}
	}
	return nil
}

func (s *AuthService) ResetPassword(token, newPassword string) error {
	return errors.New("not implemented")
}

func (s *AuthService) ChangePassword(userID, currentPassword, newPassword string) error {
	user, exists := s.getUserByID(userID)
	if !exists {
		return errors.New("user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(currentPassword)); err != nil {
		return errors.New("invalid current password")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	user.Password = string(hashedPassword)
	user.UpdatedAt = time.Now()
	s.users[user.Username] = user

	return nil
}

func (s *AuthService) ValidateToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return s.jwtSecret, nil
	})
}

func (s *AuthService) generateJWT(userID, username string) (string, time.Time, error) {
	expiresAt := time.Now().Add(24 * time.Hour)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"exp":      expiresAt.Unix(),
		"iat":      time.Now().Unix(),
	})

	tokenString, err := token.SignedString(s.jwtSecret)
	if err != nil {
		return "", time.Time{}, err
	}

	return tokenString, expiresAt, nil
}

func (s *AuthService) generateRefreshToken(userID string) (string, error) {
	expiresAt := time.Now().Add(7 * 24 * time.Hour)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"type":    "refresh",
		"exp":     expiresAt.Unix(),
		"iat":     time.Now().Unix(),
	})

	tokenString, err := token.SignedString(s.refreshTokenSecret)
	if err != nil {
		return "", err
	}

	s.refreshTokens[tokenString] = userID
	return tokenString, nil
}

func (s *AuthService) getUserByID(userID string) (model.User, bool) {
	for _, user := range s.users {
		if user.ID == userID {
			return user, true
		}
	}
	return model.User{}, false
}

func (s *AuthService) CreateUser(user model.User, password string) error {
	if _, exists := s.users[user.Username]; exists {
		return errors.New("user already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	user.Password = string(hashedPassword)
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	s.users[user.Username] = user

	return nil
}
