import 'web3';
import * as $ from 'jquery';
import 'popper.js';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import web3Wrapper from './web3wrapper';
import utilities from './utilities';

import './img/background-space.jpg';
import './style.css';

import * as ko from 'knockout';

interface ModuleImport<T> {
    default: T
}

var DEBUG_ACTIVE = false;

class PersonalDataViewModel {
    firstName: KnockoutObservable<string>
    lastName: KnockoutObservable<string>
    userName: KnockoutObservable<string>
    text: KnockoutObservable<string>
    subtext: KnockoutObservable<string>
    avatar: KnockoutObservable<string>
    lastNameFirstNameOrder: KnockoutObservable<boolean>
    fullName: KnockoutComputed<string>
    ethAddr: KnockoutObservable<string>
    hasEthAddr: KnockoutComputed<boolean>
    constructor() {
        this.lastNameFirstNameOrder = ko.observable(false);
        this.firstName = ko.observable("");
        this.lastName = ko.observable("");
        this.userName = ko.observable("");
        this.text = ko.observable("");
        this.subtext = ko.observable("");
        this.avatar = ko.observable("");
        this.ethAddr = ko.observable("");

        this.hasEthAddr = ko.computed({
            owner: this, read: () => {
                if (this.ethAddr() === "")
                    return false;
                else
                    return true;
            }
        }) as unknown as KnockoutComputed<boolean>;
        this.fullName = ko.computed({
            owner: this, read: () => {
                if (!this.lastNameFirstNameOrder())
                    return this.firstName() + " " + this.lastName();
                else

                    return this.lastName() + " " + this.firstName();
            }
        }) as unknown as KnockoutComputed<string>;


    }

}

$(document).ready(function () {
    let koModel = new PersonalDataViewModel();

    $("#fetchEthAddr").on('click', function (e) {
        if (koModel.hasEthAddr()) return;
        web3Wrapper.beginDApp((account) => {
            koModel.ethAddr(account);
        });
    });

    $("#fetchKudos").on('click', function (e) {
        if (!koModel.hasEthAddr()) return;
        web3Wrapper.beginDApp((account) => {
            web3Wrapper.enumerateERC721TokenURI("0x2aea4add166ebf38b63d09a75de1a7b94aa24163", account, (tokenId: string, URI: string) => {
                utilities.addLog("user " + account + ", tokenId " + tokenId + ", URI: " + URI);
                utilities.ajaxGet(URI, (resp) => {
                    let JSONresp = JSON.parse(resp);
                    if (!JSONresp)
                        return;
                    utilities.addLog("loaded JSON object: " + JSONresp);
                    var imgObj = utilities.createImg(JSONresp.image);
                    imgObj.style.width = "50px";

                    document.getElementById("imageBox").appendChild(imgObj);
                });
            });
        });
    });

    let captureInProgress = false;
    $("#captureBtn").on('click', function (e) {
        if (!koModel.hasEthAddr()) return;

        if (captureInProgress) return;
        else captureInProgress = true;
        //utilities.setBusy(true);
        $("#captureBtn").attr("disabled");
        $("#captureBtn>.spinner-border").removeClass("hidden");
        utilities.setBusy(true, "Lazy-loading 'html2canvas'...");
        (import( /* webpackChunkName: "html2canvas" */ 'html2canvas') as unknown as Promise<ModuleImport<Html2CanvasStatic>>).then((loadedModule: ModuleImport<Html2CanvasStatic>) => {
            utilities.setBusy(false);
            const html2canvas = loadedModule.default;
            html2canvas(document.querySelector(".card"),
                {
                    foreignObjectRendering: true,
                    removeContainer: false,
                    letterRendering: true,
                    allowTaint: true,
                    useCORS: true,
                }).then((canvas: HTMLCanvasElement) => {
                    var cnt = document.getElementById("canvasDisplayModalContent");
                    cnt.innerHTML = "";
                    cnt.appendChild(canvas);
                    $("#canvasDisplayModal").modal();
                    $("#captureBtn").removeAttr("disabled");
                    $("#captureBtn>.spinner-border").addClass("hidden");
                    //utilities.setBusy(false);
                    captureInProgress = false;
                });
        });
    });

    $("#fetchGithubData").on('click', function (e) {
        if (!koModel.hasEthAddr()) return;
        $("#GithubAskModal").modal();
    });

    $("#loadGithubData").on('click', function (e) {
        if (!koModel.hasEthAddr()) return;
        let usernameObj: HTMLInputElement = document.getElementById("githubUserName") as HTMLInputElement;

        utilities.setBusy(true, "Lazy-loading 'github -> @octokit/rest' library...");
        import( /* webpackChunkName: "github" */ './../node_modules/@octokit/rest/index').then((loadedModule) => {
            const Octokit = (loadedModule as any).default ;
            const octokit = new Octokit();
            utilities.setBusy(true, "Fetching github data...");
            octokit.users.getByUsername({ "username": usernameObj.value }).then((ret: any) => {
                koModel.userName(usernameObj.value);
                koModel.firstName(ret.data.name);
                koModel.text(ret.data.bio);
                koModel.subtext(ret.data.html_url);
                koModel.avatar(ret.data.avatar_url);
                utilities.setBusy(false);
                $("#GithubAskModal").modal('hide');
            }).catch((err: any) => {
                alert("Error while fetching data from github: "+ err);
                utilities.setBusy(false);
            });

        });

    });

    $("#fetch3Box").on('click', function (e) {
        if (!koModel.hasEthAddr()) return;
        utilities.setBusy(true);
        import(
            /* webpackChunkName: "3box" */
            '3box').then((loadedModule: any) => {
                const Box = loadedModule.default;
                Box.getProfile(koModel.ethAddr()).then((ret: any) => {
                    koModel.userName(ret.name);
                    koModel.firstName(ret.degree + " " + ret.name);
                    koModel.text(ret.description);
                    koModel.subtext(ret.emoji + " - " + ret.job + " - " + ret.location + " - " + ret.github);
                    koModel.avatar("https://cloudflare-ipfs.com/ipfs/" + ret.avatar[0].contentUrl['/gitcoin/']);
                    //console.log(ret.avatar);
                    utilities.setBusy(false);
                    $("#GithubAskModal").modal('hide');
                });
            });
    });

    $("#clearUserData").on('click', function (e) {
        koModel = new PersonalDataViewModel();
    });


    ko.applyBindings(koModel);
});