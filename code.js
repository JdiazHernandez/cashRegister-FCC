function checkCashRegister(price, cash, cid) {
    /*
    We are provided with a price(number), cash(number) that is the amount 
    that the customer give us and an array(string,number) 
    with the money we have in the cash register. 
    We will need to provide as output of this function an
    object{status:(string),change:(array[string,number])}.
    */
    var output={status:null,change:[]};
    /* 
    To be able to calculate the change, we will need to convert it
    first into an object, where we also calculate the total.
    */
    var cashRegister = cid.reduce(function(accum, currency) {
        accum.totalCID += currency[1];
        accum.totalCID = Math.round(accum.totalCID * 100) / 100;//Precision errors!
        accum[currency[0]] = currency[1];
        return accum;
      }, { totalCID: 0 });
      /*
      now we need to know what is the value of each of the denominations
      of bills and coins, so we create an object {name:"name", value:(number)}
      */
     var legalValue = [
        { name: "ONE HUNDRED", value: 100.00},
        { name: "TWENTY", value: 20.00},
        { name: "TEN", value: 10.00},
        { name: "FIVE", value: 5.00},
        { name: "ONE", value: 1.00},
        { name: "QUARTER", value: 0.25},
        { name: "DIME", value: 0.10},
        { name: "NICKEL", value: 0.05},
        { name: "PENNY", value: 0.01}
      ];
    /*
     Now we calculate the amount of change due.
     */
     var changeDue=cash-price;
     /*
     We need to handle the obvious lack of cash.
     */
    if (cash<price){
        output.status="INSUFFICIENT_CASH";
        return output;
    }
    /*
    If there is not enough cash on the register to give change
    */
    if (cashRegister.totalCID<changeDue){
        output.status="INSUFFICIENT_FUNDS";
        return output;
    }
    /*
    If we have the exact change
    */
    if (cashRegister.totalCID===changeDue){
        output.status="CLOSED";
        output.change=cid;
        return output
    }
    /*
    At this point we know that we have enough cash to cover the price,
    we have enough total change to cover the changeDue so we need to 
    loop to check in our drawer if we can give exact change regarding the 
    value of each denomination.
    */
    var outputArr = legalValue.reduce(function(accum,currency){
        var acumulatedChange = 0;
        /* while there is each bill/coin on the cid and each one is larger than the changeDue*/
        while(cashRegister[currency.name] > 0 && changeDue >= currency.value){
            changeDue -= currency.value;
            cashRegister[currency.name] -= currency.value;
            acumulatedChange += currency.value;
            changeDue = Math.round(changeDue * 100) / 100; //Precision!
        }
        if(acumulatedChange > 0){
            accum.push([currency.name,acumulatedChange]);
        }
        return accum;
    },[]);

    /* 
    At this point we can have two possible outcomes, 
    if there is not a single coin/bill on the change array or there is still change due,
    */
      if (outputArr.length < 1 || changeDue > 0) {
       output.status = 'INSUFFICIENT_FUNDS';
       return output;
     }
    /*
     or everything has gone correctly and we can handle the change
     */
    output.status="OPEN";
    output.change=outputArr;
    console.log("this is the change due = "+changeDue);
    console.log("this is the total change in the cash register = "+cashRegister.totalCID);
    console.log("this is the output = "+ output.status +" "+ output.change);
    console.log("this is the array of denominations " + cashRegister)
    return output;
    };
    
    
    
