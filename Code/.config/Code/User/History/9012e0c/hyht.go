package main

import (
	"arctan/studnt/internal/config"
	"log"
	"net/http"
	"os"
	"os/signal"
)

func main() {
	cfg := config.MustLoad()

	router := http.NewServeMux()

	router.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello API"))
	})

	server := http.Server{
		Addr:    cfg.Addr,
		Handler: router,
	}

	log.Printf("Server started on port http://%s\n", cfg.Addr)

	done := make(chan os.Signal,1)
	signal.Notify(done, os.Interrupt)

	go func() {
		err := server.ListenAndServe()
		if err != nil {
			log.Fatal("Failed to start server")
		}
	}()
	<-done
}
