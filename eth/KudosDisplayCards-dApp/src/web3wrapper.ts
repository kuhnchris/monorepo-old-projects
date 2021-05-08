declare let Web3: any;
import * as U from './utilities';

let utils = U.default;

declare global {
    interface Window {
        web3: any;
        ethereum: any;
    }
}

export default class Web3Wrapper {

    static beginDApp = async function (logicFunction: (account: string) => any) {
        // Modern dapp browsers...
        if (window.ethereum) {
            utils.addLog("found window.ethereum...");
            window.web3 = new Web3(window.ethereum);

        }
        // Legacy dapp browsers...
        else if (window.web3) {
            utils.addLog("found window.web3...");
            window.web3 = new Web3(window.web3.currentProvider);

        }
        // Non-dapp browsers...
        else {
            utils.addLog('Non-Ethereum browser detected. You should consider trying MetaMask!');
            return;
        }

        try {
            // Request account access if needed
            await window.ethereum.enable();
            utils.addLog("account loaded: " + (window.web3.eth.accounts as unknown as Array<string>)[0]);
            logicFunction((window.web3.eth.accounts as unknown as Array<string>)[0]);
        } catch (error) {
            utils.addLog("error calling logicFunction. :-(");
            // User denied account access...
        }

    }

    static enumerateERC721TokenURI = function (contractAddr: string, walletAddr: string, enumerateFunction: any) {
        let ERC721MiniABI = [{
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [{ "name": "name", "type": "string" }],
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [{ "name": "symbol", "type": "string" }],
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [{ "name": "tokenId", "type": "uint256" }],
            "name": "tokenURI",
            "outputs": [{ "name": "URI", "type": "string" }],
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [{ "name": "owner", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "balance", "type": "uint256" }],
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [{ "name": "owner", "type": "address" },
            { "name": "index", "type": "uint256" }],
            "name": "tokenOfOwnerByIndex",
            "outputs": [{ "name": "tokenId", "type": "uint256" }],
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [{ "name": "index", "type": "uint256" }],
            "name": "tokenByIndex",
            "outputs": [{ "name": "tokenId", "type": "uint256" }],
            "type": "function"
        }

        ];
        
        try {
        let ContractObj = window.web3.eth.contract(ERC721MiniABI).at(contractAddr);

        ContractObj.name((err: string, tokenName: string) => { utils.addLog("determined token name for " + contractAddr + ": " + tokenName); });
        ContractObj.symbol((err: string, tokenSymbol: string) => { utils.addLog("determined token symbol for " + contractAddr + ": " + tokenSymbol); });
        ContractObj.balanceOf(walletAddr, (err1: string, bal: number) => {
            utils.addLog("user " + walletAddr + " has " + contractAddr + " token balance of: " + bal);
            for (var i = 0; i < bal; i++) {
                ContractObj.tokenOfOwnerByIndex(walletAddr, i, (err2: string, tokenId: string) => {
                    utils.addLog("user " + walletAddr + " index " + i + " tokenId: " + tokenId);
                    ContractObj.tokenURI(tokenId, (err3: string, URI: string) => {
                        enumerateFunction(tokenId, URI);
                    });
                });
            }
        });
        } catch(e){
            utils.addLog("Error occoured during contract interaction within ERC721Token - "+e);
            debugger;
        }
    }

    static checkBalanceForToken = function (token: string, wallet: string, tokenName: string) {
        let minABI = [
            // balanceOf
            {
                "constant": true,
                "inputs": [{ "name": "_owner", "type": "address" }],
                "name": "balanceOf",
                "outputs": [{ "name": "balance", "type": "uint256" }],
                "type": "function"
            },
            // decimals
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [{ "name": "", "type": "uint8" }],
                "type": "function"
            }
        ];

        // Get ERC20 Token contract instance
        let contract = new window.web3.eth.Contract(minABI, token);

        // Call balanceOf function
        contract.methods["balanceOf"](wallet, (error: string, balance: number) => {
            // Get decimals
            contract.methods["decimals"]((error: string, decimals: number) => {
                // calculate a balance
                balance = balance / (10 ** decimals);
                utils.addLog(balance.toPrecision(3).toString() + " (" + balance.toString() + ") " + tokenName + " for " + wallet);
            });
        });
    }
}