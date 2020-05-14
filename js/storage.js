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

    let tempB = document.createElement('button')
    tempB.addEventListener("click", function() {
        document.body.removeChild(tempS)

        localStorageArray.splice(tempS.id, 1);
        updateLocalStorage();
    })
    tempB.className = 'deleteButton'
    tempB.innerText = 'X'

    let colorChange = document.createElement("input")
    colorChange.type = "color";
    colorChange.addEventListener("change", function() {
        tempS.style.backgroundColor = this.value;
        tempS.style.color = invertColor(this.value);

        localStorageArray[tempS.id][0].color = this.value;
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
        let tasksCreated = (localStorageArray[tempS.id][0].tasks.length)-1
        tasksCreated += 1;

        numTask += 1
        console.log(tasksCreated)
        update();
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

                //the tasksCreated does not change, and is solidified because when this is created, tasksCreated is already assigned a value
                localStorageArray[tempS.id][0].tasks[tasksCreated][0].marked = true;
                updateLocalStorage();
            } else {
                markdone.innerHTML = "Mark as done";
                ntask.markAsUndone();
                this.correspondingTaskEl.style.textDecoration = "none";
                numDone = numDone - 1;
                update();

                localStorageArray[tempS.id][0].tasks[tasksCreated][0].marked = false;
                updateLocalStorage();
            }
        })
        tempTask.appendChild(markdone);
        let hidecompleted = document.createElement("button");
        hidecompleted.innerHTML = "Hide";
        hidecompleted.correspondingTaskEl = tempTask;
        hidecompleted.addEventListener("click", function() {
            if (ntask.completed) {
                this.correspondingTaskEl.style.display = "none";
                numTask = numTask - 1
                numDone = numDone - 1
                update();
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

        //Adds the item to the task array
        localStorageArray[tempS.id][0].tasks.push([{
        	"selection": selection.value,
        	"name": nameIn.value,
        	"date": dateIn.value,
        	"time": timeIn.value,
            "marked": false,
            "position": tasksCreated
        }]);
        updateLocalStorage();
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
function updateLocalStorage() { //Carry it back to the top
	let tempStorage = JSON.stringify(localStorageArray);
	localStorage.array = tempStorage;
}
function localStorageLoad(tempS, arrayItem, hw, cw, test, project, selection, c, t) { //Variables for scoping issues
    try{
        //Loads up the stuff in localStorageArray
        let tasksCreated = -1;
        for (taskQuene=0; taskQuene<localStorageArray[arrayItem][0].tasks.length; taskQuene++)
        {
            tasksCreated += 1;
            let queneObject = localStorageArray[arrayItem][0].tasks[taskQuene][0];
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

                    queneObject.marked = true;
                    updateLocalStorage();
                } else {
                    markdone.innerHTML = "Mark as done";
                    ntask2.markAsUndone();
                    this.correspondingTaskEl.style.textDecoration = "none";
                    numDone -= 1;
                    update();

                    queneObject.marked = false;
                    updateLocalStorage();
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
                if (ntask.completed) {
                    this.correspondingTaskEl.style.display = "none";
                    numTask -= 1
                    numDone -= 1
                    update();
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
    localStorageArray[tempS.id] = [{
        "color": c,
        "teacher": t, //Or subject
        "tasks": []
    }];
    updateLocalStorage();
}