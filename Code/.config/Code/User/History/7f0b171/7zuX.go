package main

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main(){
	db, err := sql.Open("mysql", "arctan:@tcp(:3306)/test")
    if err!=nil{
        log.Fatal(err)
    }

    defer db.Close()

    _, err = db.Exec("CREATE TABLE IF NOT EXISTS test.hello(world varchar(50))")
    if err!=nil{
        log.Fatal(err)
    }

    res,err := db.Exec("INSERT INTO test.hello(world) VALUES('hello world!')")
    if err!=nil{
        log.Fatal(err)
    }

    rowCount, err := res.RowsAffected()
    if err!=nil{
        log.Fatal(err)
    }

    log.Printf("inserted %d rows", rowCount)

    rows, err := db.Query("SELECT * FROM test.hello")
    if err!=nil{
        log.Fatal(err)
    }

    for rows.Next() {
        var s string

        err = rows.Scan(&s)
        if err!=nil{
            log.Fatal(err)
        }
        log.Printf("found row %q", s)
    }
    rows.Close()
}