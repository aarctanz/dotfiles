package main

import (
	"fmt"
	"os"
)

func main(){

	arg := os.Args
	if len(arg) < 2 {
		fmt.Println("Usage: go run main.go <filename>")
		return
	}

	filename := arg[1]
	source, err := os.ReadFile(filename)
	if err != nil {
		fmt.Println("Error opening/reading file")
		return
	}

	s := NewScanner(string(source))
	s.ScanTokens()

	for _,t := range s.tokens {
		fmt.Printf("t: %v\n", t)
	}
}