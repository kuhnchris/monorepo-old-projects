import json
import os
import unicodedata
import re
import requests
import settings

cookies = dict(_simpleauth_sess=settings.SESSION_KEY)
rse = requests.get('https://www.humblebundle.com/api/v1/user/order', cookies=cookies)
#print(rse.text)

def slugify(value):
    """
    Normalizes string, converts to lowercase, removes non-alpha characters,
    and converts spaces to hyphens.
    """
    value = str(value)
    value = unicodedata.normalize('NFKD', value)
    value = re.sub('[^\w\s-]', '', value).strip().lower()
    value = re.sub('[-\s]+', '-', value)
    return value

def download_file(url):
    local_filename = url.split("?")[0].split('/')[-1]
    # NOTE the stream=True parameter below
    with requests.get(url, stream=True, cookies=cookies) as r:
        r.raise_for_status()
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192): 
                if chunk: # filter out keep-alive new chunks
                    f.write(chunk)
                    # f.flush()
    return local_filename

for order_id in [v['gamekey'] for v in rse.json()]:
    orderIdFile = "infos"+os.sep +order_id+".json"
    if not os.path.exists(orderIdFile):
        url = 'https://www.humblebundle.com/api/v1/order/{}?wallet_data=true&all_tpkds=true'.format(order_id)
        rr = requests.get(url, cookies=cookies)
        o = open(orderIdFile,"w")
        o.writelines(json.dumps(rr.json()))
        o.flush()
        o.close()
        rr_j = rr.json()
    else:
        o = open(orderIdFile,"r")
        rr = "".join(o.readlines())
        o.close()  
        rr_j = json.loads(rr);
    
    for prod in rr_j["subproducts"]:
        print(f'# {rr_j["product"]["human_name"]} -> {prod["human_name"]}:')
        for dls in prod["downloads"]:
            for stru in dls["download_struct"]:
                if stru.get("url","") != "":
                    v = stru["url"]["web"]
                    v = v[v.rindex("/")+1:v.index("?")]
                    slugname = slugify(f'{rr_j["product"]["human_name"]}_{prod["human_name"]}_{dls["machine_name"]}') + v
                    print(f'curl "{stru["url"]["web"]}" -o "downloads/{slugname}"')