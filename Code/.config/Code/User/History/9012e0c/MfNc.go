package main

import (
	"arctan/studnt/internal/config"
	"net/http"
)

func main(){
	cfg := config.MustLoad()

	router := http.NewServeMux()

	router.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello API"))
	})
}