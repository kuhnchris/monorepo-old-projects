import yaml
import sys
import os
import logging

#logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)
theTotalYAML = {}

def yamlAdd(file):
    logging.debug(f"reading YML from {file}...")
    thePartialYAML = yaml.load(open(file).read())
    logging.debug(f"read YML from {file}: {thePartialYAML}")

    if thePartialYAML is None:
      return
    for key in thePartialYAML.keys():
        logging.debug(f"yaml key: {key}")
        if key not in theTotalYAML.keys():
            logging.debug(f"new key in total yaml: {key}")
            theTotalYAML[key] = {}
        if key in theTotalYAML.keys():
            logging.debug(f"key found in total yaml: {key}")
            if isinstance(thePartialYAML[key], dict):
                logging.debug(f"dict: {key} is {thePartialYAML[key]}")
                for entry in thePartialYAML[key]:
                    logging.debug(f"dict-entry: {entry} is {thePartialYAML[key][entry]}")
                    if thePartialYAML[key][entry] is None and entry not in theTotalYAML[key].keys():
                        logging.debug(f"dict-entry: {entry} is {thePartialYAML[key][entry]}, not in total")
                        theTotalYAML[key][entry] = {}
                    else:
                        logging.debug(f"dict-entry: {entry} is {thePartialYAML[key][entry]}, added to total")
                        theTotalYAML[key][entry] = thePartialYAML[key][entry]
            elif 'pop' in dir(thePartialYAML[key]):
                logging.debug(f"array: {key} is {thePartialYAML[key]}")
                for elem in thePartialYAML[key]:
                    theTotalYAML[key].push(elem)
            else:
                logging.debug(f"str: {key} is {thePartialYAML[key]}")
                theTotalYAML[key] = thePartialYAML[key]
        else:
            print("what?")

def recursiveResolution(path):
    if os.path.isdir(path):
        for f in os.listdir(path):
            if os.path.isdir(f"{path}/{f}"):
                recursiveResolution(f"{path}/{f}")
            elif os.path.isfile(f"{path}/{f}"):
                if f == "docker-compose.yml":
                    #print(f"{path}/{f}")
                    yamlAdd(f"{path}/{f}")
            else:
                print(f"DEBUG: not a file & not a dir in that dir {path}: {f} ")

    else:
        pass
        #print(f"DEBUG: not a dir, but called as path in recursiveResolution: {path}")

for arg in sys.argv:
    #print(f"input: {arg}")
    recursiveResolution(arg)

print(yaml.dump(theTotalYAML, default_flow_style=False))

