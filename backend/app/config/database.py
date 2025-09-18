import mysql.connector

def get_cursor():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="aeternum"
    )
    
    cursor = mydb.cursor(dictionary=True) 
    return mydb, cursor