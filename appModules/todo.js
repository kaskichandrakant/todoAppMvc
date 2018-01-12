const Item = require('./item.js');
class todo {
  constructor(title,description) {
    this.title=title;
    this.description=description;
    this.items={};
  }
  addItem(task) {
    this.items[task]=new Item(task);
  }
  getTitle(){
    return this.title;
  }
  getDescription(){
    return this.description;
  }
  changeTitle(newTitle){
    this.tite=newTitle;
  }
  changeDescription(newDes){
    this.description=newDes;
  }
  removeItem(task){
    delete this.items[task]
  }
  taskDone(task){
    let currentTask=this.items[task];
    currentTask.markDone();
  }
  taskNotDone(){
    let currentTask=this.items[task];
    currentTask.markNotDone();
  }
}
