from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.corpus.reader.wordnet import NOUN, VERB, ADJ, ADV
import csv
import os
import traceback

# ------------------ INIT ------------------

app = Flask(__name__)
CORS(app)

print("FLASK RUNNING FROM:", os.getcwd())

# ------------------ NLTK DOWNLOADS ------------------

nltk.download("stopwords")
nltk.download("wordnet")
nltk.download("punkt")
nltk.download("averaged_perceptron_tagger")

# ------------------ UPLOAD CONFIG ------------------

UPLOAD_FOLDER = "uploads/videos"
ALLOWED_EXTENSIONS = {"mp4", "avi", "mov", "mkv"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ------------------ NLP SETUP ------------------

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words("english"))

important_words = {"i", "me", "my", "not", "no", "never", "can", "will"}
stop_words = stop_words - important_words

# ------------------ ISL MAPPING ------------------

isl_mapping = {
    "i": "I",
    "go": "GO",
    "school": "SCHOOL",
    "today": "TODAY",
    "tommorow": "TOMMOROW",
    "hello": "HELLO",
    "you": "YOU"
}

DATASET_FILE = "isl_dataset.csv"

# ------------------ HELPERS ------------------

def allowed_file(filename):
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def save_to_dataset(input_text, isl_gloss):
    file_exists = os.path.isfile(DATASET_FILE)
    with open(DATASET_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["input_text", "isl_gloss"])
        writer.writerow([input_text, " ".join(isl_gloss)])


def get_wordnet_pos(tag):
    if tag.startswith("J"):
        return ADJ
    elif tag.startswith("V"):
        return VERB
    elif tag.startswith("N"):
        return NOUN
    elif tag.startswith("R"):
        return ADV
    else:
        return NOUN


# ISL Grammar: Time → Object → Verb (+ Negation at end)
def reorder_for_isl(lemmatized_tokens, pos_tags):
    time_words, obj_words, verb_words = [], [], []

    for i, (word, tag) in enumerate(pos_tags):
        lemma = lemmatized_tokens[i]

        if lemma.lower() in ["today", "tommorow", "yesterday"]:
            time_words.append(lemma)
        elif tag.startswith("V"):
            verb_words.append(lemma)
        else:
            obj_words.append(lemma)

    negation = [w for w in obj_words if w == "not"]
    obj_words = [w for w in obj_words if w != "not"]

    return time_words + obj_words + verb_words + negation


# ------------------ ROUTES ------------------

@app.route("/")
def home():
    return "SignifyEd Backend Running Successfully"


# -------- TEXT → ISL --------

@app.route("/process", methods=["POST"])
def process_text():
    try:
        data = request.get_json(force=True)
        input_text = data.get("text", "").lower()

        tokens = nltk.word_tokenize(input_text)

        filtered_tokens = [
            w for w in tokens if w.isalpha() and w not in stop_words
        ]

        pos_tags = nltk.pos_tag(filtered_tokens)

        lemmatized_tokens = [
            lemmatizer.lemmatize(word, get_wordnet_pos(tag))
            for word, tag in pos_tags
        ]

        isl_ordered_tokens = reorder_for_isl(lemmatized_tokens, pos_tags)

        isl_gloss = [
            isl_mapping.get(token.lower(), token.upper())
            for token in isl_ordered_tokens
        ]

        save_to_dataset(input_text, isl_gloss)

        return jsonify({
            "original": input_text,
            "processed": lemmatized_tokens,
            "isl_gloss": isl_gloss
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# -------- VIDEO UPLOAD + OPTIONAL NLP --------

@app.route("/upload_video", methods=["POST"])
def upload_video():
    try:
        if "video" not in request.files:
            return jsonify({"error": "No video file provided"}), 400

        file = request.files["video"]

        if file.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400

        filename = secure_filename(file.filename)
        video_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        file.save(video_path)
        print("Video saved:", video_path)

        # -------- STEP 1: CHECK AUDIO --------
        from video_utils import has_audio, extract_audio

        if not has_audio(video_path):
            return jsonify({
                "error": "Uploaded video does not contain audio. Please upload a video with audio."
            }), 400

        # -------- STEP 2: EXTRACT AUDIO --------
        audio_path = os.path.splitext(video_path)[0] + ".wav"
        extract_audio(video_path, audio_path)

        # -------- STEP 3: SPEECH TO TEXT --------
        from asr_utils import audio_to_text

        transcript = audio_to_text(audio_path).lower()
        print("Transcript:", transcript)

        # -------- STEP 4: NLP PIPELINE --------
        tokens = nltk.word_tokenize(transcript)

        filtered_tokens = [
            w for w in tokens if w.isalpha() and w not in stop_words
        ]

        pos_tags = nltk.pos_tag(filtered_tokens)

        lemmatized_tokens = [
            lemmatizer.lemmatize(word, get_wordnet_pos(tag))
            for word, tag in pos_tags
        ]

        isl_ordered_tokens = reorder_for_isl(lemmatized_tokens, pos_tags)

        isl_gloss = [
            isl_mapping.get(token.lower(), token.upper())
            for token in isl_ordered_tokens
        ]

        return jsonify({
            "transcript": transcript,
            "isl_gloss": isl_gloss
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# -------- TOKEN → GLOSS --------

@app.route("/to_gloss", methods=["POST"])
def to_gloss():
    try:
        data = request.get_json(force=True)
        tokens = data.get("tokens", [])

        gloss = [
            isl_mapping.get(token.lower(), token.upper())
            for token in tokens
        ]

        return jsonify({
            "tokens": tokens,
            "gloss": gloss
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ------------------ MAIN ------------------

if __name__ == "__main__":
    app.run(debug=True)
