function initMatch() {
    makeInput("input", "Scouter", "nameInput", [], "preMatch");
    makeInput("input", "Match Number", "matchInput", [], "preMatch");
    makeInput("input", "Team Number", "teamInput", [], "preMatch");
    makeInput("buttonSelect", "Leave", "leave", ["Yes", "No"], "auto");
    makeInput("counter", "Artifacts Classified", "autoArtifactsInGoalClassified", [], "auto");
    makeInput("counter", "Overflow Artifacts", "autoArtifactsInGoalOverflow", [], "auto");
    makeInput("counter", "Artifacts Classified", "teleopArtifactsInGoalClassified", [], "teleop");
    makeInput("counter", "Overflow Artifacts", "teleopArtifactsInGoalOverflow", [], "teleop");
    makeInput("counter", "Artifacts In Depot", "teleopArtifactsInDepot", [], "teleop");
    makeInput("buttonSelect", "Park", "park", ["Robot Partially In Base", "Robot Fully In Base", "Double Parked (raised)", "No Park"], "teleop", " vert");
}

function resetMatch() {
    local.matchData = {};
    setLS();
}

function increment(name) {
    document.getElementById(name).querySelector(".cval").innerHTML = Number(document.getElementById(name).querySelector(".cval").innerHTML) - (Number(document.getElementById(name).querySelector(".cval").innerHTML) == 0 ? 0 : 1);
    local.matchData[name] = document.getElementById(name).querySelector(".cval").innerHTML
}

function decrement(name) {
    document.getElementById(name).querySelector(".cval").innerHTML = Number(document.getElementById(name).querySelector(".cval").innerHTML) + 1;
    local.matchData[name] = document.getElementById(name).querySelector(".cval").innerHTML
}

function inputCondition(name) {

}

function buttonClick (name, option, button) {
    console.log(button)
    local.matchData[name] = option;
    
    inputCondition(name);

    if(button.className == 'selected') { 
        button.className = ''
    } else {
        if(button.parentNode.getElementsByClassName('selected')[0]) {
            button.parentNode.getElementsByClassName('selected')[0].className = '';
        };
        button.className = 'selected' 
    }
}

function makeInput(type, placeholder, name, options, page, xclass) {
    let inputContainer = document.createElement("div");
    inputContainer.innerHTML = `<p>${placeholder}</p>`
    inputContainer.className = "inputCont" + ( xclass || "" )
    local.matchData[name] = local.matchData[name] ? local.matchData[name] : "";
    setLS();
    let container = document.getElementById(page).querySelector(".inputContainer");
    let input = document.createElement(`${type}`);
    input.id = name;
    input.className = `input ${type}`
    //if(input.classList.includes("num")) input.type = "number"
    if(type != "select" || "counter") input.placeholder = placeholder + "...";
    
    setTimeout(() => { if(name === "defense") document.getElementById("defenseRating").parentElement.style.display = (local.matchData["defense"] == "Yes" ? "flex" : "none") }, 1);
    
    switch (name) {
        case "matchInput":
            input.type = "number"
        break;
    }
    
    switch (type) {
        case "select":
            for(let option of options) {
                input.innerHTML += `<option value=${option}>${option}</option>`
                input.value = placeholder;
            }
            break;
        case "counter":
            input.innerHTML += `<button onclick="increment('${name}')">-</button><p class="cval">0</p><button onclick="decrement('${name}')">+</button>`
            break; 
        case "buttonSelect":
    
            for(let option of options) {
                input.innerHTML += `<button onclick="buttonClick('${name}', '${option}', this)">${option}</button>`
                input.value = placeholder;
            }
            break;
        default: 
            break;
    }

    input.oninput = () => {
        local.matchData[name] = input.value;
        setLS();
    }

    inputContainer.appendChild(input);
    container.appendChild(inputContainer);
}

initMatch();