// DATA CONTROLLER

var dataController = (function(){
    var Task = function(id, description){
        this.id = id;
        this.description = description;
        this.completed = false; //quand on ajoute une tâche, elle est à faire
    };

    var data = []; 
    var night = false;

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

        getListCheckedIds: function(){
            var res = [];
            for (var indice in data){
                if (data[indice].completed){
                    res.push(data[indice].id);
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
        },

        updateMode: function(boolean){
            night = boolean;
        },

        getMode: function(){
            return night; //true if night mode is on
        }
    }
})();

// UI CONTROLLER

var UIController = (function() {
    var DOMstrings = {
        root: ':root',
        inputDescription:"#input-box",
        container:".tasks",
        taskNumber: "#items-number",
        deleteCross:".delete-item",
        deleteCrossClass:"delete-item",
        box:'box-',//il faut ajouter le numéro
        boxAll:'.box',
        clearcompleted:'#clear',
        tache: '.task',
        completed: '.crossed',
        select:'#select',
        selectClass:'.select',
        nightmode:'#mode',
        light:'.img-light',//la lune s'affiche en mode jour
        dark:'.img-dark',//le soleil s'affiche en mode nuit
        boxDark:'box-dark',
        footer:'#main-footer',
        main:'.main',
        mainDark:'main-dark',
        attribution:'.attribution'
    };

    var background = {
        light: "url('images/bg-desktop-light.jpg')",
        dark:"url('images/bg-desktop-dark.jpg')"
    }

    var show = "all"; // 'all', 'active', 'completed' are the 3 values

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
                    //console.log(DOMstrings.box + data[indice].id.toString());
                    document.getElementById(DOMstrings.box + data[indice].id.toString()).classList.add('crossed');
                } else {
                    document.getElementById(DOMstrings.box + data[indice].id.toString()).classList.remove('crossed');
                }
            }

        },

        getDOMstrings:() => DOMstrings,

        updateShow: function(event){
            show = event.srcElement.id;
            if (show == 'select'){
                return 0;
            }
            var listeSelect = document.querySelectorAll(DOMstrings.selectClass);
            console.log(listeSelect);
            for (var ind in [0,1,2]){
                listeSelect[ind].classList.remove('blueButton');
            }
            document.getElementById(show).classList.add('blueButton');
        },

        updateDisplayTasks: function(liste){
            //On reçoit la liste des id des tâches complétées
            if (show == 'all'){
                // tout afficher
                document.querySelectorAll(DOMstrings.tache).forEach(el => el.style.display = 'flex');
            } else if (show == 'active'){
                // tout afficher puis ne plus afficher les tâches complétées
                document.querySelectorAll(DOMstrings.tache).forEach(el => el.style.display = 'flex');
                document.querySelectorAll(DOMstrings.completed).forEach(el => el.style.display = 'none');
            } else if (show == 'completed'){
                // ne plus afficher tout puis afficher les tâches complétées uniquement
                document.querySelectorAll(DOMstrings.tache).forEach(el => el.style.display = 'none');
                document.querySelectorAll(DOMstrings.completed).forEach(el => el.style.display = 'flex');
            }

        },

        clear: function(){
            document.querySelector(DOMstrings.inputDescription).value = "";
        },

        deleteListItem(selectorId){
            el = document.getElementById('box-' + selectorId.toString());
            el.parentNode.removeChild(el);
        },

        jour: function(){
            // 1. Afficher la lune et cacher le soleil dans le header
            document.querySelector(DOMstrings.light).style.display = 'inline';
            document.querySelector(DOMstrings.dark).style.display = 'none';

            // 2. Changer le background
            document.querySelector(DOMstrings.root).style.backgroundImage = background.light;
            document.querySelector(DOMstrings.root).style.backgroundColor = 'transparent';

            // 3. Retirer la classe box-dark
            var boxList = document.querySelectorAll('.' + DOMstrings.boxDark);
            boxList.forEach(el => el.classList.remove(DOMstrings.boxDark));
        },

        nuit: function(){
            // 1. Afficher le soleil et cacher la lune dans le header
            document.querySelector(DOMstrings.light).style.display = 'none';
            document.querySelector(DOMstrings.dark).style.display = 'inline';

            // 2. Changer le background
            document.querySelector(DOMstrings.root).style.backgroundImage = background.dark;
            document.querySelector(DOMstrings.root).style.backgroundColor = 'hsl(235, 21%, 11%)';
        
            // 3. Ajouter la classe box-dark
            var boxList = document.querySelectorAll(DOMstrings.boxAll);
            boxList.forEach(el => el.classList.add(DOMstrings.boxDark));
            document.querySelector(DOMstrings.inputDescription).classList.add(DOMstrings.boxDark);
            document.querySelector(DOMstrings.footer).classList.add(DOMstrings.boxDark);
            document.querySelector(DOMstrings.attribution).classList.add(DOMstrings.boxDark);

            // 4. Ajouter la classe main-dark
            document.querySelector(DOMstrings.main).classList.add(DOMstrings.mainDark);
        }

    


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

        //Event listener sur le clic sur le bouton "Clear Completed"
        document.querySelector(DOM.clearcompleted).addEventListener('click', CtrlClearCompleted);

        //Event listener sur le clic sur un bouton select
        document.querySelector(DOM.select).addEventListener('click', CtrlDisplay);

        //Event listener sur le clic sur la lune ou le soleil
        document.querySelector(DOM.nightmode).addEventListener('click', CtrlMode);
    };

    var CtrlAddItem = function(){
        var input, newItem, night;

        // 1. Get the field input data
        input = UICtrl.getInput(); /* Description sous forme string*/

        if (input == ""){
            return 0; //on stop si on a une chaine de caractère vide;
        };

        // 1B. Get if mode is night or day
        night = dataCtrl.getMode(); //true if night mode on, false if not.

        // 2. Ajouter la nouvelle Task à data et le récupérer
        newItem = dataCtrl.addTask(input);
        
        // 3. Ajouter newItem à l'UI
        UICtrl.addListItem(newItem, night);

        // 4. Mettre à jour le nombre de tâches à effectuer
        UICtrl.updateNumber(dataCtrl.getTaskNumber());

        // 5. Clear entry field
        UICtrl.clear();

        // 6. Update the UI (if mode is night or day)
        if(night){
            UICtrl.nuit();
        }

        
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
            //console.log(event.srcElement);
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

    var CtrlClearCompleted = function(event){
        // 1. Récupérer la liste des id des éléments cochés
        var liste = dataCtrl.getListCheckedIds();

        // 2. Supprimer ces éléments de data
        liste.forEach(el => dataCtrl.removeTask(el));

        // 3. Supprimer de l'UI tous ces éléments.
        liste.forEach(el => UICtrl.deleteListItem(el));
    }

    var CtrlDisplay = function(event){
        // 1. Modifier la valeur de show dans l'UI
        UICtrl.updateShow(event);

        // 2. Récupérer les id des éléments des éléments completed
        liste = dataCtrl.getListCheckedIds();

        // 3. Mettre à jour l'UI avec la nouvelle valeur de show
        UICtrl.updateDisplayTasks(liste);

    }

    var CtrlMode = function(event){
        DOM = UICtrl.getDOMstrings();
        if(event.srcElement.classList[0] == DOM.light.split('.')[1]){
            // mettre le mode nuit
            console.log('mettre le mode nuit');
            dataCtrl.updateMode(true);
            UICtrl.nuit();

        } else if(event.srcElement.classList[0] == DOM.dark.split('.')[1]){
            //mettre le mode jour
            console.log('mettre le mode jour');
            dataCtrl.updateMode(false);
            UICtrl.jour();
        }
    }

    return{
        test: function(){
            setupEventListeners();
        }
    }
}(dataController, UIController));

controller.test();