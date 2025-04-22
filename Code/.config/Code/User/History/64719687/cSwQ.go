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
	os.Open(filename)
}