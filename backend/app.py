from flask import Flask, request, jsonify
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download('stopwords')
nltk.download('wordnet')

app = Flask(__name__)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

@app.route('/')
def home():
    return "Flask server is running!"

@app.route('/process', methods=['POST'])
def process_text():
    try:
        data = request.get_json(force=True)
        input_text = data.get("text", "")

        print("Input received:", input_text)

        input_text = input_text.lower()
        tokens = input_text.split()  # No word_tokenize used
        print("Tokens:", tokens)

        filtered_tokens = [word for word in tokens if word.isalpha() and word not in stop_words]
        lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]

        return jsonify({
            "original": input_text,
            "processed": lemmatized_tokens
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
