package main

import "errors"


var AuthError = errors.New("Unauthorized")

func Authorized()