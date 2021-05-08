pragma solidity ^0.5.0;


contract SubdomainProvider {
    function stringToBytes32(string memory source) pure public returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    enum dnsType {
        A, AAAA, MX, NS, CNAME, DNSKEY, IPSECKEY, NSEC, OPENPGPKEY, PTR, RP, SOA, SRV, TA, TXT
    }
    struct DNSEntry {
        bytes32 entryName;
        dnsType entryType;
        bytes32 entryValue;
        bool isActive;
        uint256 nextEntry;
        bool hasNext;
    }
    
    struct SubdomainEntry {
        bytes32 subdomainName;
        address owner;
        mapping(uint256 => DNSEntry) entries;
        uint256 cost;
        uint256 numOfEntries;
    }
    
    address public owner;
    uint256 public defaultCost;
    bytes32 public domainName;
    uint numOfDomains;
    mapping(uint => SubdomainEntry) public registeredSubdomains;
    mapping(address => uint) public funds;
    
    function () external payable {
        funds[msg.sender] = funds[msg.sender] + msg.value;
    }
    
     constructor(uint256 defaultDomainCost, bytes32 _domainName) public{
        defaultCost = defaultDomainCost;
        owner = msg.sender;
        numOfDomains = 1;
        domainName = _domainName;
        
        SubdomainEntry storage dom = registeredSubdomains[numOfDomains];
        dom.owner = msg.sender;
        dom.subdomainName = "";
        dom.cost = 0;
        dom.numOfEntries = 1;
        DNSEntry storage domEntry = dom.entries[dom.numOfEntries];
        dom.numOfEntries++;
        domEntry.entryName = "";
        domEntry.entryValue = stringToBytes32("eth-controlled by subdomainprovider contract");
        domEntry.entryType = dnsType.TXT;
        domEntry.nextEntry = 0;
        domEntry.hasNext = false;
        numOfDomains++;
    }
    
    /*function getDNSEntry(bytes32 subdomain){
        
    }*/
    function getSubdomainByName(bytes32 subdomain) public view returns(bytes32, address, uint256, uint256) {
        for(uint i = 1; i < numOfDomains; i++){
            if (keccak256(abi.encode(registeredSubdomains[i].subdomainName)) == keccak256(abi.encode(subdomain))){
                return getSubdomainById(i);
            }
        }
        //return ("none found", 0x0, 0, 0);
    }
    function getSubdomainEntryIndexByName(uint256 subdomainId, bytes32 subdomainEntryName, dnsType subdomainType) public view returns(uint256) {
        SubdomainEntry storage dom = registeredSubdomains[subdomainId];
        for(uint i = 1; i < dom.numOfEntries; i++){
            if (keccak256(abi.encode(dom.entries[i].entryName)) == keccak256(abi.encode(subdomainEntryName)) && dom.entries[i].entryType == subdomainType){
                return i;
                //ret[i] = dom.entries[i].subdomainValue;
            }
        }
        return 0;
    }
    
    // returns next value or 0
    function getNextSubdomainEntryIndex(uint256 subdomainId, uint256 subdomainEntryId) public view returns(uint256 ret) {
        DNSEntry storage domEntry = registeredSubdomains[subdomainId].entries[subdomainEntryId];
        return domEntry.nextEntry;
    }
   function hasNextSubdomainEntry(uint256 subdomainId, uint256 subdomainEntryId) public view returns(bool ret) {
        DNSEntry storage domEntry = registeredSubdomains[subdomainId].entries[subdomainEntryId];
        return domEntry.hasNext;
    }
   function getSubdomainEntryById(uint256 subdomainId, uint256 subdomainEntryId) public view returns(bytes32, dnsType, bytes32, bool, uint256, bool) {
        DNSEntry storage domEntry = registeredSubdomains[subdomainId].entries[subdomainEntryId];
        return (domEntry.entryName, domEntry.entryType, domEntry.entryValue, domEntry.isActive, domEntry.nextEntry, domEntry.hasNext);
    }
    function getSubdomainById(uint256 subdomainId) public view returns(bytes32, address, uint256, uint256) {
        SubdomainEntry storage domEntry = registeredSubdomains[subdomainId];
        return (domEntry.subdomainName, domEntry.owner, domEntry.cost, domEntry.numOfEntries);
    }
    
    function changeDNSEntry(uint256 subdomainId, uint256 subdomainEntryId, bytes32 subdomainEntryValue) public{
        assert (registeredSubdomains[subdomainId].owner == msg.sender || owner == msg.sender);
        registeredSubdomains[subdomainId].entries[subdomainEntryId].entryValue = subdomainEntryValue;
    }
    function addNewDNSEntry(uint256 subdomainId, bytes32 subdomainEntryName, dnsType subdomainEntryType, bytes32 subdomainEntryValue) public returns(uint256 newIdx)
    {
        require(registeredSubdomains[subdomainId].owner == msg.sender || owner == msg.sender);
        SubdomainEntry storage dom = registeredSubdomains[subdomainId];
        DNSEntry storage domEntry = dom.entries[dom.numOfEntries];
        dom.numOfEntries++;
        domEntry.entryName = subdomainEntryName;
        domEntry.entryValue = subdomainEntryValue;
        domEntry.entryType = subdomainEntryType;
        domEntry.nextEntry = getSubdomainEntryIndexByName(subdomainId,subdomainEntryName,subdomainEntryType);
        while (hasNextSubdomainEntry(subdomainId,domEntry.nextEntry)) { 
            domEntry.nextEntry = getSubdomainEntryIndexByName(subdomainId,subdomainEntryName,subdomainEntryType);
        }
        if (domEntry.nextEntry > 0) {
            DNSEntry storage prevDomEntry = dom.entries[domEntry.nextEntry];
            prevDomEntry.hasNext = true;
            prevDomEntry.nextEntry = dom.numOfEntries-1;
            domEntry.nextEntry = 0;
        }
        return dom.numOfEntries-1;
        //domEntry.nextEntry = 0;
    }
    
    
}