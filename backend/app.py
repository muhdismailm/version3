from flask import Flask, request, jsonify
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.corpus.reader.wordnet import NOUN, VERB, ADJ, ADV


nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')
nltk.download('punkt_tab') 
nltk.download('averaged_perceptron_tagger')
nltk.download('averaged_perceptron_tagger_eng') 

app = Flask(__name__)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# helper function: map nltk pos to wordnet pos
def get_wordnet_pos(tag):
    if tag.startswith('J'):
        return ADJ
    elif tag.startswith('V'):
        return VERB
    elif tag.startswith('N'):
        return NOUN
    elif tag.startswith('R'):
        return ADV
    else:
        return NOUN 

@app.route('/')
def home():
    return "Flask server is running!"

@app.route('/process', methods=['POST'])
def process_text():
    try:
        data = request.get_json(force=True)
        input_text = data.get("text", "")

        print("Input received:", input_text)

        # 1. Lowercase
        input_text = input_text.lower()

        # 2. Tokenize
        tokens = nltk.word_tokenize(input_text)
        print("Tokens:", tokens)

         # 3. Remove stopwords & non-alphabetic tokens
        filtered_tokens = [word for word in tokens if word.isalpha() and word not in stop_words]

        # 4. POS tagging
        pos_tags = nltk.pos_tag(filtered_tokens)

        # 5. Lemmatization with POS
        lemmatized_tokens = [lemmatizer.lemmatize(word, get_wordnet_pos(tag)) for word, tag in pos_tags]

        print("Filtered Tokens:", filtered_tokens)
        print("POS Tags:", pos_tags)
        print("Lemmatized Tokens:", lemmatized_tokens)

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
