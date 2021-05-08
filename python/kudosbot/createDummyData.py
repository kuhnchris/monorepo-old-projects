import sqlite3

conn = sqlite3.connect("kudosdb.sqlite3")
if len(conn.execute("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'kudosOnSystem'").fetchall()) <= 0:
    # create database
    conn.execute("create table kudosOnSystem(id, priceEth, name, tags)")
    conn.commit()


def insertKudosToDatabase(id, name, priceEth, tags):
    if len(conn.execute(
            "SELECT id FROM kudosOnSystem WHERE id = ?", (id,)).fetchall()) <= 0:
        # create entry
        print(f"adding new kudos: {name}")
        conn.execute(
            "INSERT INTO kudosOnSystem VALUES (?,?,?,?)",
            (id, priceEth, name, tags))
        conn.commit()


insertKudosToDatabase(4027, "Summer Beach Bot", "0.02", "summer gitcoin bot beach sea ocean")
insertKudosToDatabase(4020, "App Alliance", "0.02", "application alliance web3 developer dev")
insertKudosToDatabase(321, 'Its a Trap', '0.002', "trap meme just for fun budget")
insertKudosToDatabase(4029, "Evil Genius Bot", "0.02", "star wars bot meme")
