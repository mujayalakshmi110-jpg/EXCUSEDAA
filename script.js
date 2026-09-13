let selectedSituation = null;
let selectedMode = null;

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    document.getElementById(pageId).classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToMode() {
    if (!selectedSituation) {
        const otherSituation = document.getElementById("otherSituationInput").value.trim();
        if (otherSituation) {
            selectedSituation = otherSituation;
        } else {
            alert("Choose or describe what happened! 😂");
            return;
        }
    }

    showPage("modePage");
}

function restart() {
    selectedSituation = null;
    selectedMode = null;
    document.querySelectorAll(".selected").forEach(button => button.classList.remove("selected"));
    showPage("welcomePage");
}


// -----------------------------
// SITUATION
// -----------------------------

function selectSituation(button, value) {

    document
        .querySelectorAll(".options")[0]
        .querySelectorAll(".option")
        .forEach(btn => {
            btn.classList.remove("selected");
        });

    button.classList.add("selected");

    selectedSituation = value;
    document.getElementById("otherSituation").classList.add("hidden");
}


// -----------------------------
// OTHER SITUATION
// -----------------------------

function selectOtherSituation(button) {
    document
        .querySelectorAll("#situationPage .option")
        .forEach(btn => btn.classList.remove("selected"));

    button.classList.add("selected");
    selectedSituation = null;
    document.getElementById("otherSituation").classList.remove("hidden");
    document.getElementById("otherSituationInput").focus();
}


// -----------------------------
// MODE
// -----------------------------

function selectMode(button, value) {

    document.querySelectorAll(".mode").forEach(btn => {
        btn.classList.remove("selected");
    });

    button.classList.add("selected");

    selectedMode = value;
}


// -----------------------------
// GENERATE EXCUSE
// -----------------------------

async function generateExcuse() {
    if (!selectedSituation) {
        alert("First choose what happened! 😂");
        return;
    }

    if (!selectedMode) {
        alert("Choose an excuse mode! 🎭");
        return;
    }


    showPage("result");

    document.getElementById("excuseText").innerText =
        "EXCUSEDA is manufacturing nonsense... 🤖";


    try {

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


        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.details || data.error || "Groq request failed.");
        }


        document.getElementById("excuseText").innerText =
            data.excuse;

        document.getElementById("believability").innerText =
            data.believability;

        document.getElementById("originality").innerText =
            data.originality;

        document.getElementById("suspicion").innerText =
            data.suspicion;

        document.getElementById("malayali").innerText =
            data.malayali_factor;

        document.getElementById("verdict").innerText =
            data.verdict;


    } catch (error) {

        console.error(error);

        document.getElementById("excuseText").innerText =
            `Groq could not generate the excuse: ${error.message}`;

    }
}


// -----------------------------
// AMMA TEST
// -----------------------------

function ammaTest() {

    alert(
        "👩 AMMA DETECTOR\n\n" +
        "🟥 SUSPICIOUS ACTIVITY DETECTED\n\n" +
        "\"Ithu nee paranja story alle?\"\n\n" +
        "AMMA CONFIDENCE: 99% 😂"
    );
}

function copyExcuse() {
    const excuse = document.getElementById("excuseText").innerText;
    navigator.clipboard.writeText(excuse).then(() => {
        alert("Excuse copied! 📋");
    });
}