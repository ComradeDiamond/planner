/*
ideas: Subjects and TaskContainers need an algorithm to unpack them and sort values into its proper inline-blocks that are appended to a parent element
They should then be attached as a propery of the HTMLElement representing them, so they become referable when processing user input
*/



/*
properties: custom notes, attendance link+time, color coding, meeting site+time, homeworks, classwork, projects, test
methods: 
*/
function Subject(name) { 
    this.name = name;

    this.notes = ""; //custom notes.  obtain from a text box on the interface

    this.attendance = new Task(); //deadline is when teacher wants attendance.  leave undefined if no deadline.  notes is the link to the attendance form.  obtain from a text box on the interface
    this.meeting = new Task(); //deadline is when a meeting is.  notes is location of meeting.  obtain from a text box on the interface

    this.homework = new TaskContainer(); //written to by TaskContainer methods
    this.classwork = new TaskContainer();
    this.project = new TaskContainer();
    this.test = new TaskContainer();

    this.color = "white"; //create a settings section for each subject's front end representation that allows writing to this property to change the subject's color
}



/*
properties: Like an array, but to contain Tasks
methods: sort by due date, add new task
*/
function TaskContainer() {}
TaskContainer.prototype = Array.prototype;

TaskContainer.prototype.sortTasks = function() { //button onclick
    
}
TaskContainer.prototype.addTask = function(name, deadline, time) { //button onclick
    var t = new Task(name, deadline, time);
    this.push(t); 
    return t;
}



/*
properties: due date, custom notes, color coding, completion status (cross off when done)
methods: set reminder for due dates, mark as done
*/
function Task(name, deadline, time) { 
    this.name = name;
    this.deadline = deadline;
    this.time = time;
    this.completed = false;
}
Task.prototype.remind = function(time) { //time comes from a text box on interface
    
}
Task.prototype.markAsDone = function() { //on check of a checkbox
    this.completed = true;
}
Task.prototype.markAsUndone = function() { //opposite of markAsDone
    this.completed = false;
}
