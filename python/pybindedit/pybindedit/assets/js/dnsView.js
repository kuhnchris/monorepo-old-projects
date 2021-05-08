function addNewEntry(){
    var entryType = $(".modalEntryType")[0].value;
    $(".modal").modal('hide');
    if (entryType == " "){
        showToast("BIND config","dismissed.");
        return;
    }
    var templRow = $("#template-"+entryType);
    var rowClone = templRow.clone();
    var parentElem = templRow.parent();
    rowClone.appendTo(parentElem);
    rowClone.removeClass("hidden");
    if (entryType == "comment"){
        rowClone.children("#templateCommentFullLine").text(";"+$(".modalComment").val());
    } else if (entryType == "global-opt"){
        rowClone.children("#templateGlobalSettingFullLine").text("$"+$(".modalOption").val());
    } else if (entryType == "entry"){
        rowClone.children("#templateEntrySubdomain").text($(".modalEntrySubDomain").val());
        rowClone.children("#templateEntryTTL").text($(".modalEntryTTL").val());
        rowClone.children("#templateEntryEntryDir").text($(".modalEntryDir").val());
        rowClone.children("#templateEntryEntryType").text($(".modalEntryDomainType").val());
        rowClone.children("#templateEntryTarget").text($(".modalEntryTarget").val());
    }
    showToast("BIND config", "added new line");
}

function deleteRow(){
    this.event.srcElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
}

function evalSelect(){
    var valEntry = this.event.srcElement.selectedOptions[0].value;
    var addSections = document.getElementsByClassName("add_section");
    for (var i = 0; i < addSections.length; i++){
        if (!addSections[i].classList.contains("hidden")){
            addSections[i].classList.add("hidden");
        }
    }
    document.getElementById("div_add_"+valEntry).classList.remove("hidden")

}
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    checkAndGenerateIDs();
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var d = document.getElementById(data);
    ev.currentTarget.parentNode.removeChild(d);
    ev.currentTarget.parentNode.insertBefore(d,ev.currentTarget);
    //debugger;
    //ev.target.appendChild(document.getElementById(data));
}

function checkAndGenerateIDs(){
    var rows = document.getElementsByClassName("row");
    for (var i = 0; i < rows.length; i++){
        if (rows[i].id === "") {
            rows[i].setAttribute("id","row"+i+"GeneratedID");
        }
    }
}

function init(){
    $('.toast').toast({ "delay": 5000 });
    showToast("pyBindEdit","Initialized successfully.");
}

function submitData(){
    targetForm=$("#transmit")
}
