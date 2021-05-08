from slackeventsapi import SlackEventAdapter
from settings import SLACK_SIGNING_SECRET
from flask import Flask, request
import json
import sqlite3

app = Flask(__name__)
slack_events_adapter = SlackEventAdapter(signing_secret=SLACK_SIGNING_SECRET, endpoint="/kudosbot", server=app)

# Slack Events
@slack_events_adapter.on("reaction_added")
def reaction_added(event_data):
    emoji = event_data["event"]["reaction"]
    print(emoji)

@slack_events_adapter.on("message")
def eventMessage(event_data):
    q = f"{event_data['event']['user']}: {event_data['event']['text']}"
    #event_data['event']['text']
    print(q)


# Route(s)
@app.route('/')
def index():
    return 'You cannot access this resources.'


@app.route('/kudosbot_slash/sendkudos', methods=["GET", "POST"])
def sendKudosSlashCommand():
    params = request.form["text"].split(" ")
    kudosId = params.pop()
    if kudosId == None:
        return "Invalid parameters. Please try again."

    conn = sqlite3.connect("kudosdb.sqlite3")
    conn_c = conn.cursor()
    itms = [dict(zip([key[0] for key in conn_c.description], row)) for row in
            conn_c.execute("select * from kudosOnSystem where id = ?", (int(kudosId),)).fetchall()]

    conn_c.close()
    conn.close()

    if len(itms) != 1:
        return f"Invalid parameters (id '{kudosId}' not found). Please try again."

    return f"Please click <https://gitcoin.co/kudos/send/?id={itms[0]['id']}|this> link to start sending the <https://gitcoin.co/kudos/{itms[0]['id']}/|{itms[0]['name']}> kudos."
    #return 'You cannot access this resources.'


@app.route('/kudosbot_slash/findkudos', methods=["GET", "POST"])
def findKudosSlashCommand():
    conn = sqlite3.connect("kudosdb.sqlite3")
    conn_c = conn.cursor()
    itms = [dict(zip([key[0] for key in conn_c.description], row)) for row in
            conn_c.execute("select * from kudosOnSystem").fetchall()]

    conn_c.close()
    conn.close()

    usertags = request.form["text"].split(" ")
    matchedkudos = []
    for itm in itms:
        tagsmatched = 0
        kudostags = itm["tags"].split(" ")
        for tag in kudostags:
            for matchtag in usertags:
                if matchtag == tag:
                    tagsmatched = tagsmatched + 1

        if tagsmatched > 0:
            matchedkudos.append({"id": itm["id"], "name": itm["name"], "matches": tagsmatched})

    rettxt = "You asked me for kudos with the tags: " + request.form["text"] + "\n"
    if len(matchedkudos) > 0:
        from operator import attrgetter,itemgetter
        sorted(matchedkudos, key=itemgetter("matches"))

        rettxt = rettxt + "I found following kudos for your search:\n"
        for ku in matchedkudos[:5]:
            rettxt = rettxt + f'{ku["id"]} - <https://gitcoin.co/kudos/{ku["id"]}/|{ku["name"]}> - matched {ku["matches"]} tags\n'
    else:
        rettxt = rettxt + "No kudos matching your tags found. Maybe try different tags?"

    return rettxt
    #return f"Pong: {json.dumps(request.form)}"
    #return 'You cannot access this resources.'


@app.route('/reload_kudos', methods=["GET", "POST"])
def reloadKudos():
    return 'not implemented'

# Run the server (flask)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=21001)
