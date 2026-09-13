from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


# Comedy excuse database
EXCUSES = {
    "class": {
        "teacher": {
            "normal": "Sir, bus late aayi, athukond class miss aayi.",
            "cinema": "Sir, njan late aayathalla... samayam aanu enne kadannu poyath.",
            "mass": "Sir, class miss aayath intentional alla... but attendance systeminte loss aanu."
        },
        "amma": {
            "normal": "Amma, class time-il njan avide ethiyilla.",
            "cinema": "Amma, innu educationum destinyum thammil oru misunderstanding undayi.",
            "mass": "Amma, class enne miss cheythathaanu. Njan classine alla."
        },
        "uncle": {
            "normal": "Class miss aayi uncle.",
            "cinema": "Uncle, innathe journey oru journey aayirunnilla... oru experience aayirunnu.",
            "mass": "Uncle, njan classil poyilla. Athu oru decision aanu."
        }
    },

    "assignment": {
        "teacher": {
            "normal": "Sir, assignment complete cheyyan pattiyilla.",
            "cinema": "Sir, assignment ezhuthan irunnu... pakshe inspiration enne abandon cheythu.",
            "mass": "Sir, assignment ready aayirunnu. Submission aanu ready aayathalla."
        },
        "amma": {
            "normal": "Amma, assignment complete aayilla.",
            "cinema": "Amma, assignmentum njanum innu oru difficult phase-il aanu.",
            "mass": "Amma, assignment enne complete cheyyan sammathichilla."
        },
        "uncle": {
            "normal": "Assignment complete aayilla uncle.",
            "cinema": "Uncle, assignmentinte journey incomplete aayi.",
            "mass": "Assignment pending aanu. Athinte pressure njan handle cheyyunnundu."
        }
    },

    "late": {
        "teacher": {
            "normal": "Sir, kurachu late aayi.",
            "cinema": "Sir, clock enne betray cheythu.",
            "mass": "Sir, njan late alla. Time aanu early aayath."
        },
        "amma": {
            "normal": "Amma, kurachu late aayi.",
            "cinema": "Amma, innu samayam thanne enikku ethire aayirunnu.",
            "mass": "Amma, njan late alla. Ningal nerathe ready aayi."
        },
        "uncle": {
            "normal": "Kurachu late aayi uncle.",
            "cinema": "Uncle, time oru different direction-il aayirunnu.",
            "mass": "Uncle, late aayathu njan alla. Clock aanu."
        }
    },

    "study": {
        "teacher": {
            "normal": "Sir, nannayi study cheyyan pattiyilla.",
            "cinema": "Sir, book thurannu... knowledge vannilla.",
            "mass": "Sir, syllabus enne kandappol thanne njan mentally graduate aayi."
        },
        "amma": {
            "normal": "Amma, innu study kurachu kuranju poyi.",
            "cinema": "Amma, book thurannappol concentration oru different route eduthu.",
            "mass": "Amma, padikkanulla plan strong aayirunnu. Execution aanu weak."
        },
        "uncle": {
            "normal": "Study kurachu miss aayi uncle.",
            "cinema": "Uncle, books undayirunnu. Knowledge aanu absent.",
            "mass": "Uncle, syllabusine njan respect cheyyunnundu. Follow cheyyunnilla."
        }
    },

    "call": {
        "friend": {
            "normal": "Sorry da, call miss aayi.",
            "cinema": "Ninte call kandilla da... destiny thanne athu prevent cheythu.",
            "mass": "Call miss aayathaanu. Friendship miss aayittilla."
        },
        "amma": {
            "normal": "Amma, phone nokkiyilla.",
            "cinema": "Amma, phoneum njanum kurachu distance eduthu.",
            "mass": "Amma, phone undayirunnu. Attention aanu illathath."
        },
        "uncle": {
            "normal": "Call miss aayi uncle.",
            "cinema": "Uncle, phone ring cheythu... njan athinte gravity feel cheythilla.",
            "mass": "Uncle, call vannu. Timing correct alla."
        }
    },

    "project": {
        "teacher": {
            "normal": "Sir, project complete cheyyan kurachu time koodi venam.",
            "cinema": "Sir, project almost complete aanu... almost is doing a lot of work here.",
            "mass": "Sir, projectinte potential complete aanu. Project mathram pending."
        },
        "friend": {
            "normal": "Project complete aayilla da.",
            "cinema": "Projectum njanum oru character development phase-il aanu.",
            "mass": "Project pending aanu. Confidence complete aanu."
        },
        "uncle": {
            "normal": "Project complete aayilla uncle.",
            "cinema": "Uncle, project oru journey aanu, destination alla.",
            "mass": "Project pending aanu. Deadline aanu nervous."
        }
    }
}


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()

    situation = data.get("situation")
    target = data.get("target")
    mode = data.get("mode")

    # If that exact combination isn't available,
    # use a harmless generic response.
    excuse = (
        EXCUSES
        .get(situation, {})
        .get(target, {})
        .get(mode)
    )

    if not excuse:
        excuse = (
            "Actually, situation kurachu complicated aanu... "
            "EXCUSEDA investigation team is currently reviewing it. 😂"
        )

    # Comedy scores — intentionally playful, not real lie detection.
    scores = {
        "believability": 60 + len(excuse) % 31,
        "originality": 35 + len(excuse) % 60,
        "suspicion": 40 + len(excuse) % 55,
        "malayali_factor": 75 + len(excuse) % 26
    }

    verdicts = [
        "Classic excuse detected. 😂",
        "Amma might have questions.",
        "This excuse has suspicious levels of confidence.",
        "Technically an excuse. Emotionally questionable.",
        "The EXCUSEDA committee needs more evidence."
    ]

    verdict = verdicts[len(excuse) % len(verdicts)]

    return jsonify({
        "excuse": excuse,
        "believability": scores["believability"],
        "originality": scores["originality"],
        "suspicion": scores["suspicion"],
        "malayali_factor": scores["malayali_factor"],
        "verdict": verdict
    })


if __name__ == "__main__":
    app.run(debug=True)