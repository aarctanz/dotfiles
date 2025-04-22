package main

import (
	"fmt"
	"net/http"
)

type Login struct {
	HashedPassword string
	SessionToken string
	CSRFToken string
}

var users = map[string]Login{}

func main()  {
	http.HandleFunc("/", home)
	http.HandleFunc("/register", register)
	http.HandleFunc("/login", login)
	http.HandleFunc("/logout", logout)
	http.ListenAndServe(":8080", nil)
}

func home(w http.ResponseWriter, r *http.Request){
	fmt.Fprintf(w, "Hello, World!")
}

func register(w http.ResponseWriter, r *http.Request){
	if r.Method !=http.MethodPost{
		http.Error(w, "Invalid Method", http.StatusMethodNotAllowed)
		return
	}
	username := r.FormValue("username")
	password := r.FormValue("password")

	if(len(username)<8 || len(password) < 8){
		http.Error(w, "Invalid username/password", http.StatusNotAcceptable)
		return
	}
	if _, ok:=users[username]; ok {
		http.Error(w, "username already exists", http.StatusConflict)
		return
	}

	hashedpass, err := HashedPassword(password)
	if err!=nil{
		http.Error(w, "Internal Server error", http.StatusInternalServerError)
		return
	}

	users[username] = Login{HashedPassword: hashedpass}

	fmt.Fprintf(w, "User registered successfully!")
}

func login(w http.ResponseWriter, r* http.Request){
	if r.Method != http.MethodPost{
		http.Error(w, "Invalid Method", http.StatusMethodNotAllowed)
		return
	}
	username := r.FormValue("username")
	password := r.FormValue("password")


	if len(username) < 8 || len(password) < 8 {
		http.Error(w, "Invalid username/password", http.StatusNotAcceptable)
		return
	}

	hashp, _ := HashedPassword(password)

	user, ok := users[username]

	if !ok || !checkPasswordHash(password, user.HashedPassword){

	}

}

func logout(w http.ResponseWriter, r* http.Request){

}