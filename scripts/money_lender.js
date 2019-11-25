var Money_lender_handler = (
	function()
	{
		var element = new UIWindow(100,100,300,400,"Money Lender's",true,true);
		
		var fields = {
			title: null,
			credit_rating_label: null,
			interest_rate_label: null,
			
			borrow_money_panel: null,
			
			borrow_money_amount_label: null,
			borrow_money_max_label: null,
			borrow_money_borrow_textfield: null,
			borrow_money_borrow_button: null,
			borrow_money_repay_textfield: null,
			borrow_money_repay_button: null,
			
		};
		Object.assign(element, fields);
		
		var methods = {
			initialize: function()
			{				
				this.credit_rating_label = new UILabel("test","center");
				this.addSubElement(this.credit_rating_label,this.width/2,25);
				
				this.interest_rate_label = new UILabel("test","center");
				this.addSubElement(this.interest_rate_label,this.width/2,50);
				
				this.borrow_money_panel = new UIPanel(0,0,250,200);
				this.addSubElement(this.borrow_money_panel,25,75);
				
				this.borrow_money_amount_label = new UILabel("test","left");
				this.borrow_money_panel.addSubElement(this.borrow_money_amount_label,25,25);
				
				this.borrow_money_max_label = new UILabel("test","left");
				this.borrow_money_panel.addSubElement(this.borrow_money_max_label,25,50);
				
				this.borrow_money_borrow_textfield = new UITextField(100,25);
				this.borrow_money_panel.addSubElement(this.borrow_money_borrow_textfield,25,this.borrow_money_panel.height - 50);
				
				this.borrow_money_borrow_button = new UIButton(75,25,"Borrow",()=>
				{
					Money_lender.borrow(Number(this.borrow_money_borrow_textfield.getText()));
					this.update();
				});
				this.borrow_money_panel.addSubElement(this.borrow_money_borrow_button,150,this.borrow_money_panel.height - 50);
				
				this.borrow_money_repay_textfield = new UITextField(100,25);
				this.borrow_money_panel.addSubElement(this.borrow_money_repay_textfield,25,this.borrow_money_panel.height - 100);
				
				this.borrow_money_repay_button = new UIButton(75,25,"Repay",()=>
				{
					Money_lender.repay(Number(this.borrow_money_repay_textfield.getText()));
					this.update();
				});
				this.borrow_money_panel.addSubElement(this.borrow_money_repay_button,150,this.borrow_money_panel.height - 100);
			},
			
			onshow: function()
			{
				this.update();
			},
			
			update: function()
			{
				if(this.hidden) return;
				this.credit_rating_label.setText(`Credit Rating: ${Money_lender.credit_rating}`);
				this.interest_rate_label.setText(`Interest Rate: ${Money_lender.interest_rate * 100}% / annum`);
				
				this.borrow_money_amount_label.setText(`Borrowed Amount: ${Currency_converter.displayFull(Money_lender.loaned_amount)}`);
				this.borrow_money_max_label.setText(`Max Loan: ${Currency_converter.displayFull(Money_lender.max_loan)}`);
			},
		};
		Object.assign(element, methods);
		
		return element;
	}
)();


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
		var base_interest_rate = 0.05;
		var effective_interest_rate;
		
		var max_loan;
		var loaned_amount;
		
		return {
			get loaned_amount() {return State_manager.get_state("player","loaned_amount")},
			
			get credit_rating() {return State_manager.get_state("player","credit_rating")},
			get interest_rate() {return CREDIT_RATINGS[Money_lender.credit_rating].risk_premium + base_interest_rate},
			get max_loan() {return CREDIT_RATINGS[Money_lender.credit_rating].max_loan_amount},
			
			set credit_rating(value) {return State_manager.set_state("player","credit_rating",value)},
			set loaned_amount(value) {return State_manager.set_state("player","loaned_amount",value)},
			
			initialize: function()
			{
				var credit_rating = State_manager.get_state("player","credit_rating");
				
				max_loan = Money_lender.max_loan;
				effective_interest_rate = Money_lender.interest_rate;
				loaned_amount = State_manager.get_state("player","loaned_amount");
			},
			
			close_day: function()
			{
				// ticked per day interest
				Money_lender.loaned_amount *= Math.pow(1+Money_lender.interest_rate,(1/Time_converter.DAYS_PER_AVERAGE_YEAR));
				// TODO: daily interest payments designed to pay off loan in some number of years;
				Money_lender_handler.update();
			},
			
			borrow: function(amount)
			{
				if(isNaN(amount) || amount === null) return false;
				
				var loan_amount = amount;
				if(Money_lender.loaned_amount + amount > max_loan)
				{
					var loan_amount = max_loan - Money_lender.loaned_amount;
				}
				if(loan_amount > 0)
				{
					State_manager.add_state("player","money",loan_amount);
					Money_lender.loaned_amount += loan_amount;
				}
			},
			
			repay: function(amount)
			{
				if(isNaN(amount) || amount === null) return false;
				
				var repay_amount = amount;
				if(Money_lender.loaned_amount - amount < 0)
				{
					repay_amount = Money_lender.loaned_amount;
				}
				
				if(State_manager.get_state("player","money") < repay_amount)
				{
					repay_amount = State_manager.get_state("player","money");
				}
				
				State_manager.add_state("player","money",-repay_amount);
				Money_lender.loaned_amount -= repay_amount;
			},
		}
	}
)();