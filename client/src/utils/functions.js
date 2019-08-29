// Register User
export const getNumberDigit = (number) => {
	number = parseInt(number);
	if(number >= 10) return number;
	return '0'+number;
};
