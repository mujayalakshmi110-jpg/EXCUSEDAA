import os
import random
from flask import Flask, jsonify, render_template, request
from groq import Groq


# =========================================================
# EXCUSEDA - AI EXCUSE GENERATOR
# =========================================================

app = Flask(__name__)


# =========================================================
# GROQ API SETUP
# =========================================================

# Put your NEW Groq API key here.
#
# Example:
# GROQ_API_KEY = "gsk_your_new_key_here"
#
# DO NOT share your API key or upload it to GitHub.

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

FALLBACK_EXCUSES = {
    "class": [
        "Sir, njan class-il varan ready aayirunnu, pakshe vazhiyil oru small issue undayi. Ath solve cheythittu varaan poyappol timing full mess aayi.",
        "Class miss cheyyan plan onnum illaayirunnu sir. Njan nerathe irangiyatha, pakshe time enne manage cheythu.",
    ],
    "assignment": [
        "Assignment almost complete aayirunnu, pakshe last part-il oru mistake kandupidichu. Ath fix cheyyan poyi assignment-nekkal valiya project aayi.",
        "Assignment ready aayirunnu sir. Submit cheyyan thudangiyappol aanu oru formatting issue kandath, pinne athu full investigation aayi.",
    ],
    "late": [
        "Njan actually nerathe irangiyatha, pakshe vazhiyil unexpected delay undayi. Five minute aanu ennu karuthi, pinne timing full opposite aayi.",
        "Njan late aakan vendi plan cheythathalla. Time-inu ethum ennu full confidence undayirunnu, athaanu actual problem.",
    ],
    "study": [
        "Njan padikkan irunnatha, pakshe oru doubt solve cheyyan poyi vere moonu doubts kitti. Ath kazhinjappol book enne nokki, njan bookine nokki.",
        "Study start cheythu, pakshe brain ath save cheythittundo ennu confirm alla. Effort undayirunnu, result aanu leave eduthath.",
    ],
    "call": [
        "Phone kandilla ennu parayan pattilla, kandirunnu. Pakshe reply cheyyanulla mental preparation undayilla, athaanu delay aayath.",
        "Call miss aayath intentional alla. Phone silent-il aayirunnu, kandappol timing already oru Malayalam movie climax aayi.",
    ],
    "project": [
        "Project work cheythirunnu, pakshe oru small error vannappol ath fix cheyyan expected-nekkal time eduthu. Fix cheythappol vere error confidence-ode vannu.",
        "Project almost ready aanu. Code correct aanu ennu njan confident aayirunnu, pakshe computer-inu vere opinion aayirunnu.",
    ],
}


def local_excuse(situation, mode):
    text = situation.strip()
    category = text.lower() if text.lower() in FALLBACK_EXCUSES else None

    if category:
        excuse = random.choice(FALLBACK_EXCUSES[category])
    elif mode == "cinema":
        excuse = f"{text} was not a small issue; it was the unexpected interval twist in today's story. I tried to fix it, pakshe one problem became another, alle?"
    elif mode == "mass":
        excuse = f"{text} happened, but I had everything under control. The situation changed levels, macha, so the delay was temporary and totally strategic."
    else:
        excuse = f"Actually, {text} happened because I misunderstood one small detail. I tried to correct it immediately, but that took longer than expected."

    return excuse


# =========================================================
# HOME PAGE
# =========================================================

@app.route("/")
def home():
    return render_template("index.html")


# =========================================================
# GENERATE EXCUSE USING GROQ
# =========================================================

@app.route("/generate", methods=["POST"])
def generate():

    # Get data from JavaScript
    data = request.get_json() or {}

    situation = data.get("situation", "").strip()
    mode = data.get("mode", "").strip()


    # =====================================================
    # CHECK INPUT
    # =====================================================

    if not situation:
        return jsonify({
            "error": "Please choose a situation first.",
            "excuse": "",
            "believability": 0,
            "originality": 0,
            "suspicion": 0,
            "malayali_factor": 0,
            "verdict": "Choose a situation 😂"
        }), 400


    if not mode:
        return jsonify({
            "error": "Please choose an excuse mode.",
            "excuse": "",
            "believability": 0,
            "originality": 0,
            "suspicion": 0,
            "malayali_factor": 0,
            "verdict": "Choose a mode 🎭"
        }), 400


    # =====================================================
    # GROQ PROMPT
    # =====================================================

    prompt = f"""
You are EXCUSEDA, a hilarious Malayalam/Malayali-themed
fictional excuse generator for a comedy hackathon website.

Generate ONE sensible, funny and harmless fictional excuse in the
spirit of a Malayalam film comedy dialogue scene.

SITUATION:
{situation}

MODE:
{mode}

IMPORTANT REQUIREMENTS:

1. Make the excuse funny and creative.

2. Give it a strong Kerala/Malayali flavor.

3. You can use natural Manglish, Malayalam-style phrases,
   and English together.

4. Use the rhythm of a memorable Malayalam movie comedy dialogue:
    a clear setup, a logical reason, and a surprising punchline.

5. The exact situation above must control the entire excuse. Explain
    what happened, why it happened, and what the funny result was.
    Every sentence must connect to the same situation.

6. Take inspiration from broad Malayalam cinema comedy archetypes
    such as the overconfident hero, dramatic storyteller, confused
    friend, or strict-but-funny elder.

7. Do not copy, quote, or closely recreate any existing film dialogue,
    catchphrase, character, actor, or song lyric. Write a fresh original line.

8. Match the personality and style to the selected MODE:
    - normal: natural and lightly funny
    - cinema: dramatic, emotional, and full of movie-style buildup
    - mass: bold, punchy, overconfident, and crowd-pleasing

9. Make it sound like something a Malayali character might
   jokingly say.

9. Keep it suitable for a comedy website.

10. Do not provide dangerous, illegal, or harmful instructions.

11. Do not help someone evade serious consequences.

12. This is entertainment and comedy.

14. Keep the answer between 2 and 5 complete sentences.

15. Return ONLY the excuse.

16. Do NOT say:
    "Here is your excuse"
    "Generated excuse:"
    or any explanation.

Just give the funny excuse.
"""


    # =====================================================
    # SEND REQUEST TO GROQ
    # =====================================================

    try:

        if client is None:
            raise RuntimeError("GROQ_API_KEY is not configured")

        completion = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are EXCUSEDA, a funny "
                        "Malayali comedy excuse engine."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.85,

            max_tokens=220
        )


        # =================================================
        # GET AI RESPONSE
        # =================================================

        excuse = completion.choices[0].message.content


        if not excuse:
            raise RuntimeError(
                "Groq returned an empty response."
            )


        excuse = " ".join(excuse.split()).strip().strip('"\'')

        if len(excuse) < 30:
            raise RuntimeError("Groq returned an incomplete excuse.")

        if excuse.lower().startswith(("here is", "excuse:", "generated excuse:")):
            raise RuntimeError("Groq returned a labelled response.")


        # =================================================
        # CALCULATE FUN COMEDY SCORES
        # =================================================

        length = len(excuse)

        believability = 60 + (length % 31)

        originality = 40 + (length % 51)

        suspicion = 30 + (length % 61)

        malayali_factor = 75 + (length % 26)


        # =================================================
        # VERDICT
        # =================================================

        if suspicion >= 80:

            verdict = "🚨 Amma is already suspicious."

        elif originality >= 85:

            verdict = "🔥 Cinema-level excuse detected."

        elif believability >= 85:

            verdict = "🤨 Suspiciously believable."

        elif malayali_factor >= 90:

            verdict = "🇮🇳 Maximum Malayali energy detected."

        else:

            verdict = "😂 The EXCUSEDA committee approves."


        # =================================================
        # SEND RESULT BACK TO JAVASCRIPT
        # =================================================

        return jsonify({

            "excuse": excuse,

            "believability": believability,

            "originality": originality,

            "suspicion": suspicion,

            "malayali_factor": malayali_factor,

            "verdict": verdict

        })


    # =====================================================
    # ERROR HANDLING
    # =====================================================

    except Exception as error:
        app.logger.exception("Groq excuse generation failed")

        excuse = local_excuse(situation, mode)
        length = len(excuse)

        return jsonify({
            "excuse": excuse,
            "believability": 60 + (length % 31),
            "originality": 40 + (length % 51),
            "suspicion": 30 + (length % 61),
            "malayali_factor": 75 + (length % 26),
            "verdict": "😂 The EXCUSEDA committee has opinions."
        })


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )