var theBudgetController = (function(){

    
    var Expense = function(id,description,value){
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1
    }

    Expense.prototype.calculatePercentage = function (incomeTing){
        if (incomeTing > 0){
            this.percentage = Math.round(this.value/incomeTing)*100
        } else{
            this.percentage = -1
        }
        
        Expense.prototype.gebPercentage = function(){
            return this.percentage ;
        }
    };    

    var Income = function(id,description,value){
        this.id = id
        this.description = description
        this.value = value
    }

    var calcTotal = function (type){
        var sum = 0;
        allData.items[type].forEach(function(pussy){
             sum += pussy.value
        })
        allData.totals[type] = sum
    }

  var allData = {
     items:{
         exp : [],
         inc : []
     },
     totals:{
         exp : 0,
         inc : 0
     },
     budget : 0,
     percentage : 0
  } 

  return {
      addItems : function (typo,des,val){

        //create an id 

    if (allData.items[typo].length > 0){
        var ID = allData.items[typo][allData.items[typo].length-1].id+1;
    }

    else{
        var ID = 0;
    }
          var newItems

          if (typo === 'exp'){
             newItems = new Expense(ID,des,val)
          }

          else if (typo === 'inc'){
             newItems = new Income(ID,des,val)
          }
          
          allData.items[typo].push(newItems);
         return newItems
     },

     deleteItemL: function(typo, id) {
      
        
       var idss = allData.items[typo].map(function(current) {
            return current.id;
        });

       var index = idss.indexOf(id);

        if (index !== -1) {
            allData.items[typo].splice(index, 1);
        }
        
    },
  
        
     








      calcBudget : function (){
          calcTotal('inc')
          calcTotal('exp');
          allData.budget =  allData.totals.inc - allData.totals.exp;

          if (allData.totals.inc > 0){
            allData.percentage = Math.round((allData.totals.inc / allData.totals.exp) * 100)
          }else{
              allData.percentage = -1
          }
      
      },

      calcPercentage : function (){
          allData.items.exp.forEach(function(curr){
              curr.calculatePercentage(allData.totals.inc);
          })
      },

      gebPercentages : function (){
          var allpercent = allData.items.exp.map(function(curr){
              return curr.gebPercentage();
          })
          return allpercent;
      },

      getBudget : function (){
return {
    budget : allData.budget,
    totalInc: allData.totals.inc,
    totaExp : allData.totals.exp,
    percentage : allData.percentage
}
    }
  }

  

})();





var theUiController = (function(){
    
var domString ={
    inputType : '.add__type',
    inputDes :  '.add__description',
    inputValue : '.add__value',
    inputBtn : '.add__btn',
    incomeCon : ".income__list",
    expenseCon : ".expenses__list",
    budgetVal : ".budget__value",
    incomeValue : ".budget__income--value",
    expenseValue : ".budget__expenses--value",
    percentageValue : ".budget__expenses--percentage",
    container : '.container',
    expPer : '.item__percentage',
    dateTing : ".budget__title--month",
}

var formatNumber = function(num, type) {
    var numSplit, int, dec, type;
    
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
    }

    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

};

var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
        callback(list[i], i);
    }
};


    return{
        inputTing: function(){
            return{
                 type : document.querySelector(domString.inputType).value,//it'll be inc or exp
                 des : document.querySelector(domString.inputDes).value, // Write anything you want for the inc or exp
                 value :parseFloat(document.querySelector(domString.inputValue).value) // Write any number you want
            }
            
        },

       


        

        theListitems : function (obj , typo){

            //HTML String with placeholder text

        
            if (typo === 'inc'){
                var element = domString.incomeCon;
                var html = '<div class="item clearfix" id="inc-%id%">  <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button></div> </div></div>'
            }

            else if (typo === 'exp') {
                var element = domString.expenseCon;
                var html =  '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>   </div> </div> </div>'
            }
           
            //Replace the placeholder text with the actual data
            var newHtml = html.replace('%id%' , obj.id)
            var newHtml = newHtml.replace ('%description%' , obj.description)
            var newHtml = newHtml.replace ('%value%' , formatNumber(obj.value, typo))

            // DOM TING
           document.querySelector(element).insertAdjacentHTML('beforeend',newHtml); 
        },

        deleteItemsAll : function (selectorID){
            var ele = document.getElementById(selectorID)
            ele.parentNode.removeChild(ele);
        },

        theClearingField : function(){
            var theFields = document.querySelectorAll(domString.inputDes + ', ' + domString.inputValue)

            var theFieldsArr = Array.prototype.slice.call(theFields);

            theFieldsArr.forEach(function(now,i,z){
                now.value = ""
            })

            theFieldsArr[0].focus();

        },

        displayBudget : function(some){
            var type;

            some.budget > 0 ? type = 'inc' : type = 'exp';


            document.querySelector(domString.budgetVal).textContent = formatNumber(some.budget , type);
            document.querySelector(domString.incomeValue).textContent = formatNumber(some.totalInc, type);
            document.querySelector(domString.expenseValue).textContent = formatNumber(some.totaExp, type);
            if (some.percentage > 0){
                document.querySelector(domString.percentageValue).textContent = some.percentage + '%';
            } else {
                document.querySelector(domString.percentageValue).textContent = '---';
            }
        },

        displayPercentages : function(percent){
            var fields = document.querySelectorAll(domString.expPer);

            var  nodeListForEach = function(list,callwara){
                for (var i = 0; i<list.length;i++){
                    callwara(list[i],i)
                }
            }


            nodeListForEach(fields, function(curr,index){
                if (percent[index]>0){
                    curr.textContent = percent[index] + '%'
                }else {
                    curr.textContent = '---'
                }

            })

        },

        gebDomStrings : function(){
            return domString
        },

        displayDate : function(){
            var now,months,month,year;
            
            now = new Date()
            months = ['January' , 'February' , 'March', 'April', 'May', 'June', 'July','August','September','October','November','December']
            month = now.getMonth()
            year = now.getFullYear()
            document.querySelector(domString.dateTing).textContent = months[month] + " " + year
        },

        changeType : function(){
            var fielding = document.querySelectorAll(domString.inputType + ', ' + domString.inputDes + ', ' + domString.inputValue)
            nodeListForEach(fielding, function(curr){
                curr.classList.toggle('red-focus')
            })

            document.querySelector(domString.inputBtn).classList.toggle('red')
        }
            
        
    }

})();


//Global Controller

var theController = (function(budgetCtrl,uiCtrl){

    var setupEventListeners = function() {
        var DOM = uiCtrl.gebDomStrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', addItemsG);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                addItemsG();
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changeType)
            
    };

  

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, typo, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            
            //inc-1
            splitID = itemID.split('-');
            typo = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. delete the item from the data structure
            budgetCtrl.deleteItemL(typo, ID);
            
            // 2. Delete the item from the UI
            uiCtrl.deleteItemsAll(itemID);
            
            // 3. Update and show the new budget
            updateBudget();
            
            // 4. Calculate and update percentages
           percentageBudget();
        }
    };



var budgetCalculate = function(){
budgetCtrl.calcBudget();
var budget = budgetCtrl.getBudget()
uiCtrl.displayBudget(budget);
}


var percentageBudget = function (){
    budgetCtrl.calcPercentage();
    var perbudgetCTRL = budgetCtrl.gebPercentages();
    uiCtrl.displayPercentages(perbudgetCTRL)

}



var addItemsG = function (){
//your Code Ting
var input = uiCtrl.inputTing()

if (input.description !== '' && !isNaN(input.value) && input.value > 0){

    var newItem = budgetCtrl.addItems(input.type, input.des, input.value)
uiCtrl.theListitems(newItem, input.type)
uiCtrl.theClearingField();
budgetCalculate();
percentageBudget();
}

}

return {
    start : function (){
        console.log('your Budget App has Started')
        uiCtrl.displayDate()
        uiCtrl.displayBudget({budget : 0,
            totalInc: 0,
            totaExp : 0,
            percentage : -1})
            setupEventListeners()
    }
}







})(theBudgetController,theUiController);

theController.start()

