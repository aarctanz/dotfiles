package main

type TokenType string

const (
	// Single-character tokens.
	LEFT_BRACKET TokenType = "LEFT_BRACKET"
	RIGHT_BRACKET TokenType = "RIGHT_BRACKET"
	LEFT_BRACE TokenType = "LEFT_BRACE"
	RIGHT_BRACE TokenType = "RIGHT_BRACE"
	COMMA TokenType = "COMMA"
	DOT TokenType = "DOT"
	MINUS TokenType = "MINUS"
	PLUS TokenType = "PLUS"
	SEMICOLON TokenType = "SEMICOLON"
	EXPONENT TokenType = "EXPONENT"

	// One or more character tokens.
	BOOLEAN TokenType = "BOOLEAN"
	NULL TokenType = "NULL"
	STRING TokenType = "STRING"
	NUMBER TokenType = "NUMBER"
	EOF TokenType = "EOF"
)

type Token struct{
	type_ TokenType
	lexeme string
	value interface{}
	line int
}

type Scanner struct  {
	source string
	tokens []Token
	start int
	current int
	line int
}