package main

import (
	"arctan/studnt/internal/config"
	"net/http"
)

func main(){
	cfg := config.MustLoad()

	router := http.NewServeMux()
}