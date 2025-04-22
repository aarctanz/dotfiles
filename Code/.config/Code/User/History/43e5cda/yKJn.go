package main

import (
	"golang.org/x/crypto/bcrypt"
)

func hashedPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte{password}, 10)
}