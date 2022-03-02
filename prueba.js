var global = "Global Variable"; //Define global variable outside of function

function setGlobal(){
       global = "Hello World!";
};
setGlobal();
console.log(global);