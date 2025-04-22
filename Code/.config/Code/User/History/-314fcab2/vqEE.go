package main


type TokenType string

const (
	// Single-character tokens.
	LEFT_BRACKET  TokenType = "LEFT_BRACKET"
	RIGHT_BRACKET TokenType = "RIGHT_BRACKET"
	LEFT_BRACE    TokenType = "LEFT_BRACE"
	RIGHT_BRACE   TokenType = "RIGHT_BRACE"
	COMMA         TokenType = "COMMA"
	DOT           TokenType = "DOT"
	MINUS         TokenType = "MINUS"
	PLUS          TokenType = "PLUS"
	SEMICOLON     TokenType = "SEMICOLON"
	EXPONENT      TokenType = "EXPONENT"

	// One or more character tokens.
	BOOLEAN TokenType = "BOOLEAN"
	NULL    TokenType = "NULL"
	STRING  TokenType = "STRING"
	NUMBER  TokenType = "NUMBER"
	EOF     TokenType = "EOF"
)

type Token struct {
	type_  TokenType
	lexeme string
	value  interface{}
	line   int
}

type Scanner struct {
	source  string
	tokens  []Token
	start   int
	current int
	line    int
}

func NewScanner(source string) *Scanner {
	return &Scanner{source: source, tokens: []Token{}, start: 0, current: 0, line: 1}
}

func (s *Scanner) isAtEnd() bool {
	return s.current == len(s.source)
}

func (s *Scanner) advance() string {
	c := s.source[s.current]
	s.current += 1
	return string(c)
}

func (s *Scanner) peek() string {
	return string(s.source[s.current])
}

func (s *Scanner) addTokens(typ TokenType, value interface{}) {
	s.tokens = append(s.tokens, Token{type_: typ, lexeme: s.source[s.start:s.current], value: value, line: s.line})
}

func (s *Scanner) scanToken() {

	switch c := s.advance(); c {
	case "\n":
		s.line += 1
	case "{":
		s.addTokens(LEFT_BRACE, nil)
	}
}

func (s *Scanner) ScanTokens() {
	for {
		if s.isAtEnd() {
			break
		}
		s.start = s.current
		s.scanToken()
	}

	s.tokens = append(s.tokens, Token{EOF, "", nil, s.line})
}
