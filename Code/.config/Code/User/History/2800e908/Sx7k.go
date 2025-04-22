package main

import (
	"fmt"
	"net/http"
	"time"
)

type Login struct {
	HashedPassword string
	SessionToken   string
	CSRFToken      string
}

var users = map[string]Login{}

func main() {
	http.HandleFunc("/", home)
	http.HandleFunc("/register", register)
	http.HandleFunc("/login", login)
	http.HandleFunc("/logout", logout)
	http.HandleFunc("/protected", protected)
	http.ListenAndServe(":8080", nil)
}

func home(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, World!")
}

func register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid Method", http.StatusMethodNotAllowed)
		return
	}
	username := r.FormValue("username")
	password := r.FormValue("password")

	if len(username) < 8 || len(password) < 8 {
		http.Error(w, "Invalid username/password", http.StatusNotAcceptable)
		return
	}
	if _, ok := users[username]; ok {
		http.Error(w, "username already exists", http.StatusConflict)
		return
	}

	hashedpass, err := HashedPassword(password)
	if err != nil {
		http.Error(w, "Internal Server error", http.StatusInternalServerError)
		return
	}

	users[username] = Login{HashedPassword: hashedpass}

	fmt.Fprintf(w, "User registered successfully!")
}

func login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid Method", http.StatusMethodNotAllowed)
		return
	}
	username := r.FormValue("username")
	password := r.FormValue("password")

	if len(username) < 8 || len(password) < 8 {
		http.Error(w, "Invalid username/password", http.StatusNotAcceptable)
		return
	}

	user, ok := users[username]

	if !ok || !checkPasswordHash(password, user.HashedPassword) {
		http.Error(w, "Invalid username/password", http.StatusUnauthorized)
		return
	}

	sessionToken := generateToken(32)

	http.SetCookie(w, &http.Cookie{
		Name: "session_token",
		Value: sessionToken,
		HttpOnly: true,
		Expires: time.Now().Add(24 * time.Hour),

	})

	csrfToken := generateToken(32)

	http.SetCookie(w, &http.Cookie{
		Name: "csrf_token",
		Value: csrfToken,
		Expires: time.Now().Add(24*time.Hour),
		HttpOnly: false,
	})

	user.CSRFToken = csrfToken
	user.SessionToken = sessionToken
	users[username] = user

	fmt.Fprintf(w, "Login successful %s", username)

}

func protected(w http.ResponseWriter, r *http.Request){
	err := Authorized(r)
	if err!=nil{
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	
	fmt.Fprintf(w, "logged in")
}

func logout(w http.ResponseWriter, r *http.Request) {
	err := Authorized(r)
	if err!=nil{
		http.Error(w, "Unauht", http.StatusUnauthorized)
		return 
	}

	http.SetCookie(&http.Cookie{
		Name: "session_token",
		Value: "",
		Expires: time.Now().Add(-time.Hour),
		HttpOnly: true,
	})

	http.SetCookie(w, &http.Cookie{
		Name: "session_token",
		Value: "",
		Expires: time.Now().Add(-time.Hour),
		HttpOnly: true,
	})
}
