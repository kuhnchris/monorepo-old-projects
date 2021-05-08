import os
import requests
import json
if os.path.exists("./kudosMeta") == False:
    os.makedirs("./kudosMeta")

for f in os.listdir("./kudos"):
    loadPath = f'./kudos/{f}'
    kudosId = f.split('.')[0]
    metaPath = f'./kudosMeta/{kudosId}.json'

    if os.path.exists(metaPath):
        print(f'skipping {kudosId}, data already loaded')
    else:
        with open(loadPath) as o:
            ipfsLink = o.readline()
            o.close()

        if ipfsLink != "":
            response = requests.get(ipfsLink)

            with open(metaPath, 'w') as o:
                contentResponse = json.loads(response.content)
                o.write(json.dumps(contentResponse))
                print(f"wrote to {metaPath}: {json.dumps(contentResponse)}")
                o.close()
