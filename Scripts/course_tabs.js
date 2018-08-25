function openYear(evt, year) {
    var tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.add("displayNone");
    }

    tablinks = document.getElementsByClassName("tab");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className =
        tablinks[i].className.replace(" active", "")
    }

    document.getElementById(year).classList.remove("displayNone");
    evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();
