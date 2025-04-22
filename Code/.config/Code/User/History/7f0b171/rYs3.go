package main

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main(){
	db, err := sql.Open("mysql", "arctan:arcmrio@tcp(:3306)/test")
    if err!=nil{
        log.Fatal(err)
    }

    defer db.Close()
    err = db.Ping()
    if err!=nil{
        log.Fatal(err)
    }

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

    if err = rows.Err(); err!=nil{
        log.Fatal(err)
    }
    rows.Close()

    var s string
    err = db.QueryRow("select * from hello.world limit 1").Scan(&s)
    if err!=nil{
        if err==sql.ErrNoRows{
            log.Println("NO rows")
        } else {
            log.Fatal(err)
        }
    }
    log.Println("found row ", s)
}