from web3.auto.infura import w3
import web3.exceptions
import json

ERC721MiniABI = [
    {
        "constant": True,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "name", "type": "string"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "symbol", "type": "string"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "tokenURI",
        "outputs": [{"name": "URI", "type": "string"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [{"name": "owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [{"name": "owner", "type": "address"},
                   {"name": "index", "type": "uint256"}],
        "name": "tokenOfOwnerByIndex",
        "outputs": [{"name": "tokenId", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [{"name": "index", "type": "uint256"}],
        "name": "tokenByIndex",
        "outputs": [{"name": "tokenId", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "kudos",
        "outputs": [
            {
                "name": "priceFinney",
                "type": "uint256"
            },
            {
                "name": "numClonesAllowed",
                "type": "uint256"
            },
            {
                "name": "numClonesInWild",
                "type": "uint256"
            },
            {
                "name": "clonedFromId",
                "type": "uint256"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    }
]

import os

if os.path.exists("./kudos") == False:
    os.makedirs("./kudos")

kudosContract = w3.eth.contract(address=w3.toChecksumAddress("0x2aea4add166ebf38b63d09a75de1a7b94aa24163"),
                                abi=ERC721MiniABI)
numBadCalls = 0
counter = 0
while 1 == 1:
    if numBadCalls > 10:
        print("10 bad calls - exiting")
        os._exit(0)

    try:

        if os.path.exists(f"./kudos/{counter}.ipfslink.json"):
            print(f"Kudos ID {counter} already fetched.")
        else:
            contentReply = kudosContract.functions.tokenURI(counter).call()
            with open(f'./kudos/{counter}.ipfslink.json', 'w') as f:
                f.write(contentReply)
                f.close()

            print(f"wrote {counter} IPFS link")
    except web3.exceptions.BadFunctionCallOutput as d:
        print("BadFunctionCall. (done?)")
        numBadCalls = numBadCalls + 1
    except Exception as e:
        print("error.")

    counter = counter + 1

