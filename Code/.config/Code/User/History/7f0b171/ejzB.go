package main

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main(){
	db, err := sql.Open("mysql", "root:@tcp(:3306)/test")
    if err!=nil{
        log.Fatal(err)
    }

    defer db.Close()

    _, err = db.Exec("CREATE TABLE IF NOT EXISTS test.hello(world varchar(50))")
    if err!=nil{
        log.Fatal(err)
    }
    
}