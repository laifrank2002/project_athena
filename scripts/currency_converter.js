/**
	Converts pounds to shillings to pence 
	
	Remember the following 
	1 pound = 20 shillings
	1 shilling = 12 pence
	1 pence = 4 farthings
	1 pound = 4 crowns 
	1 crown = 5 shillings
	
	pence: d
	shillings: s
	pound: pound sign 
	farthings: qua
 */
var Currency_converter = {
	// constants
	POUNDS_TO_PENCE: 240,
	POUNDS_TO_SHILLINGS: 20,
	SHILLINGS_TO_PENCE: 12,
	PENCE_TO_FARTHINGS: 4,
	POUNDS_TO_CROWNS: 4,
	CROWNS_TO_SHILLINGS: 5,
	
	POUND_SIGN: "\u00a3",
	/**
		Takes an integer (will autocast) of a currency, and converts it to all of the denominations in string form of pound,shillings,pence.
		Default assumes that the integer is of pence.
	 */
	displayFull: function(amount, type = "d")
	{
		// convert everything to pence first to make life easier
		var amount_in_pence;
		switch(type)
		{
			case "s":
				amount_in_pence = Currency_converter.SHILLINGS_TO_PENCE * amount;
				break;
			case "d":
			default: 
				amount_in_pence = amount;
				break;
		}
		
		var pounds = Math.floor(Math.abs(amount_in_pence) / (Currency_converter.POUNDS_TO_PENCE));
		var shillings = Math.floor((Math.abs(amount_in_pence) - pounds * Currency_converter.POUNDS_TO_PENCE) / Currency_converter.SHILLINGS_TO_PENCE);
		var pence = Math.round((Math.abs(amount_in_pence) % (Currency_converter.POUNDS_TO_PENCE)) % Currency_converter.SHILLINGS_TO_PENCE);
		
		if(amount_in_pence >= 0)
		{
			return `${Currency_converter.POUND_SIGN}${pounds} ${shillings}s ${pence}d`; 
		}
		else 
		{
			return `-${Currency_converter.POUND_SIGN}${pounds} ${shillings}s ${pence}d`; 
		}
		
	},
}