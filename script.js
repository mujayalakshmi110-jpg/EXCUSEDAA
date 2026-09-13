let selectedSituation = null;
let selectedMode = null;

function speakWelcome() {
    if (!window.speechSynthesis) {
        return;
    }

    const welcome = new SpeechSynthesisUtterance(
        "Welcome to EXCUSEDA... the Kerala excuse engine is ready."
    );
    welcome.lang = "en-IN";
    welcome.rate = 0.78;
    welcome.pitch = 0.65;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(welcome);
}

function welcomeAndStart() {
    speakWelcome();
    showPage("situationPage");
}


// =========================================================
// PAGE NAVIGATION
// =========================================================

function showPage(pageId) {

    // Hide every page and the result section
    document
        .querySelectorAll(".page, #result")
        .forEach(page => {
            page.classList.add("hidden");
        });

    // Show requested page
    const page = document.getElementById(pageId);

    if (page) {
        page.classList.remove("hidden");
    }

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =========================================================
// GO TO MODE PAGE
// =========================================================

function goToMode() {

    // If no normal situation was selected,
    // check the "Other" input
    if (!selectedSituation) {

        const input =
            document.getElementById("otherSituationInput");

        const otherSituation =
            input.value.trim();

        if (otherSituation) {

            selectedSituation = otherSituation;

        } else {

            alert(
                "Choose or describe what happened! 😂"
            );

            return;
        }
    }

    showPage("modePage");
}


// =========================================================
// RESTART
// =========================================================

function restart() {

    selectedSituation = null;
    selectedMode = null;

    // Remove selected state
    document
        .querySelectorAll(".selected")
        .forEach(button => {
            button.classList.remove("selected");
        });

    // Clear Other input
    const input =
        document.getElementById("otherSituationInput");

    if (input) {
        input.value = "";
    }

    // Hide Other section
    const other =
        document.getElementById("otherSituation");

    if (other) {
        other.classList.add("hidden");
    }

    showPage("welcomePage");
}


// =========================================================
// SITUATION SELECTION
// =========================================================

function selectSituation(button, value) {

    // Remove selected from situation buttons
    document
        .querySelectorAll("#situationPage .option")
        .forEach(btn => {
            btn.classList.remove("selected");
        });

    // Select clicked button
    button.classList.add("selected");

    // Save situation
    selectedSituation = value;

    // Hide Other input
    document
        .getElementById("otherSituation")
        .classList.add("hidden");

    // Clear Other input
    document
        .getElementById("otherSituationInput")
        .value = "";
}


// =========================================================
// OTHER SITUATION
// =========================================================

function selectOtherSituation(button) {

    // Remove selected from all situation buttons
    document
        .querySelectorAll("#situationPage .option")
        .forEach(btn => {
            btn.classList.remove("selected");
        });

    // Select Other
    button.classList.add("selected");

    // Clear predefined situation
    selectedSituation = null;

    // Show input
    document
        .getElementById("otherSituation")
        .classList.remove("hidden");

    // Focus input
    document
        .getElementById("otherSituationInput")
        .focus();
}


// =========================================================
// MODE SELECTION
// =========================================================

function selectMode(button, value) {

    // Remove selected from all modes
    document
        .querySelectorAll(".mode")
        .forEach(btn => {
            btn.classList.remove("selected");
        });

    // Select clicked mode
    button.classList.add("selected");

    // Save mode
    selectedMode = value;
}


// =========================================================
// GENERATE EXCUSE
// =========================================================

async function generateExcuse() {

    // Check situation
    if (!selectedSituation) {

        alert(
            "First choose what happened! 😂"
        );

        return;
    }


    // Check mode
    if (!selectedMode) {

        alert(
            "Choose an excuse mode! 🎭"
        );

        return;
    }


    // Show the excuse analysis directly.
    showPage("result");


    // Show loading message
    document
        .getElementById("excuseText")
        .innerText =
        "EXCUSEDA is manufacturing nonsense... 🤖";


    // Reset scores while loading
    document
        .getElementById("believability")
        .innerText = "--%";

    document
        .getElementById("originality")
        .innerText = "--%";

    document
        .getElementById("suspicion")
        .innerText = "--%";

    document
        .getElementById("malayali")
        .innerText = "--%";

    document
        .getElementById("verdict")
        .innerText =
        "Consulting the EXCUSEDA committee...";

    try {

        // =================================================
        // SEND REQUEST TO FLASK
        // =================================================

        const response = await fetch("/generate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                situation: selectedSituation,

                mode: selectedMode

            })

        });


        // Convert response to JSON
        const data = await response.json();


        // =================================================
        // CHECK FOR BACKEND ERROR
        // =================================================

        if (!response.ok) {

            throw new Error(
                data.details ||
                data.error ||
                "Groq request failed."
            );
        }


        // =================================================
        // DISPLAY AI EXCUSE
        // =================================================

        document
            .getElementById("excuseText")
            .innerText = data.excuse;


        // =================================================
        // DISPLAY SCORES
        // =================================================

        document
            .getElementById("believability")
            .innerText =
                `${data.believability}%`;


        document
            .getElementById("originality")
            .innerText =
                `${data.originality}%`;


        document
            .getElementById("suspicion")
            .innerText =
                `${data.suspicion}%`;


        document
            .getElementById("malayali")
            .innerText =
                `${data.malayali_factor}%`;


        // =================================================
        // DISPLAY VERDICT
        // =================================================

        document
            .getElementById("verdict")
            .innerText =
            data.verdict;

    }


    // =====================================================
    // ERROR
    // =====================================================

    catch (error) {

        console.error(
            "EXCUSEDA ERROR:",
            error
        );


        const backup = getLocalExcuse(selectedSituation, selectedMode);
        displayBackupResult(backup);
    }
}


// =========================================================
// LOCAL FALLBACK
// =========================================================

function getLocalExcuse(situation, mode) {
    const excuses = {
        normal: `Actually, ${situation} happened because my plan and reality had a small Kerala-style disagreement.`,
        cinema: `${situation} was not an accident; it was a dramatic twist written by destiny itself, alle?`,
        mass: `${situation} happened because I operate on a different level. Even time had to adjust, macha.`
    };
    const excuse = excuses[mode] || excuses.normal;
    const length = excuse.length;

    return {
        excuse,
        believability: 60 + length % 31,
        originality: 40 + length % 51,
        suspicion: 30 + length % 61,
        malayali_factor: 75 + length % 26,
        verdict: "😂 The EXCUSEDA committee has opinions."
    };
}

function displayBackupResult(data) {
    document.getElementById("excuseText").innerText = data.excuse;
    document.getElementById("believability").innerText = `${data.believability}%`;
    document.getElementById("originality").innerText = `${data.originality}%`;
    document.getElementById("suspicion").innerText = `${data.suspicion}%`;
    document.getElementById("malayali").innerText = `${data.malayali_factor}%`;
    document.getElementById("verdict").innerText = data.verdict;
}


// =========================================================
// COPY EXCUSE
// =========================================================

function copyExcuse() {

    const excuse =
        document
            .getElementById("excuseText")
            .innerText;


    if (!excuse) {

        alert(
            "There is no excuse to copy yet! 😂"
        );

        return;
    }


    navigator.clipboard
        .writeText(excuse)

        .then(() => {

            alert(
                "Excuse copied! 📋"
            );

        })

        .catch(() => {

            alert(
                "Couldn't copy automatically. Try selecting the text manually."
            );

        });
}