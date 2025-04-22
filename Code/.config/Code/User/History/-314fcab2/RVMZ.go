package main

type TokenType string

const (
	// Single-character tokens.
	LEFT_PAREN TokenType = "LEFT_PAREN"
	RIGHT_PAREN TokenType = "RIGHT_PAREN"
	LEFT_BRACE TokenType = "LEFT_BRACE"
	RIGHT_BRACE TokenType = "RIGHT_BRACE"
	COMMA TokenType = "COMMA"
	DOT TokenType = "DOT"
	MINUS TokenType = "MINUS"
	SEMICOLON TokenType = "SEMICOLON"
	
)