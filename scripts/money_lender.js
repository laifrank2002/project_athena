// interest rate set to this 
// https://docs.google.com/spreadsheets/d/1OKo38R1blO71SGNIVuhaRZ4P2GYPpJQklmOymQiXixQ/edit?hl=en&hl=en#gid=0
// AKA: lloyds of london

var CREDIT_RATINGS = {"NR":{ credit_rating:"Not Rated",max_loan_amount:100*240,risk_premium:0.15}
	,"D":{ credit_rating:"Bankrupt",max_loan_amount:0,interest_premium:0.50}
	,"C":{ credit_rating:"Extreme Risk",max_loan_amount:100*240,interest_premium:0.15}
	,"CC":{ credit_rating:"Extreme Risk",max_loan_amount:200*240,interest_premium:0.10}
	,"CCC":{ credit_rating:"High Risk",max_loan_amount:500*240,interest_premium:0.08}
	,"B":{ credit_rating:"High Risk",max_loan_amount:800*240,interest_premium:0.07}
	,"BB":{ credit_rating:"Medium Risk",max_loan_amount:1000*240,interest_premium:0.05}
	,"BBB":{ credit_rating:"Lower Medium Grade",max_loan_amount:2000*240,interest_premium:0.03}
	,"A":{ credit_rating:"Upper Medium Grade",max_loan_amount:2500*240,interest_premium:0.02}
	,"AA":{ credit_rating:"High Grade",max_loan_amount:3000*240,interest_premium:0.01}
	,"AAA":{ credit_rating:"Prime",max_loan_amount:5000*240,interest_premium:0.00}
};
var Money_lender = (
	function()
	{
		// loan in pence
		
		// fields
		var interest_rate = 0.05;
		var effective_interest_rate;
		
		var credit_rating;
		var max_loan;
		var loaned_amount;
		
		return {
			get loaned_amount() {return loaned_amount},
			
			initialize: function()
			{
				credit_rating = State_manager.get_state("player","credit_rating");
				
				max_loan = CREDIT_RATINGS[credit_rating].max_loan_amount;
				effective_interest_rate = CREDIT_RATINGS[credit_rating].risk_premium + interest_rate;
				loaned_amount = State_manager.get_state("player","loaned_amount");
				console.log(max_loan);
			},
			
			close_day: function()
			{
				// ticked per day interest
				loaned_amount = loaned_amount * Math.pow(1+effective_interest_rate,(1/Time_converter.DAYS_PER_AVERAGE_YEAR));
			},
			
			borrow: function(amount)
			{
				var loan_amount = amount;
				if(loaned_amount + amount > max_loan)
				{
					var loan_amount = max_loan - loaned_amount;
				}
				State_manager.add_state("player","money",loan_amount);
				loaned_amount += loan_amount;
			},
			
			repay: function(amount)
			{
				var repay_amount = amount;
				if(loaned_amount - amount < 0)
				{
					repay_amount = loaned_amount;
				}
				
				if(State_manager.get_state("player","money") < repay_amount)
				{
					repay_amount = State_manager.get_state("player","money");
				}
				
				State_manager.add_state("player","money",-repay_amount);
				loaned_amount -= repay_amount;
			},
			
			/**
				In case we have multiple structured debts.
			 */
			get_total_debts_value: function()
			{
				return loaned_amount;
			},
		}
	}
)();