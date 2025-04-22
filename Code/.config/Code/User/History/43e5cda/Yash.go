package main

import (
	"golang.org/x/crypto/bcrypt"
)

func HashedPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)

	return string(bytes), err
}

func checkPasswordHash(password, hashp string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashp), []byte(password))
	return err == nil
}

func gene