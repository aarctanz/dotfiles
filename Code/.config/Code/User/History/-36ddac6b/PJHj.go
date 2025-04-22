package main

import (
	"errors"
	"fmt"
	"net/http"
)


var AuthError = errors.New("Unauthorized")

func Authorized(r *http.Request) error {
	username := r.FormValue("username")

	user, ok := users[username]
	if !ok{
		fmt.Print("here 1")
		return AuthError
	}

	st, err := r.Cookie("session_token")
	if err!=nil || st.Value =="" || st.Value != user.SessionToken {
		fmt.Print("here 2")

		return AuthError
	}

	csrf := r.Header.Get("X-CSRF-Token")
	if csrf != user.CSRFToken || csrf == "" {
		fmt.Print("here 3")

		return AuthError
	}
	return nil
}