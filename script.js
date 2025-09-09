const http=require("http")
const fs=require("fs")
const path=require("path")
const url=require("url")
const { json } = require("stream/consumers");
const { error } = require("console");

const PORT=4000;

const DATA_FILE=path.join(__dirname, "todo.json");


function readTodo(){
    const data=fs.readFileSync(DATA_FILE,"utf8");
    return data==="" ? [] : JSON.parse(data);
}

function writeTodo(todo){
    fs.writeFileSync(DATA_FILE,JSON.stringify(todo,null,2));
}
const server=http.createServer((req, res)=>{

    // console.log("Hi", req.url, req.method)
    // get all todo return to postman
    let pathname= req.url;
    let method= req.method;

    // console.log(pathname);

    if(pathname==="/" && method==="GET"){
        let getData=JSON.stringify(readTodo());
        res.end(getData); 
    }

    if(pathname==="/" && method==="POST"){
        let body="";
        req.on("data", (chunk)=>{body+=chunk.toString();})
        req.on("end", ()=>{
            let {title} =JSON.parse(body);
            if(!title){
                res.end(JSON.stringify({
                    error: "Title Required"}));
                    return
            }
            else{
                let todo=readTodo();
                let todoNew={
                   title: title,
                id: todo.length + 1,
                completed: false,
                }
                todo.push(todoNew);
                writeTodo(todo);
                res.end(JSON.stringify({Success: "Todo Added"}));
            }
                
            
        });
    }
    if (pathname === "/" && method === "DELETE") {
        let body = "";
        req.on("data", (chunk) => (body += chunk.toString()));
        req.on("end", () => {
        let { id } = JSON.parse(body);
        let todo = readTodo;
        todo = todo.filter((item) => item.id !== Number(id));
        writeTodo(todo);
        res.end(JSON.stringify({ success: "Todo deleted successfully" }));

    });
    }
     if (url === "/" && method === "PATCH") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      let { id, title } = JSON.parse(body);
      if (id && title) {
        let todo = readTodo();
        todo.forEach((item) => {
          if (item.id === Number(id)) {
            item.title = title;
          }
        });
        writeTodo(todo);
        res.end(JSON.stringify({ success: "Todo updated successfully" }));
      } else {
        res.end(
          JSON.stringify({ error: "please provide id and updated title" })
        );
      }
    });
  }


})
server.listen(PORT, () => {
    console.log(
        `Server is running-> ${PORT} `
    );
    
})