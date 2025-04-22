package main

import (
	"fmt"
	"os"
)

func main(){
	arg := os.Args
	fmt.Println(arg)
	if len(arg) < 2 {
		fmt.Println("Usage: go run main.go <filename>")
		return
	}

	filename := arg[1]
	file, err := os.Open(filename)
	if err != nil {
		fmt.Println("Error opening file")
		return
	}
	defer file.Close()

	var source []byte
	_, err = file.Read(source)
	if err != nil {
		fmt.Println("Error Reading file")
		return
	}

	s := NewScanner(string(source))
	s.ScanTokens()

	for ran s.tokens
}