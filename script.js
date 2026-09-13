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
    const otherSection = document.getElementById("otherSituation");
    const isOtherSituation = otherSection && !otherSection.classList.contains("hidden");

    if (isOtherSituation) {
        const input = document.getElementById("otherSituationInput");

        if (!input) {
            alert("Other situation input not found!");
            return;
        }

        const situation = input.value.trim();

        if (!situation) {
            alert("Tell EXCUSEDA what happened first! 😂");
            return;
        }

        selectedSituation = situation;
    }

    if (!selectedSituation) {
        alert("Choose what happened first! 😭");
        return;
    }

    console.log("Selected situation:", selectedSituation);

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

    const input = document.getElementById("otherSituationInput");
    const typedText = input ? input.value.trim() : "";
    selectedSituation = typedText || null;

    document.getElementById("otherSituation").classList.remove("hidden");
    if (input) input.focus();
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
                mode: selectedMode,
                target: "custom"

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