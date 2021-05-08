import { default as Box } from '3box';
import React, { Component } from 'react';
import HDWalletProvider from 'truffle-hdwallet-provider';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Web3 from 'web3';

export class ThreeBoxDisplayExample extends Component {
    constructor(props) {
        super(props);
        var that = this;
        that._j3BoxData = "";
        that._j3BoxData2 = "";
        that.provider = new HDWalletProvider("3f841bf589fdf83a521e55d51afddc34fa65351161eead24f064855fc29c9580","https://rinkeby.infura.io/v3/feec03095a784d5b93f3eee801114636")
        Box.getProfile(this.props["ethaddr"]).then(function (res) {
            that._j3BoxData = res;
            that.forceUpdate();

            that._j3BoxData2 = Box.openBox("0xc515DB5834d8f110Eee96C3036854DBF1d87DE2b",that.provider).private.set("fuck","me");

        });
    }
    render() {
        var v = require("util");
        return (
            <View>
            <Text>ThreeBox Address:</Text>
            <Text>{this.props["ethaddr"]}</Text>
            <Text>{v.inspect(this._j3BoxData)}</Text>
            <Text>{v.inspect(this._j3BoxData2)}</Text>
            </View>
        );
    }
}