#define numDigs 5

uint16_t dist = (frame[1] << 8) + frame[0];
char distPrenta[numDigs] = {0};

//  0x10 = 16,   0x10 = 16


void longToChar(char *buf, int longVar, int numDigits = numDigs)
{
	// char skil[fjoldi];

	for(numDigits; numDigits>1; numDigits--){
		buf[numDigits] = tala % 10;
		longVar 	 	= tala / 10;
	}
	// return skil
}




longTochar(distPrenta, dist,);



