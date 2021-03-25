// DATA CONTROLLER

var dataController = (function(){
    var Task = function(id, description){
        this.id = id;
        this.description = description;
    };

    var data = []; 

    /* 
    data = [{
        description: "faire la vaiselle",
        id: 0
    },
    {   description = "faire le ménage",
        id: 1
    }]
    */

    return{
        addTask: function(description){
            var newItem, ID;

            //[1 2 4 7] la liste des ID existants, on veut ID = 8;

            if (data.length > 0){
                // si il y a déjà des tâches dans data
                ID = data[data.length - 1].id + 1; 
            } else {
                ID = 0;
            }

            // Build new Task item
            newItem = new Task(ID, description);

            // Push new task into the data structure
            data.push(newItem);

            //return the new task to add it to the UI
            return newItem;
        },

        removeTask(idNumber){
            var indice;
            data.forEach(function(element, ind){
                if (element.id == idNumber){
                    indice = ind;
                }
            });
            data.splice(indice,1);
        },

        getTaskNumber(){
            return data.length;
        }
    }
})();

// UI CONTROLLER

var UIController = (function() {
    var DOMstrings = {
        inputDescription:"#input-box",
        container:".tasks",
        taskNumber: "#items-number",
        deleteCross:".delete-item",
        deleteCrossClass:"delete-item"
    };

    return {
        getInput: function() {
            return document.querySelector(DOMstrings.inputDescription).value;/*la description sous forme de string*/
        },

        addListItem: function(item) {
            var html, newHtml;

            html = '<div class="box task" id="box-%id%"><div class="checkbox-container round"><input type="checkbox" id="checkbox-%id%" /><label for="checkbox-%id%"></label></div><div class="item-description">%description%</div><div class="delete-item"><img src="images/icon-cross.svg"></div></div>';

            newHtml = html.replace('%description%', item.description);
            newHtml = newHtml.replace('%id%', item.id);

            //insert html into the DOM
            document.querySelector(DOMstrings.container).insertAdjacentHTML('beforeend', newHtml);
        },

        updateNumber(number){
            document.querySelector(DOMstrings.taskNumber).innerHTML = number;
        },

        getDOMstrings:function(){
            return DOMstrings;
        },

        deleteListItem(selectorId){
            console.log('box-' + toString(selectorId));
            el = document.getElementById('box-' + selectorId.toString());
            el.parentNode.removeChild(el);
        }
    }
})();

// GLOBAL APP CONTROLLER

var controller = (function(dataCtrl, UICtrl){
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();

        document.addEventListener('keypress', function(event){
            if(event.key == 'Enter'){
                CtrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', CtrlDeleteItem);
    };

    var CtrlAddItem = function(){
        var input, newItem;

        console.log('dans ctrl add item');

        // 1. Get the field input data
        input = UICtrl.getInput(); /* Description sous forme string*/

        console.log('input', input);
        if (input == ""){
            return 0; //on stop si on a une chaine de caractère vide;
        };

        // 2. Ajouter la nouvelle Task à data et le récupérer
        newItem = dataCtrl.addTask(input);
        console.log('newitem',newItem);

        // 3. Ajouter newItem à l'UI
        UICtrl.addListItem(newItem);

        // 4. Mettre à jour le nombre de tâches à effectuer
        UICtrl.updateNumber(dataCtrl.getTaskNumber());
        
    };

    var CtrlDeleteItem = function(event){
        var id, DOM;
        DOM = UICtrl.getDOMstrings();

        // 1. Vérifier qu'il s'agit d'une suppression de tâche
        if(event.srcElement.parentNode.classList.value == DOM.deleteCrossClass){
            console.log(event);
        } else {
            return 0;
        };

        // 2. Récupérer l'id de la tâche
        // sous la forme box-5 on récupère le 5.
        id = event.srcElement.parentNode.parentNode.id.split('-')[1];
        
        // 3. Supprimer la tâche des data
        dataCtrl.removeTask(id);

        // 4. Retirer la tâche supprimée de l'UI
        UICtrl.deleteListItem(id);

        // 5. Mettre à jour le nombre de tâches à effectuer
        UICtrl.updateNumber(dataCtrl.getTaskNumber());


    };

    return{
        test: function(){
            setupEventListeners();
        }
    }
}(dataController, UIController));

controller.test();