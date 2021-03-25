// DATA CONTROLLER

var dataController = (function(){
    var Task = function(id, description){
        this.id = id;
        this.description = description;
        this.completed = false; //quand on ajoute une tâche, elle est à faire
    };

    var data = []; 

    /* 
    data = [{
        description: "faire la vaiselle",
        id: 0,
        completed: false

    },
    {   description = "faire le ménage",
        id: 1,
        completed: true
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

        removeTask:function(idNumber){
            var indice;
            data.forEach(function(element, ind){
                if (element.id == idNumber){
                    indice = ind;
                }
            });
            data.splice(indice,1);
            return 0;
        },

        getTaskNumber: function(){
            var res = 0;
            for (var indice in data){
                if(data[indice].completed == false){
                    res ++;
                }
            }
            return res;
        },

        getData: function(){
            return data;
        },

        updateData: function(){
            // Permet de passer le fait que les cases soient cochées dans data
            for (var indice in data){
                data[indice].completed = document.getElementById('checkbox-' + data[indice].id).checked;
            }
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
        deleteCrossClass:"delete-item",
        box:'box-'//il faut ajouter le numéro
    };

    return {
        getInput: function() {
            return document.querySelector(DOMstrings.inputDescription).value;/*la description sous forme de string*/
        },

        addListItem: function(item) {
            var html, newHtml;

            html = '<div class="box task" id="box-%id%"><div class="checkbox-container round"><input type="checkbox" id="checkbox-%id%" /><label for="checkbox-%id%"></label></div><div class="item-description">%description%</div><div class="delete-item"><img src="images/icon-cross.svg"></div></div>';
            newHtml = html.replace('%description%', item.description);
            newHtml = newHtml.replace('%id%', item.id.toString());
            newHtml = newHtml.replace('%id%', item.id.toString());
            newHtml = newHtml.replace('%id%', item.id.toString());
            //on fait 3 fois pour remplacer les 3 occurences de id dans l'html

            //insert html into the DOM
            document.querySelector(DOMstrings.container).insertAdjacentHTML('beforeend', newHtml);
        },

        updateNumber: function(number){
            document.querySelector(DOMstrings.taskNumber).innerHTML = number;
        },

        updateCompletedTasks(data){
            for (var indice in data){
                if (data[indice].completed){
                    //il faut barrer la tâche
                    console.log(DOMstrings.box + data[indice].id.toString());
                    document.getElementById(DOMstrings.box + data[indice].id.toString()).classList.add('crossed');
                } else {
                    document.getElementById(DOMstrings.box + data[indice].id.toString()).classList.remove('crossed');
                }
            }

        },

        getDOMstrings:function(){
            return DOMstrings;
        },

        deleteListItem(selectorId){
            el = document.getElementById('box-' + selectorId.toString());
            el.parentNode.removeChild(el);
        },


    }
})();

// GLOBAL APP CONTROLLER

var controller = (function(dataCtrl, UICtrl){
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();

        //Event listener sur la touche entrée
        document.addEventListener('keypress', function(event){
            if(event.key == 'Enter'){
                CtrlAddItem();
            }
        });

        //Event listener sur le clic dans le container (pour supprimer les tâches)
        document.querySelector(DOM.container).addEventListener('click', CtrlDeleteItem);
        
        //Event listener sur le clic dans le container (pour vérifier les tâches cochées)
        document.querySelector(DOM.container).addEventListener('click', CtrlCompleteItem);
    };

    var CtrlAddItem = function(){
        var input, newItem;


        // 1. Get the field input data
        input = UICtrl.getInput(); /* Description sous forme string*/

        if (input == ""){
            return 0; //on stop si on a une chaine de caractère vide;
        };

        // 2. Ajouter la nouvelle Task à data et le récupérer
        newItem = dataCtrl.addTask(input);
        
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
            //console.log(event);
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

    var CtrlCompleteItem = function(event){
        var id, DOM;
        DOM = UICtrl.getDOMstrings();

        // 1. Vérifier qu'il s'agit d'une tâche cochée ou décochée.
        if(event.srcElement.type == 'checkbox'){
            console.log(event.srcElement);
        } else {
            return 0;
        }

        // 2. Mettre à jour les données 
        dataCtrl.updateData();

        // 3. Mettre à jour l'UI sur les completed tasks
        UICtrl.updateCompletedTasks(dataCtrl.getData());

        // 4. Mettre à jour le nombre de tâches à effectuer
        UICtrl.updateNumber(dataCtrl.getTaskNumber());
    }

    return{
        test: function(){
            setupEventListeners();
        }
    }
}(dataController, UIController));

controller.test();