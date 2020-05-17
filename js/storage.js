function createCard(t, c, callback, arrayItem) {
   // If you want to create existing card, set callback to localStorageLoad.
   // For new cards, set callback to storageArrayAdd

    if (arrayItem != undefined) //This makes arrayItem parameter optional
    {
        console.log("Accessing memory storage");
    }

    numCard += 1;
    let displayDone = true;
      
    let tempS = document.createElement('section')
    tempS.className = 'card'
    tempS.id = numCard;
    tempS.subject = new Subject(t)
    tempS.style.backgroundColor = c
    tempS.style.color = invertColor(c)
    tempS.taskArray = [];

    let tempB = document.createElement('button')
    tempB.addEventListener("click", function() {
        document.body.removeChild(tempS)

        localStorageArray1.splice(tempS.id, 1);
        updateLocalStorage();
    })
    tempB.className = 'deleteButton'
    tempB.innerText = 'X'

    let colorChange = document.createElement("input")
    colorChange.type = "color";
    colorChange.addEventListener("change", function() {
        tempS.style.backgroundColor = this.value;
        tempS.style.color = invertColor(this.value);

        localStorageArray1[tempS.id].color = this.value;
        updateLocalStorage();
    })

    let tempT = document.createElement('h1')
    tempT.className = 'teacher'
    tempT.innerText = t

    let cw = document.createElement('span')
    cw.className = 'assignment'
    cw.assignemnts = tempS.subject.classwork;
    let hw = document.createElement('span')
    hw.className = 'assignment'
    hw.assignemnts = tempS.subject.homework;
    let project = document.createElement('span')
    project.className = 'assignment'
    project.assignemnts = tempS.subject.project;
    let test = document.createElement('span')
    test.className = 'assignment'
    test.assignemnts = tempS.subject.test;

    let selection = document.createElement("select");
    let v1 = document.createElement("option");
    v1.value = "classwork";
    v1.innerHTML = "classwork";
    selection.options.add(v1);

    let v2 = document.createElement("option");
    v2.value = "homework";
    v2.innerHTML = "homework";
    selection.options.add(v2);

    let v3 = document.createElement("option");
    v3.value = "project";
    v3.innerHTML = "project";
    selection.options.add(v3);

    let v4 = document.createElement("option");
    v4.value = "test";
    v4.innerHTML = "test";
    selection.options.add(v4);

    let nameIn = document.createElement("input"); //input fields for adding new tasks
    nameIn.placeholder = "Assignment name";
    nameIn.id = "assignmentInput";
    let dateIn = document.createElement("input");
    dateIn.type = "date";
    dateIn.placeholder = "Due date";
    dateIn.id = "dueDateInput";
    let timeIn = document.createElement("input");
    timeIn.type = "time";
    timeIn.placeholder = "Due time";
    timeIn.id = "dueTimeInput";
    let div = document.createElement("div");
    let toggleBtn = document.createElement("button");
    toggleBtn.innerHTML = 'Toggle Visibility';
    toggleBtn.addEventListener("click", function() {
        if (tempS.style.visibility == "hidden") {
            tempS.style.visibility = "visible";
        } else {
            tempS.style.visibility = "hidden";
            this.style.visibility = "visible";
        }
    })
    let tempBtn = document.createElement("button");

    tempBtn.innerHTML = "Add assignment"
    tempBtn.addEventListener("click", function() {
        numTask += 1
        update();

        //Adds the item to the localStorage's array of tasks
        let currentTask = [{
        	"selection": selection.value,
        	"name": nameIn.value,
        	"date": dateIn.value,
        	"time": timeIn.value,
            "marked": false
        }]
        tempS.taskArray.push(currentTask);
		updateLocalStorage(true, tempS);
        var ntask = tempS.subject[selection.value].addTask(nameIn.value, dateIn.value, timeIn.value);
        let tempTask = document.createElement("div");
        tempTask.innerHTML = "(" + selection.value + ") " + nameIn.value + " " + dateIn.value + " " + timeIn.value; //append new task

        tempTask.task = ntask;

        let markdone = document.createElement("button"); //mark as done
        markdone.innerHTML = "Mark as done";
        markdone.correspondingTaskEl = tempTask;
        
        markdone.addEventListener("click", function() {
            if (markdone.innerHTML == "Mark as done") {
                ntask.markAsDone();
                markdone.innerHTML = "Unmark"
                this.correspondingTaskEl.style.textDecoration = "line-through";
                numDone = numDone + 1
                update();

                //Using indexOf for best match. If two are identical, we just yeet the first one. No biggie b/c they are the same.
                currentTask[0].marked = true;
                tempS.taskArray[tempS.taskArray.indexOf(currentTask)][0].marked = true;

                updateLocalStorage(true, tempS);
            } else {
                markdone.innerHTML = "Mark as done";
                ntask.markAsUndone();
                this.correspondingTaskEl.style.textDecoration = "none";
                numDone = numDone - 1;
                update();

                currentTask[0].marked = true;
               	tempS.taskArray[tempS.taskArray.indexOf(currentTask)][0].marked = false;

                updateLocalStorage(true, tempS);
            }
        })
        tempTask.appendChild(markdone);

        let hidecompleted = document.createElement("button");
        hidecompleted.innerHTML = "Hide";
        hidecompleted.correspondingTaskEl = tempTask;
        hidecompleted.addEventListener("click", function() {
            if (ntask.completed) {
                this.correspondingTaskEl.style.display = "none";
                numTask -= 1
                numDone -= 1
                update();

                tempS.taskArray.splice(tempS.taskArray.indexOf(currentTask), 1);
                updateLocalStorage(true, tempS);
            }    
        })
        tempTask.appendChild(hidecompleted);

        switch (selection.value) {
            case ("homework"):
                var el = hw;
                break;
            case ("classwork"):
                var el = cw;
                break;
            case ("test"):
                var el = test;
                break;
            case ("project"):
                var el = project;
                break;
        }
        el.appendChild(tempTask);
    });

    callback(tempS, arrayItem, hw, cw, test, project, selection, c, t);

    tempS.appendChild(tempB)
    tempS.appendChild(colorChange)
    tempS.appendChild(tempT)

    tempS.appendChild(cw)
    tempS.appendChild(hw)
    tempS.appendChild(project)
    tempS.appendChild(test)

    tempS.appendChild(nameIn);
    tempS.appendChild(dateIn);
    tempS.appendChild(timeIn);
    tempS.appendChild(selection);
    tempS.appendChild(div);
    tempS.appendChild(tempBtn);
    tempS.appendChild(toggleBtn);

    return tempS;
}
function updateLocalStorage(isTask, tempS) { 
	if ((tempS == undefined) && isTask == undefined) //Lazy shortcut
	{
		let tempStorage = JSON.stringify(localStorageArrayf);
		localStorage.setItem("array", tempStorage);
	}
	if (isTask)
	{
        tempStorage = [];
        for (var i=0; i<tempS.taskArray.length; i++) {
            tempStorage[i] = tempS.taskArray[i][0];
        }
        
		localStorageArray1[tempS.id].tasks = tempStorage;
        
		updateLocalStorage();
	}
}
function localStorageLoad(tempS, arrayItem, hw, cw, test, project, selection, c, t) { //Variables for scoping issues
    try{
    	localStorageArray1[arrayItem].tasks = tempS.taskArray;

        //Loads up the stuff in localStorageArray1
        for (taskQuene=0; taskQuene<localStorageArray1[arrayItem].tasks.length; taskQuene++)
        {

            let queneObject = localStorageArray1[arrayItem].tasks[taskQuene];

            let currentTask = [{
        	"selection": queneObject.selection,
        	"name": queneObject.name,
        	"date": queneObject.date,
        	"time": queneObject.time,
            "marked": false //For now, we assume it is false, but change it later
        	}]
        	tempS.taskArray.push(currentTask);

            numTask += 1
            update();
            var ntask2 = tempS.subject[queneObject.selection].addTask(queneObject.name, queneObject.date, queneObject.time);
            let tempTask = document.createElement("div");
            tempTask.innerHTML = "(" + queneObject.selection + ") " + queneObject.name + " " + queneObject.date + " " + queneObject.time; //append new task

            tempTask.task = ntask2;

            let markdone = document.createElement("button"); //mark as done
            markdone.innerHTML = "Mark as done";
            markdone.correspondingTaskEl = tempTask;

            markdone.addEventListener("click", function() {
                if (markdone.innerHTML == "Mark as done") {
                    ntask2.markAsDone();
                    markdone.innerHTML = "Unmark"
                    this.correspondingTaskEl.style.textDecoration = "line-through";
                    numDone += 1
                    update();

                    currentTask[0].marked = true;
                    tempS.taskArray[tempS.taskArray.indexOf(currentTask)][0].marked = true;
                    updateLocalStorage(true, tempS);
                } else {
                    markdone.innerHTML = "Mark as done";
                    ntask2.markAsUndone();
                    this.correspondingTaskEl.style.textDecoration = "none";
                    numDone -= 1;
                    update();

                    currentTask[0].marked = false;
                    tempS.taskArray[tempS.taskArray.indexOf(currentTask)][0].marked = false;

                    updateLocalStorage(true, tempS);
                }
            })
            tempTask.appendChild(markdone);

            if (queneObject.marked)
            {
                markdone.correspondingTaskEl.style.textDecoration = "line-through";
                markdone.innerHTML = "Unmark";
                ntask2.markAsDone();
                numDone += 1;
                update();
            }

            let hidecompleted = document.createElement("button");
            hidecompleted.innerHTML = "Hide";
            hidecompleted.correspondingTaskEl = tempTask;
            hidecompleted.addEventListener("click", function() {
                if (ntask2.completed) {
                    this.correspondingTaskEl.style.display = "none";
                    numTask -= 1
                    numDone -= 1
                    update();

					tempS.taskArray.splice(tempS.taskArray.indexOf(currentTask), 1);
                	updateLocalStorage(true, tempS);
                }
            })
            tempTask.appendChild(hidecompleted);

            switch (selection.value) { //Until it ends, HW will be a thing
                case ("homework"):
                    var el = hw;
                    break;
                case ("classwork"):
                    var el = cw;
                    break;
                case ("test"):
                    var el = test;
                    break;
                case ("project"):
                    var el = project;
                    break;
            }
            el.appendChild(tempTask);
        }
    }
    catch(err)
    {
        console.log(err);
    }
}
function storageArrayAdd(tempS, arrayItem, hw, cw, test, project, selection, c, t){
    localStorageArray1[tempS.id] = {
        "color": c,
        "teacher": t, //Or subject
        "tasks": []
    };
    updateLocalStorage();
}