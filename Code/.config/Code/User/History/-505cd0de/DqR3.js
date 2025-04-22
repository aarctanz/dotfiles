function generateOTP(){
	return Math.floor(Math.random() * 9999) + 1000;
}

export { generateOTP }